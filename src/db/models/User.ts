import { Model, RelationMappings } from 'objection';

export interface Address {
    street: string;
    city: string;
    zipCode: string;
}

export default class Person extends Model {
    readonly id!: number;

    parentId?: number;

    firstName?: string;

    lastName?: string;

    age?: number;

    address?: Address;

    parent?: Person;

    children?: Person[];

    static tableName = 'persons';

    static jsonSchema = {
        type: 'object',
        required: ['firstName', 'lastName'],

        properties: {
            id: { type: 'integer' },
            parentId: { type: ['integer', 'null'] },
            firstName: { type: 'string', minLength: 1, maxLength: 255 },
            lastName: { type: 'string', minLength: 1, maxLength: 255 },
            age: { type: 'number' },

            address: {
                type: 'object',
                properties: {
                    street: { type: 'string' },
                    city: { type: 'string' },
                    zipCode: { type: 'string' }
                }
            }
        }
    };

    static relationMappings: RelationMappings = {};
}
