import { Client } from 'es7';
import config from '../config';

const {
    elasticsearch: { node: ES_NODE },
} = config;
const client = new Client({ node: ES_NODE, maxRetries: 999 });

const index = 'library';
const type = 'book';

/** Check the ES connection status */
async function checkConnection() {
    let isConnected = false;
    let retry = 3;
    while (!isConnected && retry) {
        console.log('Connecting to ES');
        try {
            const health = await client.cluster.health({});
            console.log(health);
            isConnected = true;
        } catch (err) {
            console.log('Connection Failed, Retrying...', err);
        }
        retry--;
    }
}

/** Add book section schema mapping to ES */
async function putBookMapping() {
    const schema = {
        title: { type: 'keyword' },
        author: { type: 'keyword' },
        location: { type: 'integer' },
        filePath: { type: 'text' },
        lastModified: { type: 'date' },
        text: { type: 'text' },
    };

    return client.indices.putMapping({
        index,
        type,
        body: { properties: schema },
        include_type_name: true,
    });
}

async function resetIndex() {
    if (await client.indices.exists({ index })) {
        await client.indices.delete({ index });
    }

    await client.indices.create({ index });
    await putBookMapping();
}

// resetIndex();

export { client, index, type, checkConnection, resetIndex };
