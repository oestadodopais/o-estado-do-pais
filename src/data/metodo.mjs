/**
 * O texto do Método.
 *
 * PT: cópia final da direção, transcrita do rascunho aprovado
 * (metodo-draft.md, v1). NÃO reescrever, NÃO apertar, NÃO acrescentar.
 * A nota de integração do topo do rascunho era instrução, não conteúdo, e por
 * isso não está aqui.
 *
 * EN: tradução fiel do mesmo texto — sem acrescentos e sem omissões.
 * AGUARDA REVISÃO DA DIREÇÃO. Os marcadores ficam em português, como na
 * origem, com uma glosa inglesa ao lado.
 *
 * Pedaços de texto:
 *   'palavras'                     — texto corrido
 *   { forte: '…' }                 — negrito
 *   { marcador: '…', gloss: '…' }  — marcador por resolver, em chip visível
 *   { ref: '2025' }                — ano de referência (passa pelo portão)
 *
 * Nenhum pedaço de texto corrido pode trazer algarismos: é o que obriga a que
 * o único número deste texto — o ano das autárquicas — passe pela porta certa.
 * A contagem de câmaras dessa frase fica deliberadamente por escrever, até
 * estar verificada.
 */

/** Os marcadores por resolver, num sítio só, para se poderem contar. */
export const MARCADORES = {
  // Menção à convenção da casa, dentro da descrição do método — não é um
  // item por resolver. Fica com o mesmo aspecto porque é literalmente o
  // mesmo marcador, e a frase à volta diz o que ele é.
  mencaoVerificar: {
    marcador: 'a verificar',
    gloss: 'to verify',
  },
  endereco: {
    marcador: 'endereço a confirmar',
    gloss: 'address to confirm',
  },
  autarquicas: {
    marcador: 'a verificar: número exato antes de publicar',
    gloss: 'to verify: exact number before publishing',
  },
};

const M = MARCADORES;

