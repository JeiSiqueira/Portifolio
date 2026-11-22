// Carregado no <head> sem defer: aplica o tema salvo antes de desenhar a página
// e marca que o JS está ativo (o CSS usa a classe .js para a melhoria progressiva).
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch {
    /* localStorage indisponível: segue o tema do sistema */
  }
})();
