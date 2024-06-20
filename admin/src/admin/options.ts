import { AdminJSOptions } from 'adminjs';

import { db } from '../db/index.js';

import componentLoader from './component-loader.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/a',
  resources: [
    // {
    //   resource: db.table('users'),
    //   options: {},
    // },
    // {
    //   resource: db.table('customers'),
    //   options: {},
    // },
    // {
    //   resource: db.table('products'),
    //   options: {},
    // },
    // {
    //   resource: db.table('shops'),
    //   options: {},
    // },
    // {
    //   resource: db.table('sections'),
    //   options: {},
    // },
    // {
    //   resource: db.table('slots'),
    //   options: {},
    // },
    // {
    //   resource: db.table('categories'),
    //   options: {},
    // },
  ],
  databases: [db],
};

export default options;
