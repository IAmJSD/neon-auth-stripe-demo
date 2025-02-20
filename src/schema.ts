import { text, pgSchema, pgTable, timestamp, foreignKey, index, integer } from 'drizzle-orm/pg-core';

const usersSync = pgSchema('neon_auth').table('users_sync', {
    id: text('id').primaryKey(),
});

export const stripeCustomers = pgTable(
    'stripe_customers',
    {
        userId: text('user_id').primaryKey(),
        stripeCustomerId: text('stripe_customer_id').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (t) => [
        foreignKey({
            columns: [t.userId],
            foreignColumns: [usersSync.id],
            name: 'stripe_user_id_fk',
        }).onDelete('cascade'),
    ],
);

export const stripeCompletedCheckoutSessions = pgTable(
    'stripe_completed_checkout_sessions',
    {
        id: text('id').primaryKey(),
        userId: text('user_id').notNull(),
    },
    (t) => [
        foreignKey({
            columns: [t.userId],
            foreignColumns: [usersSync.id],
            name: 'stripe_user_id_fk',
        }).onDelete('cascade'),
        index('stripe_completed_checkout_sessions_user_id_idx').on(t.userId),
    ],
);

export const neonBucks = pgTable('neon_bucks', {
    userId: text('user_id').primaryKey(),
    amount: integer('amount').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
