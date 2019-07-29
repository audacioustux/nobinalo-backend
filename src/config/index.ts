import mailer from './mailer';
import db from './db';
import base from './base';


export default Object.assign({}, base, { mailer, db });
