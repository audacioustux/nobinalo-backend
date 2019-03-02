import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';
import chalk from 'chalk';
import apolloServer from './apollo';
import sequelize from './db';

require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

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

// router.get('/:name/:pass', async (ctx) => {
//   models.User.findOne({ where: { handle: ctx.params.name } }).then(async (user) => {
//     console.log(await user.isValidPass(ctx.params.pass));
//   });
// });

router.get('/:name', async () => {
  models.User.create({
    // handle: ctx.params.name,
    fullName: 'tanjim hossain',
    password: 'sfdfkkll3e3',
  });
});

router.get('/u', async () => {
  models.User.update({
    password: 'auডdac',
  }, {
    where: {
      handle: 'auda',
    },
    individualHooks: true,
  });
});

app.use(router.routes());

app.listen(
  { port },
  () => {
    process.stdout.write(
      `${chalk.red('Mode: ') + env}\n${chalk.green('GraphQL at: ')}http://localhost:${port}${apolloServer.graphqlPath} 🚀\n`,
    );
  },
);
