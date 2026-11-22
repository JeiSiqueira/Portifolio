// Dados globais disponíveis em todas as views, sem precisar passar em cada render.
const profile = require('../data/profile.json');
const { siteUrl } = require('../config');

module.exports = (req, res, next) => {
  res.locals.profile = profile;
  res.locals.year = new Date().getFullYear();
  res.locals.currentPath = req.path;
  res.locals.siteUrl = siteUrl;
  res.locals.canonical = siteUrl + req.path;
  res.locals.description = profile.headline;
  next();
};
