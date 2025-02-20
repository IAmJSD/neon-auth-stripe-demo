'use server';

import { neonPool, db } from '@/singletons/database';
import * as schema from '@/schema';
import { stripe } from '@/singletons/stripe';
import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';

export async function getUserDetails(userId: string | undefined) {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
    }

    if (!userId) {
        return null;
    }

    const [user] = (await neonPool.query('SELECT * FROM neon_auth.users_sync WHERE id = $1', [userId])).rows;
    return user as {
        id: string;
        name: string | null;
        email: string | null;
        created_at: string | null;
        updated_at: string | null;
        deleted_at: string | null;
        raw_json: {
            profile_image_url: string | null;
        };
    } | null;
}

export async function getStripeCustomer(userId: string | undefined) {
    if (!userId) {
        return null;
    }

    // Return either a stripe customer or a string with the stripe customer ID.
    const txRes = await db.transaction(async (tx) => {
        const customer = await tx.query.stripeCustomers.findFirst({
            where: eq(schema.stripeCustomers.userId, userId),
        });

        if (!customer) {
            const stripeCustomer = await stripe.customers.create({
                metadata: {
                    userId,
                },
            });

            await tx.insert(schema.stripeCustomers).values({
                userId,
                stripeCustomerId: stripeCustomer.id,
            });

            return stripeCustomer;
        }

        return customer.stripeCustomerId;
    });

    const customer = typeof txRes === 'string' ? await stripe.customers.retrieve(txRes) : txRes;
    if (customer.deleted) {
        throw new Error('Stripe customer deleted');
    }

    return customer;
}

export async function getNeonBucks(userId: string | undefined) {
    if (!userId) {
        return 0;
    }

    const bucks = await db.query.neonBucks.findFirst({
        where: eq(schema.neonBucks.userId, userId),
    });

    return bucks?.amount ?? 0;
}

async function createCheckoutSessionUrl(
    userId: string,
    opts: Omit<Stripe.Checkout.SessionCreateParams, 'customer' | 'success_url'>,
) {
    const customer = await getStripeCustomer(userId);
    if (!customer) {
        throw new Error('Stripe customer not found');
    }

    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
        ...opts,
    });

    return session.url;
}

// TODO: Remove this in production.
export async function createNeonBucksCheckoutSessionUrl(userId: string) {
    if (!process.env.STRIPE_NEON_BUCKS_PRICE_ID) {
        throw new Error('STRIPE_NEON_BUCKS_PRICE_ID is not set');
    }

    return createCheckoutSessionUrl(userId, {
        line_items: [
            {
                price: process.env.STRIPE_NEON_BUCKS_PRICE_ID,
                quantity: 1,
            },
        ],
        mode: 'payment',
    });
}
