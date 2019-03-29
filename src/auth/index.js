import db from '../db';
import { register } from './local';

const express = require('express');

const router = express.Router();
// const { models } = db;
router.route('/login')
  .get(async (req, res) => {
    await register('tux', 'sdsfsfdsds', 'tangimhossain1@gmail.com');
    res.end();
  })
  .post(async (req, res) => {
    res.json([23239000000000000]);
  });


router.route('/register')
  .post(async (req, res) => {
    res.json([23239000000000000]);
  });

export {
  router,
};
// import { register } from './local';

// const express = require('express');

// const router = express.Router();

// router.route('/login')
//   .get(async (req, res) => {
//     register({ handle: 'tux', email: 'tangimhossain1@gmail.com', password: 'passwod' });
//     res.end();
//   })
//   .post(async (req, res) => {
//     res.json([23239000000000000]);
//   });


// router.route('/register')
//   .post(async (req, res) => {
//     res.json([23239000000000000]);
//   });

// export {
//   router,
// };
