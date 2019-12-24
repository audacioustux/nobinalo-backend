import { client, index } from './connection';

export default {
    /** Query ES index for the provided term */
    queryTerm(term: string, offset = 0) {
        const body = {
            from: offset,
            query: {
                match: {
                    text: {
                        query: term,
                        operator: 'and',
                        fuzziness: 'auto',
                    },
                },
            },
            highlight: { fields: { text: {} } },
        };

        return client.search({ index, body });
    },
};
