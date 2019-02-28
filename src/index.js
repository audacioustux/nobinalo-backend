import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';
import apolloServer from './apollo';
import sequelize from './db';

const { models } = sequelize;
const app = new Koa();
const router = new Router();

app.use(logger());

apolloServer.applyMiddleware({ app });

router.get('/', async (ctx) => {
  await models.User.findAll().then((users) => {
    ctx.body = JSON.stringify(users);
  });
});

router.get('/:name', async (ctx) => {
  models.User.create({
    handle: ctx.params.name,
    fullName: 'tanjim hossain',
    password: 'sfdf3e3',
  });
});

app.use(router.routes());

app.listen(
  { port: 3000 },
  () => process.stdout.write(
    `GraphQL at: http://localhost:3000${apolloServer.graphqlPath} 🚀\n`,
  ),
);
