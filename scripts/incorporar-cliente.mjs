/* Função sem dependências, emitida como ES2015 pelo gerador. Só lê os seus
   parágrafos. O destino do pedido é fixado na construção, nunca pelo blogue. */
export function incorporar(origem) {
  'use strict';
  function atualizar(p) {
    if (p.oedpPedido) return;
    p.oedpPedido = true;
    var id = p.getAttribute('data-oedp');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id || '')) return;
    var lang = p.getAttribute('lang') === 'en' ? 'en' : 'pt';
    var citado = p.getAttribute('data-oedp-valor');
    var destino = origem + (lang === 'en' ? '/en/ledger/' : '/livro-razao/') + id;
    if (typeof fetch !== 'function') return;
    fetch(origem + '/livro-razao/' + id + '.json', {
      credentials: 'omit', mode: 'cors', redirect: 'error', referrerPolicy: 'no-referrer', cache: 'no-cache'
    }).then(function (r) {
      if (!r.ok) throw Error('resposta');
      return r.json();
    }).then(function (j) {
      var c = j.linha;
      var d = j.incorporacao && j.incorporacao[lang];
      var campos = ['nome', 'periodo', 'valor', 'unidade', 'unidadeLang', 'fonte', 'fonteLang', 'data', 'leitura', 'atribuicao', 'notas', 'atualizacao'];
      if (!c || c.id !== id || !d || d.valor !== c.value || !j.licenca ||
          !campos.every(function (k) { return typeof d[k] === 'string'; }) ||
          !/^(pt-PT|pt|en)$/.test(d.fonteLang) || !/^(pt-PT|pt|en)$/.test(d.unidadeLang)) return;
      /* Compõe fora do documento e só troca depois de validar tudo. Nenhum
         texto recebido é interpretado como HTML, código ou endereço. */
      var novo = document.createElement('p');
      var a = document.createElement('a');
      a.href = destino;
      a.textContent = d.nome + ', ' + d.periodo + ': ' + d.valor + ' ';
      var unidade = document.createElement('span');
      unidade.lang = d.unidadeLang;
      unidade.textContent = d.unidade;
      a.appendChild(unidade);
      novo.appendChild(a);
      novo.appendChild(document.createTextNode(' '));
      var fonte = document.createElement('span');
      fonte.lang = d.fonteLang;
      fonte.textContent = d.fonte;
      novo.appendChild(fonte);
      novo.appendChild(document.createTextNode(', ' + d.leitura + ' · ' + d.atribuicao));
      if (d.notas) {
        var notas = document.createElement('span');
        notas.textContent = d.notas;
        novo.appendChild(document.createTextNode(' '));
        novo.appendChild(notas);
      }
      if (c.value !== citado) {
        var aviso = document.createElement('a');
        aviso.href = destino;
        aviso.textContent = d.atualizacao;
        aviso.setAttribute('data-oedp-atualizado', '');
        novo.appendChild(document.createTextNode(' · '));
        novo.appendChild(aviso);
      }
      while (p.firstChild) p.removeChild(p.firstChild);
      while (novo.firstChild) p.appendChild(novo.firstChild);
      p.setAttribute('data-oedp-valor', c.value);
      p.setAttribute('data-oedp-lido', d.data);
    }).catch(function () { /* O código colado continua inteiro. */ });
  }
  function iniciar() {
    Array.prototype.forEach.call(document.querySelectorAll('p.oedp-numero[data-oedp]'), atualizar);
  }
  /* Um async pode chegar antes de outro parágrafo. As duas passagens só pedem
     os elementos ainda não vistos, mesmo com mais de uma cópia do guião. */
  iniciar();
  document.addEventListener('DOMContentLoaded', iniciar, { once: true });
}
