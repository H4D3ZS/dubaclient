import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, query, ServiceRequest } from '@/lib/db';

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

// GET - Get single service request
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await ensureDb();
    const { id } = await params;

    try {
        const result = await query<ServiceRequest>(
            'SELECT * FROM service_requests WHERE id = $1',
            [id]
        );

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Service request not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error fetching service request:', error);
        return NextResponse.json(
            { error: 'Failed to fetch service request' },
            { status: 500 }
        );
    }
}

// PATCH - Update service request
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await ensureDb();
    const { id } = await params;

    try {
        const body = await request.json();
        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        const status = body.status;
        const assignedTo = body.assignedTo ?? body.assigned_to;
        const referenceNumber = body.referenceNumber ?? body.reference_number;
        const fullName = body.fullName ?? body.full_name;
        const phone = body.phone;
        const email = body.email;
        const emirate = body.emirate;
        const address = body.address;
        const propertyType = body.propertyType ?? body.property_type;
        const services = body.services;
        const preferredDate = body.preferredDate ?? body.preferred_date;
        const preferredTime = body.preferredTime ?? body.preferred_time;
        const urgency = body.urgency;
        const description = body.description;
        const additionalNotes = body.additionalNotes ?? body.additional_notes;

        if (status) {
            updates.push(`status = $${paramIndex}`);
            values.push(status);
            paramIndex++;
        }

        if (assignedTo !== undefined) {
            updates.push(`assigned_to = $${paramIndex}`);
            values.push(assignedTo);
            paramIndex++;
        }

        if (referenceNumber !== undefined) {
            updates.push(`reference_number = $${paramIndex}`);
            values.push(referenceNumber);
            paramIndex++;
        }

        if (fullName !== undefined) {
            updates.push(`full_name = $${paramIndex}`);
            values.push(fullName);
            paramIndex++;
        }

        if (phone !== undefined) {
            updates.push(`phone = $${paramIndex}`);
            values.push(phone);
            paramIndex++;
        }

        if (email !== undefined) {
            updates.push(`email = $${paramIndex}`);
            values.push(email);
            paramIndex++;
        }

        if (emirate !== undefined) {
            updates.push(`emirate = $${paramIndex}`);
            values.push(emirate);
            paramIndex++;
        }

        if (address !== undefined) {
            updates.push(`address = $${paramIndex}`);
            values.push(address);
            paramIndex++;
        }

        if (propertyType !== undefined) {
            updates.push(`property_type = $${paramIndex}`);
            values.push(propertyType);
            paramIndex++;
        }

        if (services !== undefined) {
            updates.push(`services = $${paramIndex}`);
            values.push(services);
            paramIndex++;
        }

        if (preferredDate !== undefined) {
            updates.push(`preferred_date = $${paramIndex}`);
            values.push(preferredDate);
            paramIndex++;
        }

        if (preferredTime !== undefined) {
            updates.push(`preferred_time = $${paramIndex}`);
            values.push(preferredTime);
            paramIndex++;
        }

        if (urgency !== undefined) {
            updates.push(`urgency = $${paramIndex}`);
            values.push(urgency);
            paramIndex++;
        }

        if (description !== undefined) {
            updates.push(`description = $${paramIndex}`);
            values.push(description);
            paramIndex++;
        }

        if (additionalNotes !== undefined) {
            updates.push(`additional_notes = $${paramIndex}`);
            values.push(additionalNotes);
            paramIndex++;
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            );
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const updateQuery = `
            UPDATE service_requests 
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await query<ServiceRequest>(updateQuery, values);

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Service request not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating service request:', error);
        return NextResponse.json(
            { error: 'Failed to update service request' },
            { status: 500 }
        );
    }
}

// DELETE - Delete service request
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await ensureDb();
    const { id } = await params;

    try {
        const result = await query<ServiceRequest>(
            'DELETE FROM service_requests WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Service request not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Service request deleted' });
    } catch (error) {
        console.error('Error deleting service request:', error);
        return NextResponse.json(
            { error: 'Failed to delete service request' },
            { status: 500 }
        );
    }
}
