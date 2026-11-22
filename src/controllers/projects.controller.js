const service = require('../services/projects.service');

exports.list = (req, res) => {
  const tag = typeof req.query.tag === 'string' ? req.query.tag.trim() : '';
  // Usa o nome da tag como está nos dados (ex.: "node.js" → "Node.js").
  const activeTag = service.getTags().find((t) => t.toLowerCase() === tag.toLowerCase()) || tag;

  res.render('pages/projects', {
    title: 'Projetos',
    description: 'Projetos desenvolvidos por Jeimili Mendes, com o problema, a solução e as tecnologias de cada um.',
    projects: service.getByTag(activeTag),
    tags: service.getTags(),
    activeTag,
  });
};

exports.detail = (req, res, next) => {
  const project = service.getBySlug(req.params.slug);
  if (!project) return next(); // cai no 404

  res.render('pages/project-detail', {
    title: project.title,
    description: project.summary,
    project,
    ...service.getNeighbors(project.slug),
  });
};

exports.api = (req, res) => {
  res.json(service.getAll());
};
