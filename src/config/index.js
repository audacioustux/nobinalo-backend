// @flow
const { NODE_ENV = 'development', USER } = process.env;

async function getEnv() {
  if (NODE_ENV === 'development') {
    if (!USER) throw new Error("env variable 'USER' missing");

    const [devBase, devUser] = await Promise.all([
      import('./dev.json'),
      import(`./dev@${USER}.json`),
    ]);

    const env = Object.assign({}, devBase, devUser);

    return env;
  }

  return import('./prod.json').then(env => env);
}

export default async () => {
  const config = Object.assign({}, await getEnv(), process.env);
};
