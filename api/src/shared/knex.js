const Knex = require('knex');

const NODE_ENV = process.env.NODE_ENV || 'development';
const knexConfig = require('../../config/knexfile')[NODE_ENV];

module.exports = Knex(knexConfig);