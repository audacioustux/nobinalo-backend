import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
    return knex.schema
        .createTable('user', (table): void => {
            table.increments('id').primary();
            table.string('first_name', 255).notNullable();
            table.string('last_name', 255).notNullable();
        });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema
        .dropTable('user');
}
