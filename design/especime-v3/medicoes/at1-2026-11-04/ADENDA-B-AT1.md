# Adenda B ao mandato AT1: a região da função no envio pré-construído (04.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree. O ensaio real deste lugar (`vercel-prebuilt.sh` na cabeça 9f9d30370, com a tranca; o `vercel pull` e o `vercel build` corridos, 563 s) acabou com código 1, pela tua verificação: "região da função diferente do vercel.json". A verificação estava certa.*

## §0 Medido por este lugar

- O `.vc-config.json` que o `vercel build` escreveu para `functions/api/sugestoes.func` tem `handler` `api/sugestoes.js`, `runtime` `nodejs22.x`, `launcherType` `Nodejs`, `shouldAddHelpers` `true`, e não tem `regions`.
- O `vercel.json` tem `regions: ["dub1"]` (Dublin).
- A documentação "Vercel Primitives" dá `regions` como campo do `.vc-config.json`: a lista das regiões onde a função corre.
- A função é a caixa das sugestões, o único sítio onde o projeto guarda o que um leitor escreve; a região tem de ser a que o `vercel.json` declara.

## §1 O que fazes

1. Depois do `vercel build`, o `vercel-prebuilt.py` escreve no `.vc-config.json` de cada função as `regions` do `vercel.json` quando o `vercel build` não as escreveu.
2. Quando estão escritas e diferem das do `vercel.json`, falha como hoje.
3. A verificação passa a conferir que cada função acaba com as `regions` do `vercel.json`, exatamente.
4. Plantas:
   - uma função sem `regions` no ensaio local fica com `["dub1"]` depois da passagem;
   - uma função com outra região falha;
   - um `vercel.json` sem `regions` faz o guião falhar, em vez de enviar uma função sem região.
5. **A árvore fica como estava.** O mesmo ensaio real deixou a worktree com `package-lock.json` modificado: o `vercel build` corre a instalação, e o npm reescreveu os `engines` da raiz do ficheiro de `">=22.12.0"` para `"22.x"`, porque o `package.json` diz `"22.x"` desde a LAR1 e o ficheiro de bloqueio não acompanhou. Duas coisas:
   - o `package-lock.json` passa a ter, na raiz, os `engines` que o npm escreve (`"node": "22.x"`), e só essa linha muda;
   - o guião falha, a dizer qual ficheiro, se a worktree tiver alguma mudança fora do que o `.gitignore` ignora depois do `vercel build`, e uma planta mostra que morde: nenhum pacote se envia construído de uma árvore diferente da cabeça.
6. Corres o ensaio local (sem rede) e a suite dos guiões que a sandbox deixa; o ensaio real volta a ser deste lugar.

## §2 O fim

Um commit, com o assunto a começar por `AT1` e os trailers da casa (`Co-Authored-By` e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`), antes do commit `AT1 §1.1b` (o do `"main": false`), que fica o último do ramo. Se a ordem não puder ficar assim sem reescrever a história, o commit do `"main": false` refaz-se por cima, e o anterior desfaz-se por `git revert`. Vinte minutos, vinte e cinco chamadas.
