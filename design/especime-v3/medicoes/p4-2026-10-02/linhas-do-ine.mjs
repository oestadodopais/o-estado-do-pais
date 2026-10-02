/** P4-c (02.10.2026, achado 4 da leitura a frio): as linhas do livro-razão cuja fonte é o INE (`www.ine.pt`), contadas
 * pelo caminho que a regra das casas decimais lhes dá, antes de mudar a regra. Diz quantas são derivadas, quantas não
 * têm excerto, quantas não são numéricas, quantas trazem a forma publicada («ind_string»), e, das que não a trazem,
 * quantas acabam no literal do número e quantas ficavam por ler, com os endereços (sem o domínio) e os identificadores.
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/p4-2026-10-02/linhas-do-ine.mjs
 * Sai 0 depois de contar; 1 se não conseguir ler o livro-razão. */
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { numeroDoValor, literalDoValor } from '../../../../scripts/casas-decimais.mjs';

const linhas = [...loadClaims().values()];
const doINE = linhas.filter((l) => { try { return new URL(String(l.source_url ?? '')).host === 'www.ine.pt'; } catch { return false; } });
const c = { linhas_do_livro: linhas.length, do_ine: doINE.length, derivadas: 0, sem_excerto: 0, nao_numericas: 0, com_a_forma_publicada: 0, sem_a_forma_publicada: 0, sem_a_forma_mas_com_o_literal_do_fim: 0, sem_a_forma_e_sem_literal: 0 };
const semForma = [];
for (const l of doINE) {
  if (l.derivation) { c.derivadas++; continue; }
  const excerto = String(l.excerpt ?? '');
  if (!excerto.trim() || excerto.includes('[a verificar]')) { c.sem_excerto++; continue; }
  if (!numeroDoValor(l.value)) { c.nao_numericas++; continue; }
  if (/"ind_string"\s*:/.test(excerto)) { c.com_a_forma_publicada++; continue; }
  c.sem_a_forma_publicada++;
  const fim = literalDoValor(excerto);
  if (fim) c.sem_a_forma_mas_com_o_literal_do_fim++; else c.sem_a_forma_e_sem_literal++;
  semForma.push({ id: l.id, caminho: new URL(l.source_url).pathname, literal_do_fim: fim?.literal ?? null, valor: l.value, inicio_do_excerto: excerto.slice(0, 90) });
}
console.log(JSON.stringify({ contas: c, sem_a_forma_publicada: semForma }, null, 2));
