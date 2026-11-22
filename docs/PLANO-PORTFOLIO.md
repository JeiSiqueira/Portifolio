# Portfólio Jeimili Mendes: histórico e plano de evolução

> Documento de referência do projeto: o que já foi construído, o estado atual do código, a arquitetura-alvo (back-end e front-end), as boas práticas adotadas e o roteiro de evolução em fases.
>
> **Abordagem:** o projeto está sendo construído passo a passo, como aprendizado. Cada fase abaixo deve ser implementada entendendo o "porquê" de cada decisão, não apenas copiando código.

---

## Sumário

1. [Contexto do projeto](#1-contexto-do-projeto)
2. [O que já foi feito](#2-o-que-já-foi-feito)
3. [Estado atual do código](#3-estado-atual-do-código)
4. [Problemas e limitações atuais](#4-problemas-e-limitações-atuais)
5. [Arquitetura-alvo](#5-arquitetura-alvo)
6. [Back-end: especificação e boas práticas](#6-back-end-especificação-e-boas-práticas)
7. [Front-end: especificação e boas práticas](#7-front-end-especificação-e-boas-práticas)
8. [Funcionalidades a desenvolver](#8-funcionalidades-a-desenvolver)
9. [Responsividade](#9-responsividade)
10. [UI/UX](#10-uiux)
11. [Acessibilidade](#11-acessibilidade)
12. [Desempenho e SEO](#12-desempenho-e-seo)
13. [Qualidade de código, testes e versionamento](#13-qualidade-de-código-testes-e-versionamento)
14. [Publicação (deploy)](#14-publicação-deploy)
15. [Roteiro por fases (checklist)](#15-roteiro-por-fases-checklist)
16. [Conteúdo pronto](#16-conteúdo-pronto)

---

## 1. Contexto do projeto

| Item | Descrição |
|---|---|
| **Pessoa** | Jeimili Mendes |
| **Objetivo profissional** | Desenvolvedora Full Stack, em transição de carreira (7 anos na área financeira) |
| **Formação** | Graduação em Administração, pós em Gestão Financeira, concluindo Análise e Desenvolvimento de Sistemas |
| **Projetos** | Controle Financeiro (pessoal), Agendamento de Salão de Beleza (pessoal), Voz e Proteção (acadêmico, direitos humanos) |
| **Objetivo do site** | Chamar a atenção de recrutadores e mostrar comprometimento, capacidade de resolver problemas e competência técnica |
| **Stack escolhida** | Node.js + Express (servidor), EJS (templates renderizados no servidor), HTML, CSS e JavaScript puro no navegador |

**Por que essa stack:** renderizar o HTML no servidor (SSR) entrega páginas prontas ao navegador. O site carrega rápido, é bem indexado pelo Google e não exige um framework de front-end pesado. Além disso, o próprio portfólio demonstra conhecimento de back-end.

---

## 2. O que já foi feito

| Passo | Tema | O que foi aprendido |
|---|---|---|
| 1 | Ambiente | Node.js e VS Code já instalados; `node -v` e `npm -v` |
| 2 | Primeiro servidor | Módulo nativo `http`, `createServer`, requisição (`req`) e resposta (`res`), `listen` na porta 3000, `console.log` para depurar |
| 3 | Rotas manuais | Uso de `req.url` com `if / else if` para responder páginas diferentes; página "não encontrada" no `else` |
| — | Conteúdo | Texto "Sobre mim" escrito e revisado (seção 16); frase curta de apresentação definida |
| — | Revisão | Frase curta estava no `else` (página de erro) e foi movida para `/`; texto separado em parágrafos `<p>`; uso de *template strings* (crases) para HTML em várias linhas |
| 4 | npm e Express | `npm init -y`, `package.json`, `node_modules`, `package-lock.json`; rotas com `app.get()` e `res.send()`; `node --watch` para reiniciar sozinho |
| — | Rota `/contato` | Criada; ajustes: endereço em minúsculas, link `mailto:`, link do LinkedIn com `target="_blank"` |
| 5 | Templates EJS (em andamento) | `npm install ejs`, `app.set('view engine', 'ejs')`, pasta `views/`, `res.render()`, *partial* de menu com `<%- include() %>` |

**Conceitos-chave já vistos:** cliente e servidor, requisição e resposta, porta, rota, pacote npm, dependência, template, *partial*.

---

## 3. Estado atual do código

```
meu-portfolio/
├── node_modules/
├── package.json
├── package-lock.json
├── server.js
└── views/
    ├── partials/
    │   └── menu.ejs
    ├── index.ejs
    └── sobre.ejs        ← desafio em andamento
```

`server.js` (resumo):

```js
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));
app.get('/sobre', (req, res) => res.send(textoSobre));   // migrar para res.render('sobre')
app.get('/projetos', (req, res) => res.send('<h1>Projetos</h1><ul>...</ul>'));
app.get('/contato', (req, res) => res.send(`...`));

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
```

---

## 4. Problemas e limitações atuais

| # | Problema | Impacto | Solução prevista |
|---|---|---|---|
| 1 | HTML escrito dentro do `res.send()` nas rotas `/projetos` e `/contato` | Difícil de manter; menu e estilos não se repetem | Migrar todas as páginas para EJS (Fase 1) |
| 2 | Cada `.ejs` repete `<!DOCTYPE>`, `<head>` etc. | Duplicação; alterar o `<head>` exige editar todos os arquivos | *Partials* `head` e `footer` (Fase 1) |
| 3 | Conteúdo (textos, projetos) misturado com o código | Para atualizar um projeto é preciso mexer em HTML | Dados em arquivos JSON separados (Fase 2) |
| 4 | Sem CSS | Visual cru; não responsivo | Arquivos estáticos em `public/` e CSS mobile-first (Fase 3) |
| 5 | Sem página 404 própria nem tratamento de erros | Mensagem padrão "Cannot GET" | Middlewares de 404 e de erro (Fase 4) |
| 6 | Porta fixa no código | Não funciona em servidores de hospedagem | `process.env.PORT` e `.env` (Fase 4) |
| 7 | Tudo em um único `server.js` | Cresce sem organização | Separar em rotas, controladores e dados (Fase 4) |
| 8 | Sem controle de versão | Risco de perder trabalho; sem histórico | Git + GitHub (já na Fase 1) |
| 9 | Sem segurança, compressão ou cache | Site mais lento e exposto | `helmet`, `compression`, cache de estáticos (Fase 6) |

---

## 5. Arquitetura-alvo

### 5.1 Visão geral

```
Navegador ──(GET /projetos)──► Express
                                 │
                                 ├─ middlewares (segurança, compressão, estáticos, locals)
                                 ├─ router → controller
                                 │              │
                                 │              ├─ service: lê e filtra os dados (JSON)
                                 │              └─ res.render('pages/projects', dados)
                                 │
                                 └─ EJS monta o HTML (layout + partials + página)
                                 ◄── HTML pronto + CSS/JS/imagens de /public
```

O padrão é um **MVC simplificado**:
- **Model / dados:** arquivos JSON e funções de acesso (`services`).
- **View:** templates EJS.
- **Controller:** funções que recebem a requisição, pedem os dados e escolhem a view.

### 5.2 Estrutura de pastas final

```
meu-portfolio/
├── src/
│   ├── app.js                  # cria e configura o Express (sem listen)
│   ├── server.js               # importa app e chama listen (ponto de entrada)
│   ├── config/
│   │   └── index.js            # lê variáveis de ambiente com valores padrão
│   ├── routes/
│   │   ├── index.js            # junta todas as rotas
│   │   ├── pages.routes.js     # /, /sobre, /contato
│   │   ├── projects.routes.js  # /projetos, /projetos/:slug
│   │   └── api.routes.js       # /api/projetos (JSON)
│   ├── controllers/
│   │   ├── pages.controller.js
│   │   ├── projects.controller.js
│   │   └── contact.controller.js
│   ├── services/
│   │   ├── projects.service.js # buscar todos, por slug, por tag, destaques
│   │   └── mail.service.js     # envio do formulário de contato
│   ├── middlewares/
│   │   ├── locals.js           # dados globais para as views (perfil, ano, rota atual)
│   │   ├── notFound.js         # 404
│   │   ├── errorHandler.js     # 500 e erros em geral
│   │   └── validate.js         # validação de formulários
│   ├── data/
│   │   ├── profile.json        # nome, resumo, experiência, formação, redes
│   │   └── projects.json       # lista de projetos
│   └── views/
│       ├── layouts/
│       │   └── main.ejs        # estrutura HTML comum (opcional, com express-ejs-layouts)
│       ├── partials/
│       │   ├── head.ejs
│       │   ├── header.ejs      # logo + menu + botão mobile
│       │   ├── footer.ejs
│       │   ├── project-card.ejs
│       │   └── flash.ejs       # mensagens de sucesso/erro do formulário
│       └── pages/
│           ├── home.ejs
│           ├── about.ejs
│           ├── projects.ejs
│           ├── project-detail.ejs
│           ├── contact.ejs
│           ├── 404.ejs
│           └── 500.ejs
├── public/
│   ├── css/
│   │   ├── tokens.css          # variáveis: cores, fontes, espaçamentos
│   │   ├── base.css            # reset e estilos gerais
│   │   ├── layout.css          # container, grid, header, footer
│   │   ├── components.css      # botões, cards, tags, formulário
│   │   └── pages.css           # ajustes específicos por página
│   ├── js/
│   │   └── main.js             # menu mobile, animações, validação no navegador
│   ├── img/
│   │   ├── projetos/           # imagens otimizadas (.webp + fallback)
│   │   └── favicon.svg
│   ├── curriculo-jeimili-mendes.pdf
│   └── robots.txt
├── tests/
│   ├── pages.test.js
│   └── projects.service.test.js
├── .env.example                # modelo das variáveis (sem segredos)
├── .env                        # variáveis reais (NÃO vai para o Git)
├── .gitignore
├── .editorconfig
├── eslint.config.js
├── .prettierrc
├── package.json
└── README.md
```

> **Para aprender:** essa estrutura é o destino, não o ponto de partida. Ela surge aos poucos, fase a fase, conforme o `server.js` cresce e a necessidade de organizar aparece.

### 5.3 Mapa de rotas

| Método | Rota | Controller | View / Resposta |
|---|---|---|---|
| GET | `/` | `pages.home` | `pages/home` |
| GET | `/sobre` | `pages.about` | `pages/about` |
| GET | `/projetos` | `projects.list` | `pages/projects` (aceita `?tag=`) |
| GET | `/projetos/:slug` | `projects.detail` | `pages/project-detail` ou 404 |
| GET | `/contato` | `pages.contact` | `pages/contact` |
| POST | `/contato` | `contact.send` | redireciona para `/contato?enviado=1` ou re-renderiza com erros |
| GET | `/api/projetos` | `projects.api` | JSON |
| GET | `/sitemap.xml` | `pages.sitemap` | XML gerado a partir dos projetos |
| * | qualquer outra | `notFound` | `pages/404` (status 404) |

---

## 6. Back-end: especificação e boas práticas

### 6.1 Separar `app` e `server`

```js
// src/app.js
const express = require('express');
const app = express();
// ...configuração, middlewares e rotas
module.exports = app;

// src/server.js
const app = require('./app');
const { port } = require('./config');
app.listen(port, () => console.log(`Rodando em http://localhost:${port}`));
```

**Motivo:** os testes importam o `app` sem abrir uma porta.

### 6.2 Configuração por variáveis de ambiente

```js
// src/config/index.js
require('dotenv').config();
module.exports = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  mail: {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    to: process.env.CONTACT_TO,
  },
};
```

- `.env` fica no `.gitignore`; o `.env.example` documenta as chaves sem valores reais.
- Nunca deixe senhas ou chaves no código.

### 6.3 Ordem dos middlewares

```js
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());                         // cabeçalhos de segurança
app.use(compression());                    // gzip nas respostas
app.use(morgan(isProd ? 'combined' : 'dev')); // log das requisições
app.use(express.static('public', { maxAge: isProd ? '7d' : 0 }));
app.use(express.urlencoded({ extended: false, limit: '10kb' })); // ler formulários
app.use(locals);                           // perfil, ano, rota atual

app.use(routes);

app.use(notFound);                         // sempre depois das rotas
app.use(errorHandler);                     // sempre o último
```

### 6.4 Controllers enxutos, regras nos services

```js
// services/projects.service.js
const projects = require('../data/projects.json');
exports.getAll = () => [...projects].sort((a, b) => b.year - a.year);
exports.getFeatured = (n = 3) => exports.getAll().filter(p => p.featured).slice(0, n);
exports.getBySlug = (slug) => projects.find(p => p.slug === slug);
exports.getTags = () => [...new Set(projects.flatMap(p => p.tags))].sort();

// controllers/projects.controller.js
const service = require('../services/projects.service');
exports.detail = (req, res, next) => {
  const project = service.getBySlug(req.params.slug);
  if (!project) return next();             // cai no 404
  res.render('pages/project-detail', { title: project.title, project });
};
```

### 6.5 Tratamento de erros

```js
// middlewares/notFound.js
module.exports = (req, res) => res.status(404).render('pages/404', { title: 'Página não encontrada' });

// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render('pages/500', { title: 'Erro inesperado' });
};
```

- Nunca exiba detalhes técnicos do erro para o visitante em produção.
- Registre o erro no log.

### 6.6 Formulário de contato (POST)

- **Validação no servidor** (obrigatória, mesmo existindo validação no navegador), com `express-validator` ou `zod`:
  - `nome`: obrigatório, 2 a 80 caracteres;
  - `email`: obrigatório, formato válido;
  - `mensagem`: obrigatória, 10 a 2000 caracteres.
- **Anti-spam:** campo *honeypot* escondido (se vier preenchido, ignora) e `express-rate-limit` (por exemplo, 5 envios a cada 15 minutos por IP).
- **Envio:** `nodemailer` com SMTP (Gmail com senha de app, Resend, Brevo etc.), configurado pelo `.env`.
- **Padrão PRG (Post/Redirect/Get):** após o envio, redirecionar para `/contato?enviado=1`, para evitar reenvio ao atualizar a página.
- **Em caso de erro:** re-renderizar o formulário mantendo os valores digitados e exibindo as mensagens ao lado de cada campo.
- **Escape de saída:** usar sempre `<%= %>` (escapa HTML) para dados vindos do usuário; `<%- %>` apenas para *includes* e HTML confiável.

### 6.7 Segurança (checklist)

- [ ] `helmet` com Content Security Policy liberando apenas as origens usadas (ex.: Google Fonts)
- [ ] `app.disable('x-powered-by')`
- [ ] Limite de tamanho do corpo das requisições
- [ ] Rate limit no `POST /contato`
- [ ] Links externos com `rel="noopener noreferrer"`
- [ ] Dependências auditadas com `npm audit`
- [ ] HTTPS em produção (a hospedagem fornece)

### 6.8 Scripts do `package.json`

```json
{
  "scripts": {
    "dev": "node --watch --env-file=.env src/server.js",
    "start": "node src/server.js",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "node --test tests/"
  },
  "engines": { "node": ">=20" }
}
```

---

## 7. Front-end: especificação e boas práticas

### 7.1 Templates EJS

- **Um único lugar para cada pedaço repetido:** `head`, `header`, `footer` e `project-card` como *partials*.
- **Dados globais via `res.locals`** (middleware `locals.js`): `profile`, `year`, `currentPath`, disponíveis em todas as views sem precisar passar em cada rota.
- **Views sem lógica pesada:** filtros e ordenações ficam no service; a view só exibe.
- **Título e descrição por página:** cada `render` envia `title` e, opcionalmente, `description`.

Exemplo de `head.ejs`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><%= title %> | Jeimili Mendes</title>
  <meta name="description" content="<%= typeof description !== 'undefined' ? description : profile.headline %>">
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
```

### 7.2 HTML semântico

```html
<header>  <nav aria-label="Principal">…</nav>  </header>
<main id="conteudo">
  <section aria-labelledby="titulo-projetos">
    <h2 id="titulo-projetos">Projetos</h2>
    <article class="card">…</article>
  </section>
</main>
<footer>…</footer>
```

- Um único `<h1>` por página; hierarquia de títulos sem pular níveis.
- `<button>` para ações e `<a>` para navegação.
- `alt` descritivo em todas as imagens de conteúdo.

### 7.3 Arquitetura de CSS

- **Design tokens** em `tokens.css` (variáveis CSS), para que todas as cores e espaçamentos venham de um único lugar:

```css
:root {
  /* Cores */
  --color-bg: #f7f5f0;
  --color-surface: #ffffff;
  --color-text: #1c1b19;
  --color-muted: #6b675f;
  --color-border: #e3dfd6;
  --color-primary: #1f4e46;
  --color-on-primary: #ffffff;
  --color-error: #b3261e;
  --color-success: #1e7a4c;

  /* Tipografia */
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: clamp(1.5rem, 3vw, 2rem);
  --text-2xl: clamp(2rem, 5vw, 3.25rem);

  /* Espaçamento (escala de 4px) */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem;    --space-6: 1.5rem; --space-8: 2rem;
  --space-12: 3rem;   --space-16: 4rem;

  /* Outros */
  --radius: 12px;
  --shadow: 0 10px 30px -15px rgb(0 0 0 / 0.25);
  --container: 1080px;
  --transition: 200ms ease;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #141412;
    --color-surface: #1d1c1a;
    --color-text: #ece9e2;
    --color-muted: #a19c92;
    --color-border: #2e2c29;
    --color-primary: #7fbfb1;
    --color-on-primary: #10201d;
  }
}
```

- **Nomenclatura de classes BEM** (`.card`, `.card__title`, `.card--featured`), para evitar conflitos e deixar claro o que cada classe faz.
- **Mobile-first:** estilos base para celular e `@media (min-width: …)` para telas maiores.
- **Sem estilos inline** e sem `!important`, salvo exceções justificadas.
- **Layout com Flexbox e Grid**; evitar larguras fixas em `px` para blocos de conteúdo.

### 7.4 JavaScript no navegador

- JavaScript puro, carregado com `defer`.
- **Melhoria progressiva:** o site precisa funcionar sem JavaScript; o JS só melhora a experiência (menu mobile, animações, validação instantânea).
- Funcionalidades previstas:
  - abrir e fechar o menu mobile, atualizando `aria-expanded`;
  - animação de entrada com `IntersectionObserver`, respeitando `prefers-reduced-motion`;
  - validação do formulário no navegador (Constraint Validation API) com mensagens em português;
  - botão de alternar tema claro/escuro, com a preferência salva em `localStorage` (opcional).

---

## 8. Funcionalidades a desenvolver

### 8.1 Página inicial (`/`)
- **Hero:** nome, cargo, frase de apresentação e dois botões ("Ver projetos" e "Fale comigo").
- **Destaques:** até 3 projetos marcados com `featured: true`.
- **Diferencial:** bloco curto "Da área financeira para a tecnologia", com 3 pontos fortes (visão de negócio, organização, resolução de problemas).
- **Chamada final** para contato.

### 8.2 Sobre (`/sobre`)
- Foto profissional e nome, cargo e localização.
- Texto de apresentação (seção 16).
- **Competências** agrupadas (Front-end, Back-end, Banco de dados, Ferramentas).
- **Linha do tempo** de formação e experiência, incluindo os 7 anos na área financeira.
- **Botão "Baixar currículo (PDF)"**.

### 8.3 Projetos (`/projetos`)
- Grade de cards (imagem, título, ano, resumo, tecnologias).
- **Filtro por tecnologia** via `?tag=` (funciona sem JS, pois é um link).
- Ordenação do mais recente para o mais antigo.
- Estado vazio ("Nenhum projeto com essa tecnologia").

### 8.4 Detalhe do projeto (`/projetos/:slug`), em formato de estudo de caso
Estrutura recomendada para convencer recrutadores:
1. **Contexto e problema:** qual dor o projeto resolve e para quem.
2. **Meu papel:** o que você fez.
3. **Solução:** principais funcionalidades e decisões técnicas.
4. **Tecnologias.**
5. **Desafios e aprendizados:** um problema difícil e como foi resolvido.
6. **Resultado:** o que mudou ou o que ficou funcionando.
7. **Links:** "Ver online" e "Código no GitHub".
8. Galeria de capturas de tela.
9. Navegação para o projeto anterior e o próximo.

### 8.5 Contato (`/contato`)
- Formulário (nome, e-mail, mensagem) com validação dupla, anti-spam e mensagem de sucesso.
- Links diretos: e-mail (`mailto:`), LinkedIn e GitHub.

### 8.6 Páginas de sistema
- 404 personalizada, com link de volta.
- 500 genérica e amigável.

### 8.7 Extras (opcionais)
- Alternador de tema claro/escuro.
- `GET /api/projetos` em JSON (demonstra conhecimento de API REST).
- `sitemap.xml` e `robots.txt`.
- Contagem de visitas simples ou integração com analytics que respeite a privacidade (Plausible, Umami).
- Versão em inglês (`/en`) no futuro.

### 8.8 Modelo de dados

`data/profile.json`:

```json
{
  "name": "Jeimili Mendes",
  "role": "Desenvolvedora Full Stack",
  "location": "Cidade, UF",
  "email": "jeisiqueira7@gmail.com",
  "headline": "Desenvolvedora Full Stack em transição de carreira, unindo 7 anos de experiência na área financeira à tecnologia para criar soluções que resolvem problemas reais.",
  "photo": "/img/foto.webp",
  "cv": "/curriculo-jeimili-mendes.pdf",
  "summary": ["parágrafo 1", "parágrafo 2", "..."],
  "skills": [{ "group": "Back-end", "items": ["Node.js", "Express"] }],
  "experience": [{ "period": "", "role": "", "company": "", "description": "" }],
  "education": [{ "period": "", "title": "", "institution": "" }],
  "social": { "github": "", "linkedin": "" }
}
```

`data/projects.json` (um item):

```json
{
  "slug": "controle-financeiro",
  "title": "Controle Financeiro",
  "year": 2025,
  "type": "Pessoal",
  "featured": true,
  "summary": "Uma frase sobre o que o projeto faz.",
  "problem": "Qual problema ele resolve.",
  "role": "O que eu fiz.",
  "solution": ["Funcionalidade 1", "Funcionalidade 2"],
  "challenges": "Um desafio e como resolvi.",
  "result": "O que o projeto entrega.",
  "tags": ["Node.js", "JavaScript"],
  "cover": "/img/projetos/controle-financeiro.webp",
  "gallery": [],
  "links": { "demo": "", "repo": "" }
}
```

---

## 9. Responsividade

| Breakpoint | Largura | Comportamento |
|---|---|---|
| Base (celular) | < 640px | 1 coluna; menu recolhido em botão; margens laterais de 16px; botões em largura total quando fizer sentido |
| `sm` | ≥ 640px | Cards em 2 colunas |
| `md` | ≥ 768px | Menu horizontal visível; foto e texto lado a lado na página "Sobre" |
| `lg` | ≥ 1024px | Cards em 3 colunas; container com largura máxima de 1080px |

Boas práticas:
- `meta viewport` em todas as páginas.
- Tipografia fluida com `clamp()`.
- Grade automática: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`.
- Imagens com `max-width: 100%`, `aspect-ratio` definido e `srcset`/`sizes` para servir tamanhos diferentes.
- Áreas de toque de no mínimo 44×44px.
- Nenhuma rolagem horizontal em 320px de largura.
- Testar no DevTools (modo dispositivo) e em um celular real.

---

## 10. UI/UX

### 10.1 Princípios
- **Clareza em 5 segundos:** ao abrir o site, o recrutador precisa entender quem você é, o que faz e onde ver seus projetos.
- **Hierarquia visual:** título grande, subtítulo em cor mais suave, um único botão principal por seção.
- **Consistência:** mesmas cores, espaçamentos, raios de borda e estilo de botões em todas as páginas (garantido pelos tokens).
- **Espaço em branco:** seções com respiro (`--space-12` a `--space-16` entre blocos).
- **Leitura confortável:** linhas de texto com 60 a 75 caracteres (`max-width: 65ch`) e altura de linha de 1.6.

### 10.2 Identidade visual
- **Paleta:** um tom neutro de fundo, uma cor de destaque (verde-petróleo sugerido, que transmite confiança e combina com a origem na área financeira) e cores de feedback (erro e sucesso).
- **Tipografia:** uma fonte serifada para títulos (personalidade) e uma sem serifa para o texto (legibilidade). No máximo duas famílias.
- **Ícones:** um único conjunto (ex.: Lucide), em SVG.

### 10.3 Navegação e feedback
- Item do menu da página atual destacado (com `aria-current="page"`).
- Cabeçalho fixo no topo ao rolar.
- Estados de `:hover`, `:focus-visible` e `:active` em todos os elementos clicáveis.
- Formulário com mensagens de erro ao lado do campo, em linguagem simples, e confirmação clara após o envio.
- Botão de envio desativado durante o envio, com texto "Enviando...".
- Links externos sinalizados (ícone ou texto "abre em nova aba").

### 10.4 Microinterações
- Cards que sobem levemente no `hover`.
- Entrada suave das seções ao rolar.
- Transições de 150 a 250ms; nada piscando ou se movendo sem motivo.
- Tudo desativado quando o usuário prefere menos movimento (`prefers-reduced-motion`).

---

## 11. Acessibilidade

Meta: **WCAG 2.2 nível AA**.

- [ ] Contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande
- [ ] `lang="pt-BR"` no `<html>`
- [ ] Link "Pular para o conteúdo" no início da página
- [ ] Navegação completa pelo teclado (Tab, Shift+Tab, Enter), com foco sempre visível
- [ ] Botão do menu mobile com `aria-expanded`, `aria-controls` e rótulo
- [ ] `<label>` associado a cada campo do formulário; erros ligados ao campo com `aria-describedby`
- [ ] Imagens decorativas com `alt=""`; imagens de conteúdo com descrição
- [ ] Não depender só da cor para transmitir informação
- [ ] Testar com o Lighthouse e a extensão axe DevTools

---

## 12. Desempenho e SEO

### 12.1 Desempenho
- **Meta Lighthouse:** 90+ em Performance, Acessibilidade, Boas Práticas e SEO.
- `compression` (gzip) no servidor.
- Cache de arquivos estáticos (`maxAge`) e cache de views em produção.
- Imagens em `.webp`, redimensionadas, com `loading="lazy"` (exceto a primeira da tela) e `width`/`height` definidos para evitar saltos no layout.
- Fontes com `display=swap` e `preconnect`; considerar hospedar as fontes localmente.
- CSS e JS pequenos; nenhuma biblioteca pesada sem necessidade.

### 12.2 SEO
- `<title>` e `<meta name="description">` únicos por página.
- Open Graph (`og:title`, `og:description`, `og:image`) para boas prévias no LinkedIn e no WhatsApp.
- URLs amigáveis em português (`/projetos/controle-financeiro`).
- `sitemap.xml` e `robots.txt`.
- Dados estruturados JSON-LD do tipo `Person` na página inicial.
- Link canônico (`<link rel="canonical">`).

---

## 13. Qualidade de código, testes e versionamento

### 13.1 Padronização
- **ESLint** para encontrar erros e **Prettier** para formatar automaticamente.
- `.editorconfig` com indentação de 2 espaços e UTF-8.
- Nomes de variáveis e funções claros (em inglês ou em português, mas sem misturar).
- Funções pequenas, com uma responsabilidade cada.

### 13.2 Testes
- `node:test` (nativo do Node) e `supertest` para testar as rotas:
  - cada página responde 200;
  - uma rota inexistente responde 404;
  - `/projetos/slug-invalido` responde 404;
  - `POST /contato` com dados inválidos devolve os erros;
  - funções do `projects.service` (filtro por tag, destaques).

### 13.3 Git e GitHub
- Repositório público no GitHub, que também faz parte do portfólio.
- `.gitignore` com `node_modules/` e `.env`.
- Commits pequenos e frequentes, no padrão *Conventional Commits*:
  - `feat: adiciona página de projetos`
  - `fix: corrige link do menu`
  - `style: ajusta espaçamento dos cards`
  - `refactor: separa rotas em arquivos`
- README com descrição, prints, tecnologias, como rodar e link do site publicado.
- (Opcional) GitHub Actions rodando `lint` e `test` a cada `push`.

---

## 14. Publicação (deploy)

| Opção | Observação |
|---|---|
| **Render** | Plano gratuito; conecta direto ao GitHub; ótimo para começar |
| **Railway** | Simples, com créditos iniciais |
| **Fly.io** | Mais configurável |
| VPS (ex.: DigitalOcean) | Mais controle, exige configurar servidor, PM2 e Nginx |

Passos gerais:
1. Código no GitHub.
2. Criar o serviço na plataforma e conectar o repositório.
3. Comando de *build*: `npm install`; comando de *start*: `npm start`.
4. Variáveis de ambiente: `NODE_ENV=production`, `SMTP_*`, `CONTACT_TO`.
5. (Opcional) Domínio próprio, como `jeimilimendes.dev`.
6. Rodar o Lighthouse no site publicado.

---

## 15. Roteiro por fases (checklist)

### Fase 1: Templates e organização inicial
- [ ] Concluir `sobre.ejs` com `res.render('sobre')`
- [ ] Migrar `/projetos` e `/contato` para EJS
- [ ] Criar *partials* `head.ejs`, `header.ejs` e `footer.ejs`
- [ ] Adicionar página 404 com `app.use()` no final
- [ ] Iniciar o Git, criar o `.gitignore` e fazer o primeiro commit
- [ ] Publicar o repositório no GitHub

### Fase 2: Dados separados do código
- [ ] Criar `data/profile.json` e `data/projects.json`
- [ ] Passar os dados para as views com `res.render('pagina', { dados })`
- [ ] Usar `forEach` no EJS para listar projetos e competências
- [ ] Criar a rota dinâmica `/projetos/:slug` com `req.params`
- [ ] Middleware `res.locals` para o perfil e o ano

### Fase 3: CSS e responsividade
- [ ] Servir arquivos estáticos com `express.static('public')`
- [ ] Criar os tokens e o CSS base
- [ ] Header com menu responsivo (CSS + JS do botão mobile)
- [ ] Cards de projeto em grade responsiva
- [ ] Páginas "Sobre" (linha do tempo, competências) e "Contato" estilizadas
- [ ] Modo escuro automático
- [ ] Testar em 320px, 768px e 1280px

### Fase 4: Arquitetura do back-end
- [ ] Separar `app.js` e `server.js`
- [ ] Mover as rotas para `routes/` e a lógica para `controllers/` e `services/`
- [ ] `dotenv`, `config/index.js` e `process.env.PORT`
- [ ] Middlewares `notFound` e `errorHandler` (páginas 404 e 500)
- [ ] `morgan` para logs

### Fase 5: Formulário de contato
- [ ] Formulário HTML acessível
- [ ] `express.urlencoded` e rota `POST /contato`
- [ ] Validação no servidor (`express-validator` ou `zod`)
- [ ] Validação no navegador
- [ ] Envio de e-mail com `nodemailer`
- [ ] Honeypot e rate limit
- [ ] Padrão PRG com mensagem de sucesso

### Fase 6: Segurança, desempenho e SEO
- [ ] `helmet` (com CSP), `compression` e cache de estáticos
- [ ] Imagens otimizadas em `.webp`
- [ ] Meta tags, Open Graph, `sitemap.xml`, `robots.txt` e JSON-LD
- [ ] Lighthouse com 90+ nas quatro categorias

### Fase 7: Qualidade
- [ ] ESLint, Prettier e `.editorconfig`
- [ ] Testes com `node:test` e `supertest`
- [ ] README completo
- [ ] (Opcional) GitHub Actions

### Fase 8: Publicação e conteúdo final
- [ ] Deploy (Render ou similar)
- [ ] Preencher os estudos de caso dos 3 projetos, com capturas de tela
- [ ] Foto profissional e currículo em PDF
- [ ] Domínio próprio (opcional)
- [ ] Divulgar no LinkedIn

---

## 16. Conteúdo pronto

### Frase curta (página inicial)

> Desenvolvedora Full Stack em transição de carreira, unindo 7 anos de experiência na área financeira à tecnologia para criar soluções que resolvem problemas reais.

### Texto "Sobre mim"

> Sou Jeimili Mendes, desenvolvedora Full Stack, e trago para a tecnologia algo que vai além do código: a experiência de quem passou 7 anos resolvendo problemas reais na área financeira.
>
> Sou graduada em Administração, pós-graduada em Gestão Financeira e estou concluindo o curso de Análise e Desenvolvimento de Sistemas. Escolhi a transição de carreira com planejamento e dedicação, e levo para o desenvolvimento de software as mesmas qualidades que me acompanharam até aqui: organização, responsabilidade com prazos, atenção aos detalhes e uma visão de negócio que me faz entender o problema antes de propor a solução.
>
> Meus projetos mostram essa forma de trabalhar. Desenvolvi um sistema de controle financeiro, que une minha experiência profissional à programação; um sistema de agendamento para salão de beleza, pensado para facilitar a rotina de quem atende clientes; e, no meio acadêmico, o projeto Voz e Proteção, voltado aos direitos humanos.
>
> Gosto de atuar em todas as etapas do desenvolvimento: criar interfaces claras, resolver problemas com lógica e garantir que as aplicações sejam rápidas e eficientes. Encaro cada desafio como uma oportunidade de aprender e entregar um resultado melhor.
>
> Estou pronta para minha primeira oportunidade na área de tecnologia e para contribuir com dedicação, maturidade profissional e vontade de crescer junto com a equipe.

### Projetos (informações a completar)

| Projeto | Tipo | A completar |
|---|---|---|
| Controle Financeiro | Pessoal | Tecnologias, problema, funcionalidades, desafios, prints, links |
| Agendamento de Salão de Beleza | Pessoal | Tecnologias, problema, funcionalidades, desafios, prints, links |
| Voz e Proteção | Acadêmico (direitos humanos) | Tecnologias, problema, sua participação na equipe, prints, links |

---

*Próximo passo do aprendizado: concluir a Fase 1, começando pelo desafio da página "Sobre" com EJS.*
