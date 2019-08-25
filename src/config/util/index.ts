function env(key: string): string {
    const value = process.env[key];
    if (value !== undefined) return value;
    throw Error(`env variable ${env} not set`);
}


export { env };
