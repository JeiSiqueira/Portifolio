const { Router } = require('express');
const pages = require('../controllers/pages.controller');

const router = Router();

router.get('/', pages.home);
router.get('/sobre', pages.about);
router.get('/contato', pages.contact);
router.get('/sitemap.xml', pages.sitemap);
router.get('/robots.txt', pages.robots);

module.exports = router;
