const { Router } = require('express');
const projects = require('../controllers/projects.controller');

const router = Router();

router.get('/projetos', projects.api);

module.exports = router;
