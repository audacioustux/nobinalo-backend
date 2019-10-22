const env = new Proxy(process.env, {
    get: (env, key: string) => {
        const value = env[key];
        if (!value)
            throw new Error(`Environment Variable '${key}' is missing!`);
        return value;
    }
}) as Record<string, string>;

function getOr<D extends Record<string, string>>(keys: D) {
    return Object.assign(
        {},
        ...Object.keys(keys).map(key => {
            const value = process.env[key];
            if (value) return { [key]: value };
            return { [key]: keys[key] };
        })
    ) as D;
}

function get<K extends string>(...keys: Array<K>) {
    return keys.reduce(
        (acc, curr) => ((acc[curr] = env[curr]), acc),
        {} as Record<K, string>
    );
}

export default { env, getOr, get };
