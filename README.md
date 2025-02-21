# Neon Auth - Next.js Template App

This is a [Next.js](https://nextjs.org) project using the App Router that servers as template for the [Neon Auth](https://neon.tech/docs/guides/neon-identity) integration with [Stack Auth](https://docs.stack-auth.com/overview) and [Stripe](https://stripe.com).

## Features

- Next.js with the App Router, TypeScript and Tailwind CSS
- User authentication powered by Stack Auth
- Integration with Neon Auth
- Integration with Stripe (including webhooks and checkout sessions)
- Ready-to-deploy configuration for Vercel, Netlify, and Render

## Prerequisites

- [Neon](https://neon.tech) account
- [Stripe](https://stripe.com) account
- Node.js 18+ installed locally

## Local Development Setup

### 1. Set up Neon Auth

1. Create a new Neon project or use an existing one
2. Navigate into Neon Auth
3. Click "Connect" and go through the OAuth flow until your Neon Auth integration is set

### 2. Set up Stripe

1. Navigate into Stripe
2. Create a new webhook (not needed for demo, but needed in production)
3. Copy the webhook secret
4. Create a new product and price in Stripe
5. Add the price ID to the `.env.local` file

You will want to edit everywhere marked with `TODO` to match your own project.

### 3. Run the development server

1. Install dependencies:

    ```bash
    npm install
    ```

2. Create `.env.local` file and copy the variables from the Neon Auth dashboard:

    ```
    # Stack Auth keys
    NEXT_PUBLIC_STACK_PROJECT_ID=
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
    STACK_SECRET_SERVER_KEY=
    
    # For the `neondb_owner` role.
    DATABASE_URL=
    
    # Stripe keys
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
    
    # App URL
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    
    # Example Stripe price ID
    STRIPE_NEON_BUCKS_PRICE_ID=
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

- [Neon Auth Documentation](https://neon.tech/docs/guides/neon-identity)
- [Stack Auth Documentation](https://docs.stack-auth.com/)

## Authors

- [Pedro Figueiredo](https://github.com/pffigueiredo)
- [Astrid Gealer](https://github.com/iamjsd)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
