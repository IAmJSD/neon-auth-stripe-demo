'use client';

import React from 'react';

type Props = {
    href: () => Promise<string | null>;
} & React.ComponentPropsWithoutRef<'button'>;

export default function RedirectButton({ href, ...props }: Props) {
    return (
        <button
            {...props}
            onClick={async () => {
                await href().then((url) => {
                    if (url) {
                        window.location.href = url;
                    }
                });
            }}
        />
    );
}
