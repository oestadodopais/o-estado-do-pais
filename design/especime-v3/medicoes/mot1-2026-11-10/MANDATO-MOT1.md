# Mandato MOT1, primeira passagem: os estudos compostos de Évora passam a ter o seu próprio texto (10.11.2026)

Acrescenta: nada
Medidas: medidas-mot1.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), na worktree do motor `mot1-2026-11-10`, a partir de `master` em b4d0bbe; a worktree do sítio com o mesmo nome leva só este mandato e os registos. Esta passagem faz a ferramenta e prova-a no estudo 16; a segunda (uma adenda) leva-a aos estudos 17, 18 e 19 e acrescenta as linhas próprias.*

## Porquê

Os quatro estudos de Évora das pastas 16 a 19 compõem-se, bloco a bloco, dos registos de seis estudos anteriores (as pastas 04, 06, 07, 08, 09 e 14), com emendas declaradas uma a uma. Serviu para os fazer nascer sem os reescrever. Hoje custa mais do que protege: corrigir uma frase de um estudo composto obriga a mudar o estudo de origem (o gabarito, o livro, o ficheiro da voz), a recompor, e a reparar as emendas dos outros estudos que citavam o texto antigo. A auditoria do estudo 16 deixou 72 frases por corrigir e 11 números novos, e a medição mostrou que esse caminho atravessa quatro camadas.

A decisão do lugar de direção: os seis estudos anteriores deixam de ser publicados no sítio e ficam no motor como estão, parados; os quatro estudos vivos passam a ter cada um o seu texto, escrito no seu gabarito, e deixam de copiar blocos. Uma correção passa a ser uma edição de texto num só ficheiro por língua.

## §0 Medido (10.11.2026, por este lugar)

Com `python3 -B design/especime-v3/medicoes/mot1-2026-11-10/medir-mot1.py <motor>` sobre o motor em b4d0bbe (a saída em `medidas-mot1.txt`, nesta pasta):

- Os quatro estudos compostos têm sete gabaritos (o 16, o 18 e o 19 nas duas línguas; o 17 só em português), com 285 diretivas `@@bloco`, 169 emendas, 76 diretivas `@@sai` e 191 marcadores na prosa própria.
- Recompostos hoje em memória, seis dos sete dão o `.md` publicado letra por letra. O do 17 difere em duas frases: o publicado ainda escreve «\[a verificar\]» onde a fonte, desde a COR-AGUA, escreve «está por confirmar na fonte». O estudo 17 não foi recomposto depois dessa mudança.
- Lido em `core/compor.py`: na prosa própria um número só entra por um marcador que resolve na forma impressa de uma linha no registo da fonte, e um algarismo escrito à mão recusa a composição, salvo um ano ou uma data ISO; uma linha local só existe como derivação, com componentes e conta (`@@derivadas`). Um bloco copiado traz do registo da fonte algarismos que não são linhas do livro (páginas, artigos, ordinais), e esses hoje não passam pela regra da prosa própria.

## §1 O que fazes

1. **Antes de mudar nada,** corre a medição acima na tua worktree e confere que dá os mesmos sete resultados. Se não der, páras (§2).

2. **A ferramenta que aplana.** Um módulo do motor (`python3 -m core.aplanar "<pasta do estudo>" [--escrever]`, ou o nome que servir) que reescreve cada gabarito da pasta sem diretivas `@@bloco`, sem emendas e sem `@@sai`: cada bloco copiado passa a ser prosa do próprio gabarito, com o texto que a composição hoje produz para ele (depois das emendas), e cada número dessa prosa escrito pelo marcador da linha que as decisões de figura lhe dão hoje. Ficam as diretivas `@@edicao`, `@@fonte` (os marcadores continuam a resolver nos registos e nos livros das fontes, que não mudam), `@@derivadas` e os comentários.
   - **Os algarismos que não são linhas.** Decide a forma mais estreita de os escrever na prosa aplanada sem abrir a porta a números escritos à mão: só passa um algarismo que o registo da fonte já trazia, nesse bloco, como não figura (ou que a lista `ignore` do livro cobre). Uma forma que deixasse passar um número novo sem linha era o defeito que a regra existe para impedir: prova com plantas que não deixa (um valor do livro escrito à mão recusa; um algarismo novo sem linha recusa; uma página que o bloco já trazia passa).
   - **As listas do livro** (`assertions`, `assertion_ignores`, `ignore`, `entity_aliases`, `adjacency_ignores`) continuam a vir das fontes pelo que o texto imprime, como hoje.
   - Sem `--escrever` é um ensaio: diz o que mudaria e se a recomposição daria os mesmos bytes, e não escreve.

3. **A prova, no estudo 16.** Aplana os dois gabaritos de `content/16 Évora Contas da Câmara`. A aceitação, toda ela por guião:
   - `python3 -m core.compor "content/16 Évora Contas da Câmara" --escrever` escreve os dois `.md`, o `ledger.json`, o `origem-das-linhas.json` e as decisões de figura das duas línguas iguais byte a byte aos de hoje;
   - o `make_html.py` do estudo escreve os dois `.html` iguais;
   - `python3 publisher/export_records.py --write` deixa os registos, os cortes e o `records.manifest.json` iguais.
   - No fim, `git status --short` mostra só os dois gabaritos do 16 e os ficheiros novos da ferramenta e dos seus testes. Se um ficheiro gerado tiver de mudar de forma (por exemplo a proveniência de uma linha), diz qual, porquê, e mostra que o registo de conteúdo exportado não muda.
   - Guarda os dois gabaritos de antes ao lado dos novos, com outro nome (`documento.<l>.composto.md.tmpl`), como história: nada os lê para compor. Se o mapa de migração (`--mapa`) ou alguma régua lia as diretivas `@@sai`, diz qual e deixa-a a ler esses ficheiros guardados.

4. **Os testes.** Um teste da ferramenta com as plantas do ponto 2 e com a prova do ponto 3 (aplanar uma cópia do 16 e comparar os bytes), no sítio onde vivem os testes do compositor. Os testes que já existem do compositor e do exportador continuam verdes: `core/compor_test.py`, `core/compor_livros_test.py`, `publisher/ev2_test.py`, `publisher/export_records_test.py`.

5. **O que não tocas.** As pastas 04 a 14 (as fontes: nem o texto, nem o livro, nem o ficheiro da voz); os estudos 17, 18 e 19 (a segunda passagem); `indicators/`, `sweeps/`, `.maintenance-locks/`, `publisher/recortes/manifest.regioes.json`; o sítio, salvo o relatório.

6. **O fecho.** Os commits do motor com o assunto a começar por `MOT1`, com `OEDP_GATE=adiado` (o `core.gate` inteiro corre na segunda passagem, uma vez). O relatório curto: o que a ferramenta faz e a forma que escolheste para os algarismos que não são linhas; a prova do 16 com os resumos sha256 de antes e de depois de cada ficheiro gerado; as plantas e o que cada uma deu; os testes que correste, com os códigos; o que ficou aberto para a segunda passagem; os commits.

## §2 Quando paras

- A medição do ponto 1 não dá os sete resultados.
- O estudo 16 não sai igual byte a byte depois de uma tentativa honesta: páras, dizes a primeira linha que difere e a causa, e não afrouxas nenhuma regra para a fazer passar.
- A forma dos algarismos que não são linhas só funcionar deixando passar um número sem linha.
- Um teste que protege um número ou uma fonte ficar vermelho por causa da mudança e não por um erro teu.

Os teus erros de implementação corriges e segues, e dizes quais.

## §3 O fim

O ponto 6 do §1. Setenta e cinco minutos, cento e vinte chamadas.
