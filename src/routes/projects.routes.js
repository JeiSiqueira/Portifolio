const { Router } = require('express');
const projects = require('../controllers/projects.controller');

const router = Router();

router.get('/', projects.list);
router.get('/:slug', projects.detail);

module.exports = router;
