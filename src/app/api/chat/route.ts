import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// ---------------------------------------------------------------------------
// In-memory storage using globalThis so data survives Next.js hot reloads
// ---------------------------------------------------------------------------
interface ChatSessionRow {
  id: string;
  customerId: string;
  agentId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessageRow[];
}

interface ChatMessageRow {
  id: string;
  senderId: string;
  senderType: string;
  content: string;
  timestamp: string;
}

// Persist across hot reloads via globalThis
const g = globalThis as any;
if (!g.__chatSessions) g.__chatSessions = [] as ChatSessionRow[];

function getSessions(): ChatSessionRow[] {
  return g.__chatSessions;
}

// ---------------------------------------------------------------------------
// Try DB, fall back to in-memory
// ---------------------------------------------------------------------------
let dbAvailable: boolean | null = null; // null = not checked yet

async function tryDB<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  // If we already know DB is down, skip
  if (dbAvailable === false) return fallback();

  try {
    const result = await fn();
    dbAvailable = true;
    return result;
  } catch {
    if (dbAvailable === null) {
      console.warn('[Chat] Database unavailable — using in-memory storage');
    }
    dbAvailable = false;
    return fallback();
  }
}

// Ensure tables exist when DB is reachable
let tablesReady = false;
async function ensureTables() {
  if (tablesReady || dbAvailable === false) return;
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id VARCHAR(100) PRIMARY KEY,
        customer_id VARCHAR(255) NOT NULL,
        agent_id VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(100) PRIMARY KEY,
        session_id VARCHAR(100) NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
        sender_id VARCHAR(255) NOT NULL,
        sender_type VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    tablesReady = true;
  } catch {
    dbAvailable = false;
  }
}

// ---------------------------------------------------------------------------
// Static agents list
// ---------------------------------------------------------------------------
const agents = [
  { id: 'agent-1', name: 'Ahmed Hassan', specialty: 'AC Services', isAvailable: true, currentChatSessionId: null as string | null },
  { id: 'agent-2', name: 'Mohammed Ali', specialty: 'Electrical Work', isAvailable: true, currentChatSessionId: null as string | null },
  { id: 'agent-3', name: 'Fatima Al-Mehri', specialty: 'Plumbing', isAvailable: true, currentChatSessionId: null as string | null },
  { id: 'agent-4', name: 'Omar Al-Rashid', specialty: 'General Maintenance', isAvailable: true, currentChatSessionId: null as string | null },
];

// ===========================================================================
// GET — fetch agents / messages / sessions
// ===========================================================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const userType = searchParams.get('userType');
  const includeAgents = searchParams.get('agents');

  try {
    await ensureTables();

    // --- Agents list ---
    if (includeAgents) {
      return NextResponse.json(agents);
    }

    // --- Messages for a session ---
    if (sessionId) {
      return await tryDB(
        async () => {
          const rows = await query<{ id: string; customer_id: string }>(
            'SELECT id, customer_id FROM chat_sessions WHERE id = $1', [sessionId]
          );
          if (rows.length === 0) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

          if (userType === 'customer') {
            const customerId = searchParams.get('customerId');
            if (rows[0].customer_id !== customerId) {
              return NextResponse.json({ error: 'Access denied' }, { status: 403 });
            }
          }

          const messages = await query(
            `SELECT id, sender_id AS "senderId", sender_type AS "senderType", content, created_at AS "timestamp"
             FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC`, [sessionId]
          );
          return NextResponse.json(messages);
        },
        () => {
          const session = getSessions().find(s => s.id === sessionId);
          if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

          if (userType === 'customer') {
            const customerId = searchParams.get('customerId');
            if (session.customerId !== customerId) {
              return NextResponse.json({ error: 'Access denied' }, { status: 403 });
            }
          }
          return NextResponse.json(session.messages);
        }
      );
    }

    // --- All active sessions (admin/staff) ---
    if (userType === 'admin' || userType === 'staff') {
      return await tryDB(
        async () => {
          const sessions = await query(
            `SELECT id, customer_id AS "customerId", agent_id AS "agentId", is_active AS "isActive",
                    created_at AS "createdAt", updated_at AS "updatedAt"
             FROM chat_sessions WHERE is_active = true ORDER BY updated_at DESC`
          );
          return NextResponse.json(sessions);
        },
        () => {
          const active = getSessions().filter(s => s.isActive).map(({ messages, ...rest }) => rest);
          return NextResponse.json(active);
        }
      );
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching chat data:', error);
    return NextResponse.json({ error: 'Failed to fetch chat data' }, { status: 500 });
  }
}

