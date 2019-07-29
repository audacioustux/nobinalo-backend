import fs from 'fs';
import path from 'path';
import appRoot from '../../appRoot';


function getEnv(env: string): string {
    const value = process.env[env];
    if (value !== undefined) return value;
    throw Error(`env variable ${env} not set`);
}

function getSecretJSON(name: string): JSON {
    try {
        return JSON.parse(
            fs.readFileSync(
                path.join(appRoot, `../secrets/${name}.json`),
                'utf8',
            ),
        );
    } catch (err) {
        throw err.code === 'ENOENT'
            ? Error(
                `${err.message
                } : secret '${name}.json' must be mounted in: ${
                    path.join(appRoot, '../secrets/')
                }`,
            )
            : err;
    }
}

export { getEnv, getSecretJSON };
