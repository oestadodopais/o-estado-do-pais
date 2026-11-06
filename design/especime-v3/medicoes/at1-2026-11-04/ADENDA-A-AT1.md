# Adenda A ao mandato AT1: a função da caixa das sugestões no envio pré-construído (04.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree. Paraste bem pelo §3: o sítio tem uma função, `api/sugestoes.js` (GET e POST, com dois módulos locais), e copiar só o `dist/` deixava a caixa das sugestões sem funcionar.*

## §0 Lido por este lugar na documentação da Vercel (04.11.2026)

Fonte: a documentação "Vercel Primitives" da Build Output API.
- Uma função é uma pasta `.vercel/output/functions/<caminho>.func/`, com o código e as dependências dentro; o que está acima da pasta `.func` não entra.
- O `.vc-config.json` é obrigatório, com `runtime`, `handler` e, em Node.js, `launcherType: "Nodejs"`. São opcionais `regions`, `environment`, `maxDuration`, `memory` e `shouldAddHelpers`.
- `.vercel/output/functions/api/sugestoes.func/` serve em `/api/sugestoes`.

A documentação não diz se o lançador de Node.js aceita as exportações `GET` e `POST` desta função tal como estão. Por isso a função não se empacota à mão.

## §1 A decisão deste lugar

1. **O `.vercel/output` faz-se com a ferramenta da própria Vercel**, na máquina, durante a aterragem e em paralelo com a corrida do GitHub:
   - `vercel pull --yes --environment=production` e `vercel build --prod`, na cabeça que aterra;
   - a função e o `config.json` vêm do `vercel build`, empacotados como a Vercel os empacota hoje, com a região e as rotas do `vercel.json`;
   - a pasta `static` troca-se pelo `dist/` conferido, e um guião prova que cada ficheiro de `static` tem o sha256 do mesmo ficheiro do `dist/`.
2. **O guião `scripts/leituras/vercel-prebuilt.sh <worktree>`:**
   - faz esses passos e falha se faltar `functions/api/sugestoes.func/.vc-config.json`, se esse ficheiro não tiver `runtime`, `handler` e `launcherType`, se uma regra do `vercel.json` (os cabeçalhos, as redireções, a região) não tiver correspondência no `config.json`, ou se um sha256 diferir;
   - o `vercel pull` e o `vercel build` precisam de rede e da conta, que a sandbox não tem. Escreves o guião e provas a troca e as verificações sobre um `.vercel/output` de ensaio que crias na worktree (com uma função falsa, sem rede); as plantas mostram que cada falha morde.
3. **A aterragem** (`aterrar.py`) chama esse guião depois de publicar o ramo, envia o resultado como produção preparada (`vercel deploy --prebuilt --prod --skip-domain`) e promove-o quando o GitHub fica verde e `main` está empurrado, como o mandato diz.
4. **O `vercel.json` com `"main": false` vai num commit próprio**, o último da passagem, com o assunto a começar por `AT1 §1.1b`. Se o ensaio deste lugar (o guião a sério e um envio de pré-visualização, fora da produção) falhar, esse commit sai, e a aterragem continua como hoje.

## §2 O resto

O resto do mandato fica: o GitHub em paralelo, a tranca só onde é precisa, a isenção do Método e do Sobre no `voz-do-mandato.py`, e o caminho de recurso.

## §3 Quando paras

Se uma conferência tivesse de sair ou de enfraquecer, ou se a troca do `static` pelo `dist/` não puder provar-se igual por sha256 (diz porquê).
