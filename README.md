# Portfólio: Jeimili Mendes

Site pessoal de Jeimili Mendes, desenvolvedora Full Stack em transição de carreira (7 anos na área financeira).
As páginas são renderizadas no servidor (SSR) com Node.js, Express e EJS, com HTML, CSS e JavaScript puro no navegador.

## Tecnologias

- **Back-end:** Node.js (≥ 20), Express 5, EJS
- **Segurança e desempenho:** helmet (CSP), compression, cache de estáticos
- **Front-end:** CSS com design tokens, mobile-first e BEM; JS puro com melhoria progressiva (menu mobile, tema claro/escuro, animações)
- **Qualidade:** `node:test` + supertest, ESLint, Prettier, EditorConfig

## Como rodar

```bash
npm install
cp .env.example .env   # opcional: porta e endereço público do site
npm run dev            # http://localhost:3000 (reinicia ao salvar)
```

| Script           | O que faz                                       |
| ---------------- | ----------------------------------------------- |
| `npm run dev`    | Servidor em modo desenvolvimento, com `--watch` |
| `npm start`      | Servidor em produção                            |
| `npm test`       | Roda os testes                                  |
| `npm run lint`   | Verifica o código com ESLint                    |
| `npm run format` | Formata o código com Prettier                   |

## Estrutura

```
src/
├── app.js             # configura o Express (middlewares e rotas)
├── server.js          # ponto de entrada (listen)
├── config/            # variáveis de ambiente
├── routes/            # mapa de URLs
├── controllers/       # recebem a requisição e escolhem a view
├── services/          # regras de negócio (projetos)
├── middlewares/       # locals, 404, erros
├── data/              # profile.json e projects.json (conteúdo do site)
└── views/             # templates EJS (partials + pages)
public/                # CSS, JS, imagens
tests/                 # testes automatizados
```

## Rotas

| Método | Rota                          | Descrição                            |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | `/`                           | Início                               |
| GET    | `/sobre`                      | Sobre mim, competências e trajetória |
| GET    | `/projetos`                   | Lista de projetos (filtro `?tag=`)   |
| GET    | `/projetos/:slug`             | Estudo de caso do projeto            |
| GET    | `/contato`                    | E-mail, LinkedIn e GitHub            |
| GET    | `/api/projetos`               | Projetos em JSON                     |
| GET    | `/sitemap.xml`, `/robots.txt` | SEO                                  |
| GET    | `/health`                     | Healthcheck (usado pelo Docker)      |

## Atualizar o conteúdo

Todo o conteúdo fica em `src/data/`. Para adicionar um projeto, inclua um item em `projects.json`;
para trocar textos, competências ou redes sociais, edite `profile.json`. Não é preciso mexer no HTML.

## Rodar com Docker

```bash
docker compose up --build --watch   # http://localhost:3000 com hot reload
docker compose run --rm test        # lint + testes no container
```

## Deploy

Produção com Docker + Caddy (HTTPS automático) em uma VPS, ou em plataformas como Render usando o
`Dockerfile` (target `prod`). Passo a passo completo em [DEPLOY.md](DEPLOY.md).
