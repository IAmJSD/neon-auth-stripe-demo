import { text, pgSchema, pgTable, timestamp, foreignKey } from 'drizzle-orm/pg-core';

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
