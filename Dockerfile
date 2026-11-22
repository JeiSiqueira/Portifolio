# syntax=docker/dockerfile:1
# ----------------------------------------------------------------------------
# Dockerfile multi-stage do portfólio (Node.js + Express + EJS)
#
#   docker build --target dev  -t portfolio:dev  .   -> desenvolvimento (com devDependencies e --watch)
#   docker build --target test -t portfolio:test .   -> roda lint + testes (falha o build se quebrar)
#   docker build --target prod -t portfolio:prod .   -> produção (enxuta, sem devDependencies, usuário não-root)
# ----------------------------------------------------------------------------

ARG NODE_VERSION=24

# ---------- base: imagem comum a todos os estágios ----------
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
# tini repassa sinais (SIGTERM do `docker stop`) e recolhe processos zumbis
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# ---------- deps: todas as dependências (inclui dev) ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ---------- dev: ambiente local com hot reload ----------
FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- test: lint + testes automatizados ----------
FROM deps AS test
ENV NODE_ENV=test
COPY . .
RUN npm run lint && npm test

# ---------- prod-deps: só dependências de produção ----------
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev && npm cache clean --force

# ---------- prod: imagem final ----------
FROM base AS prod
ENV NODE_ENV=production \
    PORT=3000
# Copia apenas o necessário para rodar, já com dono "node" (usuário sem privilégios da imagem oficial)
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# Chama o node direto (sem npm) para receber os sinais corretamente
CMD ["node", "src/server.js"]
