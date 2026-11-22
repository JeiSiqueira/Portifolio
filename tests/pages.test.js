process.env.NODE_ENV = 'test';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

for (const path of ['/', '/sobre', '/projetos', '/contato', '/projetos/controle-financeiro']) {
  test(`GET ${path} responde 200 com HTML`, async () => {
    const res = await request(app).get(path);
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /html/);
    assert.match(res.text, /<html lang="pt-BR">/);
  });
}

test('rota inexistente responde 404 com página própria', async () => {
  const res = await request(app).get('/nao-existe');
  assert.equal(res.status, 404);
  assert.match(res.text, /Página não encontrada/);
});

test('/projetos/slug-invalido responde 404', async () => {
  const res = await request(app).get('/projetos/slug-invalido');
  assert.equal(res.status, 404);
});

test('filtro por tag mostra só os projetos com a tecnologia', async () => {
  const res = await request(app).get('/projetos?tag=mysql');
  assert.equal(res.status, 200);
  assert.match(res.text, /Agendamento de Salão de Beleza/);
  assert.doesNotMatch(res.text, /href="\/projetos\/voz-e-protecao"/);
});

test('filtro com tag inexistente mostra o estado vazio', async () => {
  const res = await request(app).get('/projetos?tag=cobol');
  assert.match(res.text, /Nenhum projeto com essa tecnologia/);
});

test('GET /contato mostra e-mail, LinkedIn e GitHub, sem formulário', async () => {
  const res = await request(app).get('/contato');
  assert.match(res.text, /mailto:jeisiqueira7@gmail.com/);
  assert.match(res.text, /linkedin\.com\/in\/jeimili-siqueira/);
  assert.match(res.text, /href="https:\/\/github\.com\/JeiSiqueira"/);
  assert.doesNotMatch(res.text, /<form/);
});

test('POST /contato não existe mais (404)', async () => {
  const res = await request(app).post('/contato');
  assert.equal(res.status, 404);
});

test('GET /api/projetos devolve JSON', async () => {
  const res = await request(app).get('/api/projetos');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length >= 3);
});

test('sitemap.xml e robots.txt', async () => {
  const sitemap = await request(app).get('/sitemap.xml');
  assert.match(sitemap.headers['content-type'], /xml/);
  assert.match(sitemap.text, /\/projetos\/controle-financeiro/);

  const robots = await request(app).get('/robots.txt');
  assert.match(robots.text, /Sitemap:/);
});

test('cabeçalhos de segurança presentes e x-powered-by removido', async () => {
  const res = await request(app).get('/');
  assert.ok(res.headers['content-security-policy']);
  assert.equal(res.headers['x-powered-by'], undefined);
});

test('GET /health responde 200 com status ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});
