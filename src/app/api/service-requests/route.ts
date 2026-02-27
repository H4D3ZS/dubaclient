import { NextRequest, NextResponse } from 'next/server';
import { query, initializeDatabase, ServiceRequest } from '@/lib/db';

// Ensure database is initialized
let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        try {
            await initializeDatabase();
            dbInitialized = true;
        } catch (error) {
            console.error('Database initialization failed:', error);
        }
    }
}

// GET - List all service requests
export async function GET(request: NextRequest) {
    await ensureDb();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const service = searchParams.get('service');
    const location = searchParams.get('location');

    try {
        let queryText = 'SELECT * FROM service_requests';
        const conditions: string[] = [];
        const params: unknown[] = [];
        let paramIndex = 1;

        if (status && status !== 'all') {
            conditions.push(`status = $${paramIndex}`);
            params.push(status);
            paramIndex++;
        }

        if (search) {
            conditions.push(`(
                full_name ILIKE $${paramIndex} OR
                phone ILIKE $${paramIndex} OR
                email ILIKE $${paramIndex} OR
                reference_number ILIKE $${paramIndex}
            )`);
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (startDate) {
            conditions.push(`created_at >= $${paramIndex}::timestamp`);
            params.push(startDate);
            paramIndex++;
        }

        if (endDate) {
            conditions.push(`created_at <= $${paramIndex}::timestamp`);
            params.push(endDate);
            paramIndex++;
        }

        if (service && service !== 'all') {
            conditions.push(`services @> ARRAY[$${paramIndex}]::TEXT[]`);
            params.push(service);
            paramIndex++;
        }

        if (location && location !== 'all') {
            conditions.push(`emirate ILIKE $${paramIndex}`);
            params.push(`%${location}%`);
            paramIndex++;
        }

        if (conditions.length > 0) {
            queryText += ' WHERE ' + conditions.join(' AND ');
        }

        queryText += ' ORDER BY created_at DESC';

        const results = await query<ServiceRequest>(queryText, params);
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching service requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch service requests' },
            { status: 500 }
        );
    }
}

// POST - Create new service request
export async function POST(request: NextRequest) {
    await ensureDb();

    try {
        const body = await request.json();

        const insertQuery = `
            INSERT INTO service_requests (
                reference_number, full_name, phone, email, emirate, address,
                property_type, services, preferred_date, preferred_time,
                urgency, description, additional_notes, status, assigned_to
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `;

        const params = [
            body.referenceNumber ?? body.reference_number,
            body.fullName ?? body.full_name,
            body.phone,
            body.email,
            body.emirate ?? null,
            body.address ?? null,
            body.propertyType ?? body.property_type ?? null,
            body.services ?? [],
            body.preferredDate ?? body.preferred_date ?? null,
            body.preferredTime ?? body.preferred_time ?? null,
            body.urgency ?? 'normal',
            body.description ?? null,
            body.additionalNotes ?? body.additional_notes ?? null,
            body.status ?? 'pending',
            body.assignedTo ?? body.assigned_to ?? null
        ];

        const result = await query<ServiceRequest>(insertQuery, params);
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error creating service request:', error);
        return NextResponse.json(
            { error: 'Failed to create service request' },
            { status: 500 }
        );
    }
}
