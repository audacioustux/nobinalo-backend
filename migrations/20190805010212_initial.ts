import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
    await knex.schema.raw('create extension if not exists "uuid-ossp"')
        .createTable('user', (table): void => {
            table.uuid('uuid').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
            table.string('handle', 48).notNullable();
            table.string('password_hash', 128).notNullable();

            table.text('bio');
            table.string('full_name', 128);
            table.string('nick_name', 48);
            table.jsonb('avatar');
            table.string('gender', 1);

            table.timestamps(false, true);
            table.time('last_logged_at');
        });

    await knex.schema.createTable('email', (table): void => {
        table.string('email', 255).primary();
        table.uuid('user_uuid').notNullable().references('uuid').inTable('user')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .index();

        table.boolean('for_digest');
        table.boolean('is_public');
        table.boolean('for_backup');
        table.boolean('is_primary');

        table.timestamps(false, true);

        table.unique(['user_uuid', 'is_primary']);
        table.unique(['user_uuid', 'for_backup']);
    });

    await knex.schema.createTable('uEmail', (table): void => {
        table.timestamps(false, true);
        table.string('email', 255).primary();
        table.string('key').notNullable();
        table.jsonb('attempts');
    });
}

export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('email');
    await knex.schema.dropTable('uEmail');
    await knex.schema.dropTable('user');
    await knex.raw('drop extension if exists "uuid-ossp"');
}
