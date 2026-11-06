# Adenda D ao mandato MET1: o recibo de exemplo com os campos do seu recibo, e a frase das conferências exata (06.11.2026)

Acrescenta: frases

Página: metodo

*A mesma sessão e a mesma worktree, sobre cf1fbabf5. A leitura a frio do lote 5 pelo Claude Opus 5.5 apanhou as cinco plantas e deu três achados reais no Método; este lugar conferiu-os no `dist/` da cabeça, e um deles vem de uma frase deste lugar no mandato.*

## §0 Medido por este lugar (no `dist/` de cf1fbabf5, por guião, nas duas edições)

- No recibo de exemplo, o campo 'onde está no documento' / 'where it is in the document' imprime o campo `document.edition` e a data da referência ('Diário da República, 1.ª série, n.º 249, de 29-12-2025 · 2026'). A página do recibo da mesma linha imprime em 'Onde no documento' / 'Where in the document' o campo `document.locator` ('artigo 3.º (o valor) e artigo 2.º, «Âmbito territorial» (…), p. 2'), com a língua do localizador marcada (`lang="pt-PT"` na edição inglesa), e a edição num campo seu, 'Edição' / 'Edition'. A lista `CAMPOS` de `scripts/metodo-do-portao.mjs:36` fixa `document.edition`, e por isso a régua aceita o campo trocado.
- O nome do recibo de exemplo está escrito em `scripts/metodo-aprovado.json` ('Retribuição mínima mensal garantida no continente' / 'Guaranteed minimum monthly wage in mainland Portugal'); o título que a página do recibo imprime no `h1` é 'Salário mínimo mensal (continente)' / 'Monthly minimum wage (mainland Portugal)'. A adenda B pedia tudo lido do livro-razão.
- A frase do passo 6, escrita por este lugar no mandato, diz que a cada construção correm 62 conferências sobre todas as páginas. A lista de 62 é a do `verify` mais o `typecheck`, que a corrida do GitHub corre inteira na cabeça que aterra e sem a qual a aterragem não funde (`scripts/leituras/aterrar.py`, a espera pela conclusão `success` antes da fusão); um `build` sozinho corre 29 passos, e algumas das 62 conferem o código e os mandatos, não páginas.

## §1 O que fazes

1. No recibo de exemplo, 'onde está no documento' / 'where it is in the document' imprime o localizador da linha com a mesma escolha de campo e de língua da página do recibo (o `document.locator_en` na edição inglesa quando existe, senão o `document.locator` com a língua marcada pela mesma função), sem a data da referência. A edição sai do recibo de exemplo. A régua do Método passa a exigir o localizador nesse campo; planta: a edição posta no lugar do localizador é recusada, nas duas edições.
2. O nome do recibo de exemplo é o título que a página do recibo dessa linha imprime, em cada edição, lido do mesmo campo do livro-razão, e não escrito à mão; planta: um nome diferente do título do recibo é recusado.
3. A frase do passo 6 passa a ser, palavra por palavra, com o mesmo token:
   - pt «Antes de cada mudança ir para o ar, correm {prova: conferencias_da_corrida} conferências automáticas: um algarismo sem linha no livro-razão, ou com outro valor, trava a publicação.»
   - en «Before each change goes live, {prova: conferencias_da_corrida} automated checks run: a digit without a ledger row, or with a different value, stops publication.»

   A lista fechada e o oráculo acompanham; nenhuma outra frase do Método muda.
4. Nenhuma régua que protege um número, uma fonte ou uma pessoa enfraquece; a régua do Método fica mais apertada, não mais larga.

## §2 Quando paras

Se a linha não tiver localizador numa das edições (diz qual), ou se a frase do §1.3 não couber na lista fechada sem mudar outra frase.

## §3 O fim

O `build` inteiro verde; as plantas do Método, `tests/metodo/construido.mjs`, `check:incorporar`, `check:lingua` e `check:discussao`, com os códigos; o recibo de exemplo e a frase do passo 6 copiados do `dist/` nas duas edições, no relatório. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `MET1 D`. Vinte minutos, vinte e cinco chamadas.
