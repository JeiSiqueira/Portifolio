const projectsService = require('../services/projects.service');

exports.home = (req, res) => {
  res.render('pages/home', {
    title: 'Início',
    featured: projectsService.getFeatured(3),
  });
};

exports.about = (req, res) => {
  res.render('pages/about', {
    title: 'Sobre mim',
    description: 'Conheça a trajetória de Jeimili Mendes: da área financeira ao desenvolvimento Full Stack.',
  });
};

exports.contact = (req, res) => {
  res.render('pages/contact', {
    title: 'Contato',
    description: 'Fale com Jeimili Mendes por e-mail, LinkedIn ou GitHub.',
  });
};

const escapeXml = (s) =>
  String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

exports.sitemap = (req, res) => {
  const base = res.locals.siteUrl;
  const paths = ['/', '/sobre', '/projetos', '/contato', ...projectsService.getAll().map((p) => `/projetos/${p.slug}`)];
  const urls = paths.map((p) => `  <url><loc>${escapeXml(base + p)}</loc></url>`).join('\n');
  res
    .type('application/xml')
    .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
};

exports.robots = (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\n\nSitemap: ${res.locals.siteUrl}/sitemap.xml\n`);
};
