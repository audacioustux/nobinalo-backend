import * as Knex from 'knex';

export async function up(knex: Knex) {
    await knex.schema
        .raw('create extension if not exists "uuid-ossp"')
        .createTable('user', table => {
            table.uuid('uuid').primary();
            table
                .string('handle', 48)
                .notNullable()
                .index();
            table.string('password_hash', 128).notNullable();

            table.text('bio');
            table.string('name', 160);
            table.string('gender', 1);

            table.timestamps(false, true);
            table.timestamp('last_logged_at', { useTz: true });
        });

    await knex.schema.createTable('email', table => {
        table.string('email', 255).primary();
        table
            .uuid('user_uuid')
            .notNullable()
            .references('uuid')
            .inTable('user')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .index();

        table.boolean('for_digest');
        table.boolean('is_public');
        table.boolean('for_backup');
        table.boolean('is_primary');

        table.timestamps(false, true);

        table.unique(['user_uuid', 'is_primary']);
    });

    await knex.schema.createTable('uEmail', table => {
        table.timestamps(false, true);
        table.string('email', 255).primary();
        table.string('key').notNullable();
        table.jsonb('attempts');
    });
}

export async function down(knex: Knex) {
    await knex.schema.dropTable('email');
    await knex.schema.dropTable('uEmail');
    await knex.schema.dropTable('user');
    await knex.raw('drop extension if exists "uuid-ossp"');
}
