/** RP4-n-d: a coluna é fonte apenas quando foi lida no corpo Excel selado. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const corpo = fs.readFileSync(new URL('../../src/data/computacoes-rp4n.json', import.meta.url));
const registo = JSON.parse(fs.readFileSync(new URL('../../ledger/cruzamentos/computacoes-rp4n.json', import.meta.url), 'utf8')).files['computacoes-rp4n.json'];
export const COMPUTACOES_RP4N = JSON.parse(corpo.toString());
const seloValido = createHash('sha256').update(corpo).digest('hex') === registo.exported_sha256 && registo.exported_sha256 === registo.origin_sha256;
/** @param {any} linha @returns {string|null} */
export function conferirComputacaoPRR(linha) {
  if (!seloValido) return 'a prova dos Excel difere do resumo da travessia';
  const co = linha?.document?.computed_over, r = COMPUTACOES_RP4N.resultados[linha?.id];
  if (!r || !co?.files?.length) return 'a seleção calculada não tem prova nos Excel selados';
  for (const f of co.files) {
    const p = Object.values(COMPUTACOES_RP4N.ficheiros).find((/** @type {any} */ x) => x.file === f.file);
    if (!p || ['sha256', 'bytes', 'snapshot_date'].some(k => f[k] !== p[k])) return 'a seleção calculada não tem ficheiros selados iguais aos Excel lidos';
  }
  const tipos = linha.id.includes('vencido') ? ['entidades', 'projetos'] : ['entidades'];
  if (tipos.some(t => !co.files.some(f => f.file === COMPUTACOES_RP4N.ficheiros[t].file))) return 'a seleção calculada perdeu um Excel necessário';
  if (co.column !== r.column || !COMPUTACOES_RP4N.ficheiros.entidades.headers.includes(co.column)) return 'a coluna calculada não está no cabeçalho selado';
  const selecao = 'papel_entidade ∈ {Beneficiário Intermediário, Beneficiário Direto} · localizacao_sede = Évora' + (linha.id.includes('vencido') ? ' · dt_prevista_conclusao anterior à data do instantâneo · dt_efetiva_conclusao vazia' : '');
  if (co.filter !== selecao) return 'a seleção da casa difere da conta refeita nos Excel';
  const valor = String(linha.value).replace(/[\s\u202f\u00a0]/g, '').replace(',', '.');
  if (Number(valor) !== Number(r.value)) return 'o valor difere da soma conferida nos Excel selados';
  return null;
}
/** @param {any} apoio @param {any} linha @returns {string|null} */
export function conferirLiteralPRR(apoio, linha) {
  const erro = conferirComputacaoPRR(linha); if (erro) return erro;
  const f = COMPUTACOES_RP4N.ficheiros[apoio.ficheiro];
  if (!f || !linha.document.computed_over.files.some(x => x.file === f.file)) return 'o apoio cita um Excel que a linha não usa';
  const valores = apoio.campo === 'cabecalho' ? f.headers : COMPUTACOES_RP4N.literais[apoio.ficheiro]?.[apoio.campo];
  return Array.isArray(valores) && valores.includes(apoio.literal) ? null : 'o literal não foi lido no cabeçalho ou nas células do Excel selado';
}
