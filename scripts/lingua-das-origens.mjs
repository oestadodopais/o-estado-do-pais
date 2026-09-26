/** RP1c: a língua das transcrições vem da origem, nas duas edições. */
import { ORIGENS_DAS_DEFINICOES } from '../src/data/figuras.mjs';

export function conferirLinguaDasOrigens(root, lang) {
  const erros = [];
  for (const bloco of root.querySelectorAll('[data-def-origem]')) {
    const chave = bloco.getAttribute('data-def-origem');
    const origem = ORIGENS_DAS_DEFINICOES[chave];
    if (!origem) { erros.push(`L10 · origem desconhecida: ${chave}`); continue; }
    const declarada = origem.lingua ?? (chave === 'bdp-pii' ? 'pt' : 'en');
    for (const [seletor, lingua] of [
      ['.def-origem-doc', declarada],
      ['.def-excerto-texto', lang === 'en' && origem.excertoEn ? 'en' : declarada],
    ]) {
      const esperado = lingua === 'pt' ? 'pt-PT' : lingua;
      const el = bloco.querySelector(seletor);
      if (el?.getAttribute('lang') !== esperado) erros.push(`L10 · ${chave}: ${seletor} sem a língua declarada ${esperado}`);
    }
  }
  return erros;
}