// ===========================================================================
// POST — create a new session
// ===========================================================================
export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    const { customerId, preferredSpecialty } = await request.json();

    let availableAgent = null;
    if (preferredSpecialty) {
      availableAgent = agents.find(a => a.isAvailable && a.specialty.toLowerCase().includes(preferredSpecialty.toLowerCase()));
    }
    if (!availableAgent) {
      availableAgent = agents.find(a => a.isAvailable) || agents[0];
    }

    const sessionId = `session-${Date.now()}`;
    const now = new Date().toISOString();

    const newSession = {
      id: sessionId,
      customerId,
      agentId: availableAgent.id,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await tryDB(
      async () => {
        await query(
          'INSERT INTO chat_sessions (id, customer_id, agent_id, is_active, created_at, updated_at) VALUES ($1,$2,$3,true,$4,$4)',
          [sessionId, customerId, availableAgent!.id, now]
        );
      },
      () => {
        getSessions().push({ ...newSession, messages: [] });
      }
    );

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 });
  }
}

// ===========================================================================
// PUT — send a message
// ===========================================================================
export async function PUT(request: NextRequest) {
  try {
    await ensureTables();
    const { sessionId, senderId, senderType, content, customerId } = await request.json();
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const newMessage = { id: messageId, senderId, senderType, content, timestamp: now };

    await tryDB(
      async () => {
        const rows = await query<{ id: string; customer_id: string }>(
          'SELECT id, customer_id FROM chat_sessions WHERE id = $1', [sessionId]
        );
        if (rows.length === 0) throw new Error('not_found');

        if (senderType === 'customer' && rows[0].customer_id !== senderId && rows[0].customer_id !== customerId) {
          throw new Error('unauthorized');
        }

        await query(
          'INSERT INTO chat_messages (id, session_id, sender_id, sender_type, content, created_at) VALUES ($1,$2,$3,$4,$5,$6)',
          [messageId, sessionId, senderId, senderType, content, now]
        );
        await query('UPDATE chat_sessions SET updated_at = $1 WHERE id = $2', [now, sessionId]);
      },
      () => {
        const session = getSessions().find(s => s.id === sessionId);
        if (!session) throw new Error('not_found');

        if (senderType === 'customer' && session.customerId !== senderId && session.customerId !== customerId) {
          throw new Error('unauthorized');
        }

        session.messages.push(newMessage);
        session.updatedAt = now;
      }
    );

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    if (error?.message === 'not_found') return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (error?.message === 'unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// ===========================================================================
// DELETE — close a session
// ===========================================================================
export async function DELETE(request: NextRequest) {
  try {
    await ensureTables();
    const sessionId = new URL(request.url).searchParams.get('sessionId');
    if (!sessionId) return NextResponse.json({ error: 'Session ID required' }, { status: 400 });

    await tryDB(
      async () => {
        const result = await query('UPDATE chat_sessions SET is_active = false, updated_at = $1 WHERE id = $2 RETURNING id', [new Date().toISOString(), sessionId]);
        if ((result as any[]).length === 0) throw new Error('not_found');
      },
      () => {
        const session = getSessions().find(s => s.id === sessionId);
        if (!session) throw new Error('not_found');
        session.isActive = false;
        session.updatedAt = new Date().toISOString();
      }
    );

    return NextResponse.json({ message: 'Session closed successfully' });
  } catch (error: any) {
    if (error?.message === 'not_found') return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    console.error('Error closing session:', error);
    return NextResponse.json({ error: 'Failed to close session' }, { status: 500 });
  }
}
