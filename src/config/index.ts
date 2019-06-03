import { Config } from './type';
if (process.env.NODE_ENV !== 'production') {
  const [a]: [Config] = [require('./dev').default];
  console.log(a);
}

export default { PORT: 4000 };
