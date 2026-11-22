# Deploy em produção com Docker

Este guia mostra como colocar o portfólio no ar em um servidor (VPS) usando Docker, com HTTPS automático.
Também cobre o uso local e alternativas em plataformas gerenciadas.

---

## 1. Visão geral

```
                Internet
                    │  80 / 443 (HTTP/HTTPS)
                    ▼
        ┌───────────────────────┐
        │  caddy (proxy reverso) │  ← emite e renova o certificado HTTPS (Let's Encrypt)
        └───────────┬───────────┘
                    │  rede interna do Docker
                    ▼
        ┌───────────────────────┐
        │  web (Node + Express)  │  ← porta 3000, não exposta à internet
        └───────────────────────┘
```

| Arquivo                   | Para quê                                                      |
| ------------------------- | ------------------------------------------------------------- |
| `Dockerfile`              | Imagem multi-stage com os estágios `dev`, `test` e `prod`     |
| `.dockerignore`           | O que não entra na imagem (`node_modules`, `.env`, `.git`...) |
| `docker-compose.yml`      | Ambiente **local** com hot reload e serviço de testes         |
| `docker-compose.prod.yml` | Ambiente de **produção**: app + Caddy (HTTPS)                 |
| `deploy/Caddyfile`        | Configuração do proxy reverso                                 |
| `.env.production.example` | Modelo das variáveis de produção                              |

### O que a imagem de produção já faz

- Base `node:24-alpine`, só dependências de produção (`npm ci --omit=dev`).
- Roda como usuário **`node`** (não-root), com filesystem **somente leitura** e sem capabilities do Linux.
- `tini` como processo inicial: o `docker stop` envia `SIGTERM` e o app encerra de forma graciosa.
- `HEALTHCHECK` na rota `GET /health`. O Caddy só sobe depois que o app estiver saudável.
- Logs com rotação (10 MB × 3 arquivos) para não encher o disco.
- Limite de 256 MB de memória e meia CPU.

---

## 2. Rodando localmente

Pré-requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
# Sobe o site em http://localhost:3000 com hot reload
docker compose up --build --watch

# Roda lint + testes dentro do container
docker compose run --rm test

# Para tudo
docker compose down
```

> O `--watch` copia as alterações de `src/`, `public/` e `tests/` para o container, e o `node --watch`
> reinicia o servidor. Se mudar o `package-lock.json`, a imagem é reconstruída sozinha.

Para testar a **imagem de produção** na sua máquina:

```bash
docker build --target prod -t portfolio:prod .
docker run --rm -p 3000:3000 -e SITE_URL=http://localhost:3000 portfolio:prod
```

---

## 3. Deploy em uma VPS (passo a passo)

Funciona em qualquer servidor Linux: DigitalOcean, Hetzner, AWS Lightsail, Oracle Cloud (free tier), Contabo etc.
O exemplo usa **Ubuntu 24.04**. Uma máquina com 1 vCPU e 1 GB de RAM é suficiente.

### 3.1 Apontar o domínio

No painel do seu provedor de DNS (Registro.br, Cloudflare, Hostinger...), crie:

| Tipo | Nome  | Valor          |
| ---- | ----- | -------------- |
| A    | `@`   | IP do servidor |
| A    | `www` | IP do servidor |

Confira a propagação com `nslookup seudominio.com.br`. O HTTPS só é emitido depois que o DNS aponta para o servidor.

> Usando Cloudflare: deixe o proxy (nuvem laranja) **desligado** na primeira subida para o Caddy
> conseguir emitir o certificado. Depois pode ligar, com SSL no modo **Full (strict)**.

### 3.2 Preparar o servidor

```bash
ssh root@IP_DO_SERVIDOR

# Atualiza o sistema e instala o Docker (script oficial)
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh

# Cria um usuário para o deploy (evita usar root no dia a dia)
adduser deploy
usermod -aG docker deploy