export const SECOES = [
  {
    id: 'quem-faz-isto',
    titulo: { pt: 'Quem faz isto', en: 'Who makes this' },
    blocos: {
      pt: [
        { tipo: 'p', partes: ['O Estado do País é escrito por inteligência artificial e dirigido por uma pessoa.'] },
        {
          tipo: 'p',
          partes: [
            'A direção é de ',
            { forte: 'Nuno dos Santos' },
            ', que escolhe os temas, define as regras deste método e responde, em última instância, pelo que aqui se publica. A escrita, a investigação e a verificação são feitas por modelos de inteligência artificial (Claude, da Anthropic), sob essa direção.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'Cada página declara esta autoria no rodapé. Não há exceções: se está publicado aqui, foi escrito por IA e revisto segundo este método.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'Dizemos isto no primeiro parágrafo porque é a pergunta certa a fazer a este site. A resposta que se segue — o livro-razão, as correções públicas, os limites declarados — existe para que a confiança não dependa de quem escreve, mas do que qualquer leitor pode verificar.',
          ],
        },
      ],
      en: [
        { tipo: 'p', partes: ['O Estado do País is written by artificial intelligence and directed by a person.'] },
        {
          tipo: 'p',
          partes: [
            'It is directed by ',
            { forte: 'Nuno dos Santos' },
            ', who chooses the subjects, sets the rules of this method and answers, ultimately, for what is published here. The writing, the research and the verification are done by artificial intelligence models (Claude, by Anthropic), under that direction.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'Every page declares this authorship in the footer. There are no exceptions: if it is published here, it was written by AI and reviewed according to this method.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'We say this in the first paragraph because it is the right question to ask of this site. The answer that follows — the ledger, the public corrections, the declared limits — exists so that trust does not depend on who writes, but on what any reader can verify.',
          ],
        },
      ],
    },
  },

  {
    id: 'como-se-escreve',
    titulo: { pt: 'Como se escreve', en: 'How it is written' },
    blocos: {
      pt: [
        {
          tipo: 'p',
          partes: [
            'Um estudo começa com uma pergunta — da direção, ou proposta pela própria IA e aprovada pela direção. A partir daí:',
          ],
        },
        {
          tipo: 'ol',
          itens: [
            [
              { forte: 'Investigação em fontes primárias.' },
              ' Institutos de estatística, publicações oficiais, documentos originais. Um resumo de imprensa nunca é a fonte.',
            ],
            [
              { forte: 'Escrita sobre o livro-razão.' },
              ' O texto não contém números escritos à mão: cada valor é resolvido a partir de uma linha do livro-razão no momento da construção da página. Um número sem linha não é publicado — fica marcado ',
              M.mencaoVerificar,
              ', ou é cortado.',
            ],
            [
              { forte: 'Verificação por quem não escreveu.' },
              ' As afirmações centrais são verificadas por agentes que não participaram na escrita, instruídos para as refutar. As afirmações de destaque passam por rederivação cega: outro agente refaz o cálculo sem ver o texto.',
            ],
            [{ forte: 'Revisão da direção' }, ' antes de qualquer publicação.'],
          ],
        },
        {
          tipo: 'p',
          partes: [
            'O que não sobrevive a este processo não é suavizado — é removido, ou publicado como incerteza declarada.',
          ],
        },
      ],
      en: [
        {
          tipo: 'p',
          partes: [
            'A study begins with a question — from the director, or proposed by the AI itself and approved by the director. From there:',
          ],
        },
        {
          tipo: 'ol',
          itens: [
            [
              { forte: 'Research in primary sources.' },
              ' Statistical institutes, official publications, original documents. A press summary is never the source.',
            ],
            [
              { forte: 'Writing on top of the ledger.' },
              ' The text contains no hand-written numbers: each value is resolved from a ledger row at the moment the page is built. A number without a row is not published — it is flagged ',
              M.mencaoVerificar,
              ', or it is cut.',
            ],
            [
              { forte: 'Verification by someone who did not write it.' },
              ' Central claims are verified by agents that took no part in the writing, instructed to refute them. Headline claims go through blind re-derivation: another agent redoes the calculation without seeing the text.',
            ],
            [{ forte: 'Review by the director' }, ' before any publication.'],
          ],
        },
        {
          tipo: 'p',
          partes: [
            'What does not survive this process is not softened — it is removed, or published as declared uncertainty.',
          ],
        },
      ],
    },
  },

  {
    id: 'livro-razao',
    titulo: { pt: 'O livro-razão', en: 'The ledger' },
    blocos: {
      pt: [
        {
          tipo: 'p',
          partes: [
            'Todos os números deste site rastreiam até uma linha de um livro-razão de afirmações. Cada linha guarda: o valor exato tal como publicado pela fonte; a entidade que o produziu; o documento e a edição; o endereço; a data de acesso; um excerto textual da fonte; e, quando o valor é calculado por nós, a derivação completa.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'O selo de proveniência junto a cada número é a porta para essa linha. A construção do site falha — deliberadamente — se uma página tentar publicar um número sem linha correspondente.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'Os dados por trás de cada gráfico são descarregáveis. Se citamos, mostramos; se calculámos, mostramos como.',
          ],
        },
      ],
      en: [
        {
          tipo: 'p',
          partes: [
            'Every number on this site traces back to a row of a ledger of claims. Each row holds: the exact value as published by the source; the entity that produced it; the document and the edition; the URL; the access date; a textual excerpt from the source; and, when the value is calculated by us, the full derivation.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'The provenance seal beside each number is the door to that row. The site build fails — deliberately — if a page tries to publish a number without a corresponding row.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'The data behind each graphic is downloadable. If we cite, we show; if we calculated, we show how.',
          ],
        },
      ],
    },
  },

  {
    id: 'correcoes',
    titulo: { pt: 'Correções', en: 'Corrections' },
    registoDeCorrecoes: true,
    blocos: {
      pt: [
        {
          tipo: 'p',
          partes: [
            'Corrigir em silêncio é a forma mais barata de mentir. Aqui, toda a correção é pública, datada e permanente: valor anterior, valor corrigido, motivo, e ligação à linha do livro-razão que mudou. O registo de correções desta página lista todas, da mais recente à primeira, e nenhuma é removida.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'Quem encontrar um erro pode escrevê-lo a ',
            M.endereco,
            '. Um erro confirmado entra no registo com crédito a quem o encontrou, se o desejar.',
          ],
        },
      ],
      en: [
        {
          tipo: 'p',
          partes: [
            'Correcting in silence is the cheapest way of lying. Here, every correction is public, dated and permanent: previous value, corrected value, reason, and a link to the ledger row that changed. This page’s corrections log lists them all, from the most recent to the first, and none is removed.',
          ],
        },
        {
          tipo: 'p',
          partes: [
            'Anyone who finds an error can report it to ',
            M.endereco,
            '. A confirmed error enters the log with credit to whoever found it, if they wish.',
          ],
        },
      ],
    },
  },

  {
    id: 'atribuicao-causal',
    titulo: { pt: 'Atribuição causal', en: 'Causal attribution' },
    blocos: {
      pt: [
        {
          tipo: 'p',
          partes: [
            'A parte mais delicada deste observatório é ligar resultados a quem governa. A regra é prestação de contas de gestão, não atribuição de mérito:',
          ],
        },
        {
          tipo: 'ul',
          itens: [
            [
              { forte: 'Herdado, decidido, deixado.' },
              ' Cada mandato é lido pelo que recebeu, pelo que decidiu, e pelo estado em que entregou — nunca por um número único de mérito.',
            ],
            [
              { forte: 'Métricas anunciadas antes dos veredictos.' },
              ' Os indicadores usados para ler um mandato são publicados antes da leitura, não escolhidos depois.',
            ],
            [
              { forte: 'Confundidores declarados.' },
              ' Grande parte do que acontece num concelho decide-se fora dele — em Lisboa, em Bruxelas, na demografia, no ciclo económico. E há mecânica institucional que quebra leituras ingénuas: nas autárquicas de ',
              { ref: '2025' },
              ', uma parte substancial das câmaras mudou de presidente por limitação de mandatos, não por voto ',
              M.autarquicas,
              '. Estes limites são declarados junto de cada leitura.',
            ],
            [
              { forte: 'Sem rankings de partidos.' },
              ' Médias por partido sem controlo do território que cada partido governa são aritmética enganosa. Não as publicamos.',
            ],
            [
              { forte: 'Inferência assinada.' },
              ' Onde este site conclui além dos dados, a conclusão é marcada como inferência e assinada como tal.',
            ],
          ],
        },
      ],
      en: [
        {
          tipo: 'p',
          partes: [
            'The most delicate part of this observatory is linking outcomes to those who govern. The rule is management accountability, not attribution of merit:',
          ],
        },
        {
          tipo: 'ul',
          itens: [
            [
              { forte: 'Inherited, decided, left.' },
              ' Each term is read by what it inherited, by what it decided, and by the state in which it handed over — never by a single number of merit.',
            ],
            [
              { forte: 'Metrics announced before verdicts.' },
              ' The indicators used to read a term are published before the reading, not chosen afterwards.',
            ],
            [
              { forte: 'Confounders declared.' },
              ' Much of what happens in a municipality is decided outside it — in Lisbon, in Brussels, in demography, in the economic cycle. And there is institutional machinery that breaks naive readings: in the ',
              { ref: '2025' },
              ' local elections, a substantial share of councils changed president through term limits, not through the vote ',
              M.autarquicas,
              '. These limits are declared alongside each reading.',
            ],
            [
              { forte: 'No party rankings.' },
              ' Averages by party without controlling for the territory each party governs are misleading arithmetic. We do not publish them.',
            ],
            [
              { forte: 'Signed inference.' },
              ' Where this site concludes beyond the data, the conclusion is marked as inference and signed as such.',
            ],
          ],
        },
      ],
    },
  },

  {
    id: 'limites',
    titulo: { pt: 'Limites', en: 'Limits' },
    blocos: {
      pt: [
        {
          tipo: 'ul',
          itens: [
            [
              'Este site não sabe o que as fontes não medem. Onde os dados não existem, dizemos que não existem — uma resposta nula é uma resposta.',
            ],
            [
              'A IA que escreve isto pode errar de formas próprias: inventar com fluência é o risco central, e é exatamente por isso que o livro-razão, a verificação adversarial e as correções públicas não são opcionais.',
            ],
            [
              'Os dados oficiais chegam com atraso e são revistos. A data de acesso em cada selo diz quando lemos; se a fonte mudou depois, a discrepância trata-se como correção, não como argumento.',
            ],
            [
              'Independência: este site não recebe financiamento de partidos, governos ou câmaras municipais. É financiado pessoalmente pelo diretor, e não tem publicidade nem financiamento externo.',
            ],
          ],
        },
      ],
      en: [
        {
          tipo: 'ul',
          itens: [
            [
              'This site does not know what the sources do not measure. Where the data does not exist, we say it does not exist — a null answer is an answer.',
            ],
            [
              'The AI that writes this can err in ways of its own: inventing fluently is the central risk, and that is exactly why the ledger, adversarial verification and public corrections are not optional.',
            ],
            [
              'Official data arrives late and is revised. The access date on each seal says when we read it; if the source changed afterwards, the discrepancy is treated as a correction, not as an argument.',
            ],
            [
              'Independence: this site receives no funding from parties, governments or municipal councils. It is funded personally by the director, and has no advertising and no external funding.',
            ],
          ],
        },
      ],
    },
  },
];
