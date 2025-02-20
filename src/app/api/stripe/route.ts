import type Stripe from 'stripe';
import { stripe } from '@/singletons/stripe';
import stripeSchema from '@/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
        return new Response('No signature', { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret!);
    } catch (err) {
        return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
    }

    try {
        await stripeSchema(event);
    } catch (err) {
        return new Response(`Error: ${(err as Error).message}`, { status: 400 });
    }

    return new Response(null, { status: 204 });
}
