// Junta todas as rotas do site.
const { Router } = require('express');

const router = Router();

// Usado pelo healthcheck do Docker e por balanceadores: responde rápido, sem renderizar view.
router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
});

router.use(require('./pages.routes'));
router.use('/projetos', require('./projects.routes'));
router.use('/api', require('./api.routes'));

module.exports = router;
