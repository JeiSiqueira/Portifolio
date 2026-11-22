const { test } = require('node:test');
const assert = require('node:assert/strict');
const service = require('../src/services/projects.service');

test('getAll ordena do mais recente para o mais antigo', () => {
  const years = service.getAll().map((p) => p.year);
  assert.deepEqual(years, [...years].sort((a, b) => b - a));
});

test('getFeatured respeita o limite e só traz destaques', () => {
  const featured = service.getFeatured(2);
  assert.ok(featured.length <= 2);
  assert.ok(featured.every((p) => p.featured));
});

test('getBySlug encontra o projeto ou devolve undefined', () => {
  assert.equal(service.getBySlug('controle-financeiro').title, 'Controle Financeiro');
  assert.equal(service.getBySlug('nao-existe'), undefined);
});

test('getByTag filtra sem diferenciar maiúsculas', () => {
  const list = service.getByTag('mysql');
  assert.ok(list.length > 0);
  assert.ok(list.every((p) => p.tags.includes('MySQL')));
});

test('getByTag sem tag devolve todos', () => {
  assert.equal(service.getByTag('').length, service.getAll().length);
});

test('getTags não repete tecnologias', () => {
  const tags = service.getTags();
  assert.equal(tags.length, new Set(tags).size);
});

test('getNeighbors devolve anterior e próximo', () => {
  const [first, second] = service.getAll();
  const { prev, next } = service.getNeighbors(first.slug);
  assert.equal(prev, null);
  assert.equal(next.slug, second.slug);
});
