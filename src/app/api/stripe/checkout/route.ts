import { stripe } from '@/singletons/stripe';
import checkoutSessionCompleted from '@/stripe/checkoutSessionCompleted';

export async function GET(req: Request) {
    const urlParam = new URL(req.url).searchParams.get('session_id');
    if (!urlParam) {
        return Response.redirect(new URL('/', req.url));
    }

    const session = await stripe.checkout.sessions.retrieve(urlParam, {
        expand: ['customer'],
    });
    if (session.status !== 'complete') {
        return Response.redirect(new URL('/', req.url));
    }

    // This is a special case where we should call the webhook handler. This is
    // because we want the user to get the result immediately, not async.
    await checkoutSessionCompleted(session);

    // TODO: You might want to redirect to a success page here.
    return Response.redirect(new URL('/', req.url));
}