# Firewall: só SSH, HTTP e HTTPS
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw enable
```

### 3.3 Enviar o código

```bash
su - deploy
git clone https://github.com/JeiSiqueira/<repositorio>.git portfolio
cd portfolio
```

> Sem Git? Envie a pasta com `scp -r` ou `rsync` a partir da sua máquina (sem a pasta `node_modules`).

### 3.4 Configurar as variáveis

```bash
cp .env.production.example .env.production
nano .env.production
```

```ini
DOMAIN=seudominio.com.br
SITE_URL=https://seudominio.com.br
```

### 3.5 Subir

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

Na primeira vez, o Caddy pede o certificado ao Let's Encrypt (leva alguns segundos).

### 3.6 Verificar

```bash
docker compose -f docker-compose.prod.yml ps        # web deve aparecer como "healthy"
curl -I https://seudominio.com.br                    # HTTP/2 200
curl https://seudominio.com.br/health                # {"status":"ok",...}
```

Abra o site no navegador e confira o cadeado do HTTPS. 🎉

> Dica: para não repetir os parâmetros, crie um alias:
> `alias dc='docker compose -f docker-compose.prod.yml --env-file .env.production'`
> (os exemplos abaixo usam esse `dc`).

---

## 4. Operação do dia a dia

### Atualizar o site (novo deploy)

```bash
cd ~/portfolio
git pull
dc up -d --build web       # reconstrói e troca só o app; o Caddy continua no ar
docker image prune -f      # remove imagens antigas
```

### Logs

```bash
dc logs -f web             # logs do app (formato Apache "combined")
dc logs -f caddy           # logs do proxy / certificados
```

### Reiniciar, parar e status

```bash
dc restart web
dc down                    # para tudo (os certificados ficam salvos no volume caddy_data)
dc ps
docker stats               # uso de CPU e memória
```

### Voltar para a versão anterior (rollback)

```bash
git log --oneline -5             # escolhe o commit bom
git checkout <commit>
dc up -d --build web
```

> Com imagens versionadas em um registry (seção 5), basta trocar a tag em `IMAGE` e rodar `dc up -d`.

> ⚠️ Não apague o volume `caddy_data` (`docker compose down -v`): ele guarda os certificados.
> Emitir muitos certificados seguidos pode esbarrar no limite do Let's Encrypt.

---

## 5. (Opcional) Imagem pronta via GitHub Container Registry

Em vez de compilar no servidor, a imagem pode ser gerada no GitHub Actions e só baixada na VPS.
Crie `.github/workflows/docker.yml`:

```yaml
name: Docker
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3

      # Falha o pipeline se lint ou testes quebrarem
      - name: Lint e testes
        uses: docker/build-push-action@v6
        with:
          context: .
          target: test

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build e push
        uses: docker/build-push-action@v6
        with:
          context: .
          target: prod
          push: true
          tags: |
            ghcr.io/${{ github.repository_owner }}/portfolio:latest
            ghcr.io/${{ github.repository_owner }}/portfolio:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

> O nome da imagem no GHCR precisa estar em minúsculas (ex.: `ghcr.io/jeisiqueira/portfolio`).

No servidor, defina a imagem no `.env.production` e use `pull` em vez de `--build`:

```ini
IMAGE=ghcr.io/jeisiqueira/portfolio:latest
```

```bash
docker login ghcr.io                # só se o pacote for privado (use um Personal Access Token)
dc pull web && dc up -d web
```

Para rollback, troque `latest` pelo SHA de um commit anterior.

---

## 6. Alternativa: plataformas gerenciadas

Render, Railway, Fly.io e Koyeb detectam o `Dockerfile` e cuidam do HTTPS. Nesse caso **não use**
o `docker-compose.prod.yml` nem o Caddy.

| Configuração                | Valor                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------- |
| Dockerfile                  | `./Dockerfile`                                                                        |
| Docker target / build stage | `prod`                                                                                |
| Porta                       | `3000` (a plataforma pode injetar `PORT`; o app já lê essa variável)                  |
| Health check                | `/health`                                                                             |
| Variáveis                   | `NODE_ENV=production`, `SITE_URL=https://seu-app.onrender.com` (ou o domínio próprio) |

---

## 7. Problemas comuns

| Sintoma                               | Causa provável / solução                                                                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Caddy em loop com erro de certificado | DNS ainda não aponta para o servidor, portas 80/443 fechadas no firewall ou proxy da Cloudflare ligado. Veja `dc logs caddy`.                    |
| `web` fica `unhealthy`                | Veja `dc logs web`. Teste dentro do container: `dc exec web node -e "fetch('http://127.0.0.1:3000/health').then(r=>r.text()).then(console.log)"` |
| `SITE_URL`/`DOMAIN` obrigatória       | Faltou `--env-file .env.production` ou a variável está vazia.                                                                                    |
| Links do sitemap com `localhost`      | `SITE_URL` não definida em produção.                                                                                                             |
| Porta 80 já em uso                    | Outro servidor web (Apache/Nginx) rodando: `sudo systemctl disable --now apache2 nginx`.                                                         |
| Alterei o código e nada mudou         | Faltou o `--build` no `up` (ou o `pull`, se usar registry).                                                                                      |

---

## Checklist de deploy

- [ ] DNS (`@` e `www`) apontando para o IP do servidor
- [ ] Docker instalado e firewall liberando 22, 80 e 443
- [ ] `.env.production` com `DOMAIN` e `SITE_URL` (com `https://`)
- [ ] `docker compose run --rm test` passando localmente
- [ ] `dc up -d --build` e `dc ps` mostrando `web` como `healthy`
- [ ] `https://seudominio.com.br` abrindo com cadeado e `/sitemap.xml` com o domínio certo
