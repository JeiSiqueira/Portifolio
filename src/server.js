// Ponto de entrada: importa o app configurado e abre a porta.
const app = require('./app');
const { port } = require('./config');

const server = app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Desligamento gracioso: o Docker envia SIGTERM no `docker stop`/deploy.
// Paramos de aceitar conexões, terminamos as em andamento e saímos.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`${signal} recebido, encerrando...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
