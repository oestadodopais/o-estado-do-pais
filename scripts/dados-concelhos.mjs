import { SERIES_ATRASADAS } from '../src/data/frescura.mjs';
import { t } from '../src/i18n/strings.mjs';
/** C7: os valores descarregáveis dos concelhos, conferidos diretamente no YAML.
 * A seleção lê a declaração dos cartões e não chama o gerador do CSV nem
 * `pecasDoConcelho()`. O leitor do CSV também é independente do gerador. */
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';

export const CSV_DOS_CONCELHOS = '/dados/indicadores-dos-concelhos.csv';
const COLUNAS = ['concelho', 'medida', 'valor', 'unidade', 'periodo', 'fonte', 'afirmacao', 'concelho_slug', 'nota'];
const leLinha = (id) => load(fs.readFileSync(path.join(process.cwd(), 'ledger/claims', `${id}.yml`), 'utf8'));

/** Leitura independente de aspas, vírgulas e mudanças de linha de um CSV. */
function ler(texto) {
  const comentarios = [];
  const corpo = texto.split(/\r?\n/).filter((l) => {
    if (l.startsWith('#')) { comentarios.push(l); return false; }
    return true;
  }).join('\n');
  const registos = [];
  let registo = [], campo = '', aspas = false;
  for (let i = 0; i < corpo.length; i++) {
    const c = corpo[i];
    if (c === '"') {
      if (aspas && corpo[i + 1] === '"') { campo += '"'; i++; }
      else aspas = !aspas;
    } else if (!aspas && (c === ',' || c === '\n')) {
      registo.push(campo); campo = '';
      if (c === '\n') { registos.push(registo); registo = []; }
    } else campo += c;
  }
  if (campo || registo.length) registos.push([...registo, campo]);
  return { comentarios, registos, aspas };
}

/** Cada campo do ficheiro contra a linha e a declaração da página. */
export function confereIndicadoresDosConcelhos(texto, linha = leLinha) {
  const erros = [];
  const falha = (texto) => erros.push(`C7 ${CSV_DOS_CONCELHOS}: ${texto}`);
  const { comentarios, registos, aspas } = ler(texto);
  if (aspas) falha('aspas por fechar.');
  const [cabecalho = [], ...dados] = registos;
  if (cabecalho.join(',') !== COLUNAS.join(',')) falha('o cabeçalho não tem as colunas declaradas.');
  if (!comentarios.some((l) => l.includes('ledger/claims/<afirmacao>.yml'))) falha('o cabeçalho não identifica as linhas do livro-razão.');
  if (!comentarios.some((l) => l.includes('/metodo'))) falha('o cabeçalho não liga ao Método.');
  const esperadas = new Map();
  for (const m of MUNICIPIOS_COM_PAGINA) {
    for (const medida of m.relance) {
      if (!medida.claim) continue;
      const c = linha(medida.claim);
      const dataDoCartao = medida.periodo.pt.filter((p) => p && typeof p === 'object' && 'ref' in p);
      const periodo = c.reference_date ?? (dataDoCartao.length === 1 ? dataDoCartao[0].ref : null);
      if (periodo === null || periodo === undefined || periodo === '') falha(`${c.id}: período ausente ou ambíguo.`);
      const chave = JSON.stringify([m.slug, medida.nome.pt]);
      if (esperadas.has(chave)) falha(`${m.nome.pt}: medida repetida na declaração.`);
      const atraso = SERIES_ATRASADAS.find((a) => a.fonte === c.source && a.documento === c.document?.title && a.periodoDaCasa === c.reference_date && a.periodoDaFonte > c.reference_date);
      const [ano, mes] = (atraso?.periodoDaFonte ?? '').split('-');
      const nota = atraso ? `${t('pt').cartao.fonteJaPublicou} ${t('pt').cartao.meses[Number(mes) - 1]} de ${ano}; ${t('pt').cartao.lidoA} ${atraso.origem.lidoEm.split('-').reverse().join('.')}` : '';
      esperadas.set(chave, [m.nome.pt, medida.nome.pt, c.value, c.unit, periodo,
        c.source ?? (Array.isArray(c.derived_from) && c.derived_from.length ? 'Calculado' : ''), c.id, m.slug, nota].map((v) => String(v ?? '')));
    }
  }
  if (dados.length !== esperadas.size) falha(`${dados.length} linhas no ficheiro e ${esperadas.size} cartões com linha declarada.`);
  const vistas = new Set();
  for (const [n, registo] of dados.entries()) {
    if (registo.length !== COLUNAS.length) falha(`registo ${n + 1}: número de campos diferente do cabeçalho.`);
    const chave = JSON.stringify([registo[7], registo[1]]);
    if (vistas.has(chave)) falha(`registo ${n + 1}: concelho e medida repetidos.`);
    vistas.add(chave);
    const esperado = esperadas.get(chave);
    if (!esperado) { falha(`registo ${n + 1}: concelho e medida sem cartão declarado.`); continue; }
    for (const [i, campo] of COLUNAS.entries()) {
      if (registo[i] !== esperado[i]) falha(`registo ${n + 1} (${esperado[6]}): ${campo} difere da linha ou da declaração do cartão.`);
    }
  }
  for (const chave of esperadas.keys()) if (!vistas.has(chave)) falha(`falta o concelho e a medida ${chave}.`);
  return {
    erros, linhas: dados.length,
    concelhos: new Set(dados.map((r) => r[7])).size,
    medidas: new Set(dados.map((r) => r[1])).size,
    calculadas: dados.filter((r) => r[5] === 'Calculado').length,
  };
}
