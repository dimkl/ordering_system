const { readFileSync } = require('fs');
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || readFileSync(__dirname + '/../../config/public.pem');

module.exports = () => JWT_PUBLIC_KEY;