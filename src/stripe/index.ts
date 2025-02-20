import type Stripe from 'stripe';
import checkoutSessionCompleted from './checkoutSessionCompleted';

export default async function stripeEvent(event: Stripe.Event) {
    switch (event.type) {
        case 'checkout.session.completed':
            return checkoutSessionCompleted(event.data.object);
    }
}
