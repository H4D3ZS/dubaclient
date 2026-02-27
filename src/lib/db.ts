import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'service_requests',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Test connection on startup
pool.on('connect', () => {
    console.log('Database connected successfully');
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

// Query helper function
export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result.rows as T[];
    } finally {
        client.release();
    }
}

// Service request interface
export interface ServiceRequest {
    id: number;
    reference_number: string;
    full_name: string;
    phone: string;
    email: string;
    emirate: string;
    address: string;
    property_type: string;
    services: string[];
    preferred_date: string;
    preferred_time: string;
    urgency: string;
    description?: string;
    additional_notes?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    assigned_to?: string;
    created_at: Date;
    updated_at: Date;
}

// Initialize database schema
export async function initializeDatabase(): Promise<void> {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS service_requests (
            id SERIAL PRIMARY KEY,
            reference_number VARCHAR(50) UNIQUE NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL,
            emirate VARCHAR(100),
            address TEXT,
            property_type VARCHAR(50),
            services TEXT[] NOT NULL,
            preferred_date DATE,
            preferred_time VARCHAR(50),
            urgency VARCHAR(20) DEFAULT 'normal',
            description TEXT,
            additional_notes TEXT,
            status VARCHAR(20) DEFAULT 'pending',
            assigned_to VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
        CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_service_requests_reference ON service_requests(reference_number);

        CREATE TABLE IF NOT EXISTS chat_sessions (
            id VARCHAR(100) PRIMARY KEY,
            customer_id VARCHAR(255) NOT NULL,
            agent_id VARCHAR(100),
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON chat_sessions(is_active);
        CREATE INDEX IF NOT EXISTS idx_chat_sessions_customer ON chat_sessions(customer_id);

        CREATE TABLE IF NOT EXISTS chat_messages (
            id VARCHAR(100) PRIMARY KEY,
            session_id VARCHAR(100) NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
            sender_id VARCHAR(255) NOT NULL,
            sender_type VARCHAR(20) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
        CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
    `;

    try {
        await query(createTableQuery);
        console.log('Database schema initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

export default pool;
