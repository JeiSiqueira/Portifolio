// Chega aqui qualquer requisição que nenhuma rota respondeu.
module.exports = (req, res) => {
  res.status(404).render('pages/404', { title: 'Página não encontrada' });
};
