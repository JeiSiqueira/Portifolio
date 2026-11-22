// Regras de acesso aos projetos: buscar, ordenar e filtrar.
// Os controllers só pedem os dados; quem decide "como" é este service.
const projects = require('../data/projects.json');

const getAll = () => [...projects].sort((a, b) => b.year - a.year);

const getFeatured = (n = 3) => getAll().filter((p) => p.featured).slice(0, n);

const getBySlug = (slug) => projects.find((p) => p.slug === slug);

const getTags = () => [...new Set(projects.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

const getByTag = (tag) => {
  if (!tag) return getAll();
  const wanted = tag.toLowerCase();
  return getAll().filter((p) => p.tags.some((t) => t.toLowerCase() === wanted));
};

// Projeto anterior e próximo (na ordem da listagem), para a navegação do estudo de caso.
const getNeighbors = (slug) => {
  const list = getAll();
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: list[i - 1] || null, next: list[i + 1] || null };
};

module.exports = { getAll, getFeatured, getBySlug, getTags, getByTag, getNeighbors };
