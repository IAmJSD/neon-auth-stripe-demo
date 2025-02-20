import type Stripe from 'stripe';
import { db } from '@/singletons/database';
import * as schema from '@/schema';
import { eq, ExtractTablesWithRelations, sql } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';

type NeonTx = PgTransaction<NeonQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

async function processSuccessfulCheckoutSession(session: Stripe.Checkout.Session, userId: string, tx: NeonTx) {
    // TODO: Implement your own logic here.
    await tx
        .insert(schema.neonBucks)
        .values({
            userId,
            amount: 1,
        })
        .onConflictDoUpdate({
            target: schema.neonBucks.userId,
            set: {
                amount: sql`${schema.neonBucks.amount} + 1`,
            },
        });
}

export default async function checkoutSessionCompleted(session: Stripe.Checkout.Session) {
    // Get the customer.
    const customer = session.customer;
    if (customer === null || typeof customer === 'string' || customer.deleted) {
        throw new Error('Invalid customer');
    }

    // Get the user ID from the customer metadata.
    const uid = customer.metadata.userId as string | undefined;
    if (!uid) {
        throw new Error('User ID not found');
    }

    // Start a database transaction. We do not want to commit that is done if it fails. Let
    // the webhook re-attempt.
    await db.transaction(async (tx) => {
        // Check if we raced with the checkout link.
        const selectionCheck = await tx.query.stripeCompletedCheckoutSessions.findFirst({
            where: eq(schema.stripeCompletedCheckoutSessions.id, session.id),
        });
        if (selectionCheck) {
            // We were raced! This is okay, they handled it and blocked here.
            return;
        }

        // Here is where you actually process the checkout session.
        await processSuccessfulCheckoutSession(session, uid, tx);

        // Now we are okay, write so in the database.
        await tx.insert(schema.stripeCompletedCheckoutSessions).values({
            id: session.id,
            userId: uid,
        });
    });
}
