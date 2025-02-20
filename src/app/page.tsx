import { Header } from '@/app/header';
import { stackServerApp } from '@/stack';
import Image from 'next/image';
import React from 'react';
import { createNeonBucksCheckoutSessionUrl, getNeonBucks } from './actions';
import RedirectButton from '@/components/RedirectButton';

async function NeonBucks() {
    const user = await stackServerApp.getUser();
    if (!user) {
        return <p className="mb-4 italic">You must be logged in to see your Neon Bucks.</p>;
    }

    const bucks = await getNeonBucks(user.id);
    return (
        <p className="mb-4">
            You have {bucks} Neon Bucks.
            <RedirectButton
                href={async () => {
                    'use server';

                    return createNeonBucksCheckoutSessionUrl(user.id);
                }}
                className="ml-2 underline hover:no-underline"
            >
                Buy more →
            </RedirectButton>
        </p>
    );
}

export default function Home() {
    return (
        <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative mx-auto lg:max-w-none">
            <Header />

            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10">
                <header className="flex flex-col gap-2 items-start max-w-xl">
                    <h1 className="font-title text-[48px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[48px] lg:text-[32px] sm:text-[32px]">
                        Neon Auth + Stripe{' '}
                    </h1>
                    <p className="text-medium mt-0">Effortless Authentication for Modern Apps!</p>
                </header>

                <section className="flex flex-col gap-4 mx-auto max-w-xl">
                    <p className="text-sm text-gray-300 mb-4">
                        This example app allows users to create a user account and pay for "Neon Bucks" using Stripe. In
                        reality, you will want to make your own items (see all the TODO's in this application), but this
                        demos Stripe webhooks, checkout, and Drizzle with Neon Auth.
                    </p>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <NeonBucks />
                    </React.Suspense>
                </section>

                <ol className="list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                    <li className="mb-2">
                        <a
                            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-primary-1 hover-text-[#00e5bf]"
                            href="https://neon.tech/docs/guides/neon-auth?utm_source=neon-auth-nextjs-template&utm_campaign=neon-auth"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Neon Auth documentation →
                        </a>
                    </li>
                    <li className="mb-2">
                        <a
                            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-primary-1 hover-text-[#00e5bf]"
                            href="https://docs.stack-auth.com/overview"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Stack Auth documentation →
                        </a>
                    </li>
                    <li className="mb-2">
                        <a
                            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-primary-1 hover-text-[#00e5bf]"
                            href="https://docs.stripe.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Stripe documentation →
                        </a>
                    </li>
                </ol>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://neon.tech?utm_source=neon-auth-nextjs-template&utm_campaign=neon-auth"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
                    Go to neon.tech →
                </a>
            </footer>
        </div>
    );
}
