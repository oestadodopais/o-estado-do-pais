import { REFERENCIAS_DAS_MEDIDAS } from '../../src/data/referencias-das-medidas.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';

const linhas = loadClaims();
const numero = (v) => Number(String(v).replaceAll('−', '-').replaceAll(',', '.').replaceAll(' ', ''));
const escrito = (v) => `${v.sinal === '+' ? '' : v.sinal ?? ''}${v.nl}`;
const texto = (n) => (n?.text ?? '').replace(/\s+/g, ' ').trim();

/** K15 tem conta própria: não chama o construtor nem a função de estado. */
export function veredictoEsperado(id, lang, linha = linhas.get(id), referencia = REFERENCIAS_DAS_MEDIDAS.get(id)) {
  const r = referencia?.limiar;
  if (!r) return null;
  const banda = Boolean(r.inferior && r.superior);
  const inferior = banda ? r.inferior : r.lado === 'inferior' ? r : null;
  const superior = banda ? r.superior : r.lado === 'superior' ? r : null;
  const valor = numero(linha?.value);
  if (!Number.isFinite(valor)) return null;
  const abaixo = inferior && valor < numero(escrito(inferior));
  const acima = superior && valor > numero(escrito(superior));
  const estado = abaixo || acima ? 'fora' : 'dentro';
  const ingles = lang === 'en';
  const palavra = ingles
    ? `${estado === 'fora' ? 'outside' : 'within'} the reference value${banda ? 's' : ''}`
    : `${estado === 'fora' ? 'fora' : 'dentro'} ${banda ? 'dos valores' : 'do valor'} de referência`;
  const dono = { pacto: ingles ? ' of the Pact' : ' do Pacto', conselho: ingles ? ' of the Council of the EU' : ' do Conselho da UE' }[referencia?.limiarFixadoPor] ?? '';
  const simbolo = r.simbolo?.trim() ?? '%';
  let direcao;
  if (banda && estado === 'dentro') {
    direcao = `${ingles ? 'between' : 'entre'} ${escrito(inferior)} ${ingles ? 'and' : 'e'} ${escrito(superior)}`;
  } else {
    const ponta = banda ? (abaixo ? inferior : superior) : r;
    const n = numero(escrito(ponta));
    const relacao = valor < n ? (ingles ? 'below' : 'abaixo de') : valor > n
      ? (ingles ? 'above' : 'acima de') : (ingles ? 'equal to' : 'igual a');
    direcao = `${relacao} ${escrito(ponta)}`;
  }
  return { estado, texto: `${palavra}${dono} (${direcao} ${simbolo})` };
}

export function auditarVeredicto(cartao, id, lang, linha, referencia) {
  const esperado = veredictoEsperado(id, lang, linha, referencia);
  if (!esperado) return [];
  const erros = [];
  const blocos = cartao.querySelectorAll('[data-veredicto-referencia]');
  if (blocos.length !== 1 || texto(blocos[0]) !== esperado.texto) {
    erros.push(`K15 · ${id}: veredicto em palavras ausente ou diferente; esperado «${esperado.texto}»`);
  }
  if (blocos[0]?.getAttribute('data-veredicto-referencia') !== esperado.estado ||
      !blocos[0]?.classList.contains(`est-${esperado.estado}`) ||
      cartao.querySelectorAll(`.sq-${esperado.estado}`).length !== 1 ||
      cartao.querySelector(`.sq-${esperado.estado === 'fora' ? 'dentro' : 'fora'}`)) {
    erros.push(`K15 · ${id}: a cor não repete o veredicto «${esperado.estado}»`);
  }
  return erros;
}
