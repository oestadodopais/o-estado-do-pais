/** C2 (05.10.2026): as leituras dos cartões que usam as nove linhas relidas, resolvidas pelo resolvedor das páginas.
 *
 * Para cada cartão com leitura declarada cuja linha própria, a do período anterior ou a da União (as que a régua do
 * cartão cita, `reguaDoCartao()`) é uma das nove linhas do brief C2, escreve o texto rendido nas duas edições
 * (`textoDaLeitura()`, o que a K17 compara com o `dist/`), os ramos escolhidos e porquê, as linhas citadas, os valores
 * da régua e o estado contra o valor de referência declarado. Corre-se uma vez antes das releituras (`antes`) e outra
 * depois (`depois`), e a comparação dos dois ficheiros diz que ramo mudou de sentido e que frase mudou.
 *
 * Lê o livro-razão da árvore de trabalho, pela mesma função das páginas; não escreve nada fora desta pasta.
 *
 * uso (da raiz do sítio): node design/especime-v3/medicoes/c2-2026-10-05/leituras-c2.mjs antes|depois
 *                         node design/especime-v3/medicoes/c2-2026-10-05/leituras-c2.mjs comparar
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { getClaim } from '../../../../src/lib/ledger.mjs';
import { leituraDaMedida, medidasComLeitura, textoDaLeitura } from '../../../../src/lib/leitura-da-medida.mjs';
import { reguaDoCartao } from '../../../../src/lib/enquadramento.mjs';

const PASTA = 'design/especime-v3/medicoes/c2-2026-10-05';
const NOVE = [
  'custo-unitario-do-trabalho-2024', 'despesa-em-id-2024-ue', 'formacao-bruta-de-capital-fixo-2024',
  'formacao-bruta-de-capital-fixo-2025', 'pib-real-per-capita-2024', 'pib-real-per-capita-2025',
  'posicao-de-investimento-internacional-2024', 'posicao-de-investimento-internacional-2025',
  'saldo-da-balanca-corrente-2024',
];
const modo = process.argv[2];

if (modo === 'antes' || modo === 'depois') {
  const cartoes = [];
  let lidas = 0;
  for (const id of medidasComLeitura()) {
    if (id === 'camaras') continue;
    lidas += 1;
    const regua = reguaDoCartao(id);
    const tocadas = [id, regua.anterior?.id, regua.ue?.id].filter((x) => x && NOVE.includes(x));
    if (!tocadas.length) continue;
    const edicoes = {};
    for (const lang of ['pt', 'en']) {
      const { pedacos, ramos, citadas } = leituraDaMedida(id, lang);
      edicoes[lang] = { texto: textoDaLeitura(pedacos, lang), ramos, citadas };
    }
    cartoes.push({
      id,
      linhas_das_nove_que_toca: tocadas,
      valores: {
        proprio: getClaim(id).value,
        anterior: regua.anterior ? { id: regua.anterior.id, valor: getClaim(regua.anterior.id).value } : null,
        ue: regua.ue ? { id: regua.ue.id, valor: getClaim(regua.ue.id).value } : null,
      },
      edicoes,
    });
  }
  const cabeca = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const estado = execSync('git status --short ledger/claims', { encoding: 'utf8' }).trim();
  const saida = {
    _: 'Escrito por design/especime-v3/medicoes/c2-2026-10-05/leituras-c2.mjs. Não se edita à mão.',
    modo, cabeca, linhas_do_livro_mudadas_na_arvore: estado ? estado.split('\n').length : 0,
    leituras_lidas: lidas, cartoes_que_usam_as_nove: cartoes.length,
    conhecido_positivo: {
      o_que: 'o cartão do PIB real por habitante, cuja linha própria é uma das nove, está entre os cartões achados',
      encontrado: cartoes.some((c) => c.id === 'pib-real-per-capita-2025'),
    },
    cartoes,
  };
  fs.writeFileSync(`${PASTA}/leituras-${modo}.json`, JSON.stringify(saida, null, 2) + '\n');
  console.log(`${modo}: ${cartoes.length} cartões com leitura usam as nove linhas (de ${lidas} leituras lidas)`);
} else if (modo === 'comparar') {
  const a = JSON.parse(fs.readFileSync(`${PASTA}/leituras-antes.json`, 'utf8'));
  const d = JSON.parse(fs.readFileSync(`${PASTA}/leituras-depois.json`, 'utf8'));
  /** A comparação de duas corridas, cartão a cartão, edição a edição, ramo a ramo. */
  const comparar = (x, y) => {
    const porId = (z) => new Map(z.cartoes.map((c) => [c.id, c]));
    const A = porId(x), D = porId(y);
    const linhas = [];
    for (const id of new Set([...A.keys(), ...D.keys()])) {
      const ca = A.get(id), cd = D.get(id);
      for (const lang of ['pt', 'en']) {
        const ra = ca?.edicoes[lang]?.ramos ?? [], rd = cd?.edicoes[lang]?.ramos ?? [];
        const ramos = [];
        for (let i = 0; i < Math.max(ra.length, rd.length); i++) {
          const um = ra[i] ?? rd[i];
          ramos.push({ no: um.no, caminho: um.caminho, antes: ra[i]?.escolha ?? null, depois: rd[i]?.escolha ?? null,
            mudou: (ra[i]?.escolha ?? null) !== (rd[i]?.escolha ?? null) || ra[i]?.caminho !== rd[i]?.caminho,
            porque_antes: ra[i]?.porque ?? null, porque_depois: rd[i]?.porque ?? null });
        }
        linhas.push({ id, lang, texto_antes: ca?.edicoes[lang]?.texto ?? null, texto_depois: cd?.edicoes[lang]?.texto ?? null,
          texto_mudou: (ca?.edicoes[lang]?.texto ?? null) !== (cd?.edicoes[lang]?.texto ?? null),
          valores_mudaram: JSON.stringify(ca?.valores ?? null) !== JSON.stringify(cd?.valores ?? null),
          ramos, ramos_que_mudaram_de_sentido: ramos.filter((r) => r.mudou).length,
          valores_antes: ca?.valores ?? null, valores_depois: cd?.valores ?? null });
      }
    }
    return linhas;
  };
  const linhas = comparar(a, d);
  /* O CONHECIDO-POSITIVO DO COMPARADOR: a corrida de antes contra uma cópia dela com um só ramo trocado (o da
     comparação do PIB real por habitante com o período anterior, na edição portuguesa) tem de dar exatamente um ramo
     mudado; sem isto, um zero de ramos mudados não provava que o comparador os vê. */
  const plantada = structuredClone(a);
  const alvo = plantada.cartoes.find((c) => c.id === 'pib-real-per-capita-2025')?.edicoes.pt.ramos.find((r) => r.no === 'compara-anterior');
  if (alvo) alvo.escolha = alvo.escolha === 'maior' ? 'menor' : 'maior';
  const naPlanta = comparar(a, plantada).reduce((n, l) => n + l.ramos_que_mudaram_de_sentido, 0);
  const saida = {
    _: 'Escrito por design/especime-v3/medicoes/c2-2026-10-05/leituras-c2.mjs comparar. Não se edita à mão.',
    cabeca_antes: a.cabeca, cabeca_depois: d.cabeca,
    linhas_do_livro_mudadas_antes: a.linhas_do_livro_mudadas_na_arvore, linhas_do_livro_mudadas_depois: d.linhas_do_livro_mudadas_na_arvore,
    cartoes: new Set(linhas.map((l) => l.id)).size,
    leituras_comparadas: linhas.length,
    leituras_com_texto_mudado: linhas.filter((l) => l.texto_mudou).length,
    leituras_com_valores_da_regua_mudados: linhas.filter((l) => l.valores_mudaram).length,
    ramos_lidos: linhas.reduce((n, l) => n + l.ramos.length, 0),
    ramos_que_mudaram_de_sentido: linhas.reduce((n, l) => n + l.ramos_que_mudaram_de_sentido, 0),
    conhecido_positivo: {
      o_que: 'o mesmo comparador, sobre a corrida de antes contra uma cópia com um ramo trocado, vê exatamente um ramo mudado; e vê os valores da régua do PIB real por habitante mudados',
      encontrado: naPlanta === 1 && linhas.some((l) => l.id === 'pib-real-per-capita-2025' && l.valores_mudaram),
      ramos_vistos_na_planta: naPlanta,
    },
    leituras: linhas,
  };
  fs.writeFileSync(`${PASTA}/leituras-comparadas.json`, JSON.stringify(saida, null, 2) + '\n');
  console.log(`comparar: ${saida.leituras_comparadas} leituras, ${saida.leituras_com_texto_mudado} com texto mudado, ` +
    `${saida.leituras_com_valores_da_regua_mudados} com valores da régua mudados, ` +
    `${saida.ramos_que_mudaram_de_sentido} ramo(s) de ${saida.ramos_lidos} mudaram de sentido; planta: ${naPlanta}`);
} else {
  throw new Error('uso: leituras-c2.mjs antes|depois|comparar');
}
