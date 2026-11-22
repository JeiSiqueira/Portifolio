// Lê as variáveis de ambiente (arquivo .env) e define valores padrão.
// Assim nenhuma configuração fica "chumbada" no código.
require('dotenv').config({ quiet: true });

const env = process.env.NODE_ENV || 'development';

module.exports = {
  port: Number(process.env.PORT) || 3000,
  env,
  isProd: env === 'production',
  isTest: env === 'test',
  siteUrl: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
};
