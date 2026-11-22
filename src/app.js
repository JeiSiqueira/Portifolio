// Cria e configura o Express (sem chamar listen).
// Separar app e server permite que os testes importem o app sem abrir uma porta.
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { isProd, isTest } = require('./config');
const locals = require('./middlewares/locals');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
if (isProd) app.set('view cache', true);

// Cabeçalhos de segurança; a CSP libera só as origens que o site usa (Google Fonts).
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:'],
        'form-action': ["'none'"],
        'upgrade-insecure-requests': isProd ? [] : null,
      },
    },
  }),
);
app.use(compression());
if (!isTest) {
  // Não registra o /health (o healthcheck do Docker chama a cada 30s)
  app.use(morgan(isProd ? 'combined' : 'dev', { skip: (req) => req.path === '/health' }));
}
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: isProd ? '7d' : 0 }));
app.use(locals);

app.use(routes);

app.use(notFound); // sempre depois das rotas
app.use(errorHandler); // sempre o último

module.exports = app;
