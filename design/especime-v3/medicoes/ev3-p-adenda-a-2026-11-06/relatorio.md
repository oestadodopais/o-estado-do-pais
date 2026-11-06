# EV3-p, adenda A: datas e inventário corrigidos; fecho bloqueado pela FP3

As portas usam o mesmo componente PortaDaEdicao.astro. As datas vêm do histórico e levam time com datetime e data-nonledger="data-do-repositorio". Nenhuma régua foi alterada.

O inventário contém a entrada inteira tal como a voz a extrai, os rótulos e as faixas. As frases do documento estão na tabela de transcrições autorizadas com estado viva, segundo a forma já existente no inventário. O corpo documental não integra as rotas percorridas pelo inventário geral. As declarações da atualização anterior sem superfície foram retiradas com motivo. A leitura cruzada do bloco fica por ler no registo de revisões.

## Resultados

- build completo: 1, duas tentativas.
- gate:html: 0 nas duas tentativas do build, que prosseguiram para check:edicoes e check:datas.
- check:edicoes: 0 na corrida isolada e no build final.
- check:voz final sobre o dist estável: 1.
- typecheck: 0.
- Medição final do dist: 0; duas línguas, oito portas, frases e entradas iguais às aprovadas, arquivos com os mesmos hashes, contagem de 46.

A primeira corrida de voz encontrou declarações sem superfície e falta da entrada de revisão; isso foi corrigido. A segunda coincidiu com a reconstrução e falhou com ENOENT em dist/livro-razao/vouzela-divida-dgal-2024/index.html. Foi repetida sobre o dist estável; o código acima é o dessa repetição.

## Motivo da paragem do §2

O build chegou a tests/inicio/novidades.mjs:184 e recusou «FP3: falta a atualização na caixa». A prova exige pelo menos uma atualização real nas novidades e as três plantas seguintes usam essa entrada para adulterar data, origem e tipo. A edição atual de Évora passou a correção e já não fornece essa atualização.

A tentativa de adaptar os dados de ensaio não preservou as três plantas, que falharam por ausência do elemento. Foi integralmente revertida: tests/inicio/novidades.mjs permanece idêntico ao commit de entrada. Não foi removida nenhuma asserção, nem introduzida uma exceção. O build não está verde. Não houve commit do sítio nem publicação. É necessário resolver a prova FP3 com uma atualização de ensaio completa e válida, preservando as três plantas, antes de fechar esta passagem.

O motor permanece em 983b19eee29d4653730a62e9ee1d9674345db308, sem alterações desta adenda.

## Texto copiado do dist final

### pt

Frase: Na nota em que anunciou a abertura do concurso da requalificação, a Câmara escreveu que a obra era «apoiada por financiamento do Plano de Recuperação e Resiliência»; a nota de outubro só fala do Fundo Ambiental, e nenhuma das duas menciona o financiamento que a outra nomeia.

Entrada (Estudo corrigido): A frase sobre o dinheiro do Rossio de São Brás contava dois financiamentos que nenhum documento conta; passou a dizer só o que cada nota da Câmara nomeia.

### en

Frase: In the notice announcing the tender for the works, the Câmara wrote that they were supported by Recovery and Resilience Plan funding («apoiada por financiamento do Plano de Recuperação e Resiliência»); the October notice names only the Fundo Ambiental, and neither mentions the funding the other names.

Entrada (Study corrected): The sentence on the Rossio de São Brás funding counted two financings that no document counts; it now says only what each of the Câmara's notes names.

## Orçamento

30 chamadas de ferramentas de orquestração. Doze execuções por curto.sh: duas tentativas de build, oito conferências (duas de edições, três de voz, duas de novidades e typecheck) e duas medições do dist. Zero corridas completas dos portões e zero capturas. Não foi exposta uma linha «tokens used».
