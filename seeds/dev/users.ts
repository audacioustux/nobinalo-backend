import * as Knex from 'knex';
import * as faker from 'faker';


export default async function seed(knex: Knex): Promise<any> {
    return knex('table_name').del()
        .then(() => knex('user').insert([
            { name: 'rowValue1' },
            { name: 'rowValue2' },
            { name: 'rowValue3' },
        ]));
}
