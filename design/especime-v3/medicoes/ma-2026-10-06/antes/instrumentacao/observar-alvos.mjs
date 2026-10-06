/** Exporta as páginas já calculadas pelo guião original, sem mudar o ficheiro.
 * Uso: node --experimental-loader <este ficheiro> tests/acessibilidade/alvos.mjs
 * OEDP_OBSERVAR_GUIAO identifica o guião; OEDP_PAGINAS_ORIGINAIS, a saída.
 * A única adição ao módulo é a escrita final de primeira.paginas. O sha256
 * identifica os bytes originais, antes da adição, para a comparar com o Git.
 */
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const alvo = pathToFileURL(fs.realpathSync(process.env.OEDP_OBSERVAR_GUIAO)).href;

export async function load(url, contexto, proximo) {
  const resultado = await proximo(url, contexto);
  if (url !== alvo) return resultado;
  const fonte = Buffer.from(resultado.source).toString('utf8');
  const resumo = createHash('sha256').update(fonte).digest('hex');
  const observador = `\nfs.writeFileSync(process.env.OEDP_PAGINAS_ORIGINAIS,
    JSON.stringify({guiao: 'tests/acessibilidade/alvos.mjs', origem_sha256: '${resumo}',
      observacao: 'Só a escrita final de primeira.paginas foi acrescentada em memória.',
      paginas: primeira.paginas}, null, 2) + '\\n');\n`;
  return { ...resultado, source: fonte + observador };
}
