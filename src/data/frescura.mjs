/**
 * ===========================================================================
 * AS SÉRIES ATRASADAS: o que a fonte já publicou e o que a casa ainda publica
 * ===========================================================================
 *
 * Bloco F1.6 (04.09.2026), decisão (2) da `DECISIONS.md` §1.98: «o IEFP rende o
 * atraso em vez de publicar 2026-07 por conferir». Uma série mensal cujo último
 * ficheiro da fonte é mais recente do que o período que a casa publica está
 * atrasada, e o sítio tem de o dizer na página de cada linha dessa série, em vez
 * de mostrar um selo conferido ao lado de um valor de há oito meses.
 *
 * ---------------------------------------------------------------------------
 * PORQUE É UM FICHEIRO DE DADOS E NÃO UMA FRASE NO GABARITO
 * ---------------------------------------------------------------------------
 * O período da fonte é um facto que muda todos os meses. Escrito num gabarito
 * fica errado no dia seguinte e ninguém dá por isso; escrito aqui, com a origem
 * ao lado, muda num sítio só e o `npm run check:formas` reconfere-o contra o
 * ficheiro de onde ele foi lido. Nenhum dos três valores de uma frase de atraso
 * é escrito à mão no gabarito:
 *
 *   · o período da FONTE   vem daqui, e daqui vem com a origem;
 *   · o período da CASA    vem do `reference_date` da própria linha;
 *   · a data do «desde»    vem do `access_date` da própria linha.
 *
 * ---------------------------------------------------------------------------
 * DE ONDE VEM O PERÍODO DA FONTE, E COMO SE CONFERE
 * ---------------------------------------------------------------------------
 * Não é uma leitura desta sessão: nenhum pedido saiu deste portátil para o
 * IEFP. Vem do inventário das fontes deste repositório,
 * `design/observatorio/inventario/INVENTARIO-DAS-FONTES.json`, linha `T2`, campo
 * `ultimo_periodo`, escrito por quem leu a fonte a 2026-09-01 (o campo `acesso`
 * da mesma linha: «2026-09-01T08:17:26Z (página); 08:18:20Z (ficheiro)»).
 *
 * O `check:formas` lê aquele ficheiro por conta própria, tira o período do que a
 * folha da fonte imprime («Ano Mês: 202607», copiado no campo `ultimo_periodo`)
 * e compara-o com o que está escrito aqui. São duas contas do mesmo facto,
 * feitas de sítios diferentes, como no `data-prova` e no `data-da-linha`: este
 * ficheiro não é uma dispensa, é uma cópia conferida.
 *
 * ---------------------------------------------------------------------------
 * QUE LINHAS UMA SÉRIE APANHA
 * ---------------------------------------------------------------------------
 * Por regra e nunca por lista escrita à mão: uma linha pertence à série quando
 * os três campos batem certo, `source`, `document.title` e `reference_date`. É o
 * que faz com que as 278 do continente entrem e mais nada entre: as trinta das
 * ilhas têm outra `source` (a DRQPE dos Açores e o IEM da Madeira, que publicam
 * os seus próprios ficheiros e não este), e as duas linhas de dezembro de 2013 e
 * de 2024 do estudo de Évora têm outro `reference_date`: são pontos históricos
 * de uma série, e um valor de 2013 não está atrasado por 2026 existir.
 *
 * ---------------------------------------------------------------------------
 * O DIA EM QUE O ATRASO ACABAR
 * ---------------------------------------------------------------------------
 * A entrada sai daqui, o contador do cabeçalho vai a zero e as páginas das
 * linhas deixam de render a frase, sem que nada mais mude. Uma série que não
 * esteja atrasada não tem entrada: a página não desenha um estado que não
 * existe, que é a mesma regra de `src/data/fontes.mjs`.
 */

/**
 * As séries que a casa publica atrás da fonte.
 *
 * @type {SerieAtrasada[]}
 */
export const SERIES_ATRASADAS = [
  {
    id: 'iefp-desemprego-registado-concelhos',
    fonte: 'Instituto do Emprego e Formação Profissional (IEFP)',
    documento: 'SIE - Desemprego registado por concelhos',
    periodoDaCasa: '2025-12',
    periodoDaFonte: '2026-07',
    origem: {
      ficheiro: 'design/observatorio/inventario/INVENTARIO-DAS-FONTES.json',
      registo: 'T2',
      campo: 'ultimo_periodo',
      lidoEm: '2026-09-01',
      url: 'https://www.iefp.pt/documents/10181/13482465/SIE+-+Desemprego+registado+por+concelhos+julho+2026.ods/e806f32b-342d-46cd-a23e-38e482f01d59',
    },
  },
];

/**
 * O guarda da forma, para dados que vêm de um ficheiro e não de um tipo.
 *
 * Um tipo descreve o que a casa espera; quem o aplica é um guarda de execução
 * (ver o cabeçalho de `src/tipos.d.ts`). Este é o desta forma, e o
 * `scripts/provar-guardas.mjs` experimenta-o com um caso que tem de passar e
 * outro que tem de ser recusado.
 *
 * @param {unknown} x
 * @returns {x is SerieAtrasada}
 */
export function eSerieAtrasada(x) {
  if (typeof x !== 'object' || x === null || Array.isArray(x)) return false;
  const s = /** @type {Record<string, unknown>} */ (x);
  /** @param {unknown} v */
  const texto = (v) => typeof v === 'string' && v.trim() !== '';
  if (!texto(s.id) || !texto(s.fonte) || !texto(s.documento)) return false;
  if (typeof s.periodoDaCasa !== 'string' || !/^\d{4}-\d{2}$/.test(s.periodoDaCasa)) return false;
  if (typeof s.periodoDaFonte !== 'string' || !/^\d{4}-\d{2}$/.test(s.periodoDaFonte)) return false;
  const o = s.origem;
  if (typeof o !== 'object' || o === null || Array.isArray(o)) return false;
  const org = /** @type {Record<string, unknown>} */ (o);
  return (
    texto(org.ficheiro) &&
    texto(org.registo) &&
    texto(org.campo) &&
    typeof org.lidoEm === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(org.lidoEm) &&
    texto(org.url)
  );
}
