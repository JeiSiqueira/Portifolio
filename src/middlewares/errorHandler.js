// Trata qualquer erro lançado nas rotas. Registra no log e mostra uma página amigável,
// sem expor detalhes técnicos ao visitante.
// eslint-disable-next-line no-unused-vars -- o Express reconhece o handler de erro pelos 4 parâmetros
module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  if (status === 404) {
    return res.status(404).render('pages/404', { title: 'Página não encontrada' });
  }
  res.status(status >= 400 && status < 600 ? status : 500).render('pages/500', {
    title: 'Erro inesperado',
  });
};
