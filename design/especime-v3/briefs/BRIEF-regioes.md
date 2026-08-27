# BRIEF · As regiões (Emenda 21): a régua completa e as páginas das regiões

*Escrito a 27.08.2026 pelo lugar de direção (Claude Fable 5) para dois construtores (Claude Opus 5): R1 no motor e R2 no sítio, em paralelo (repositórios diferentes): o sítio constrói a estrutura para as regiões que já têm linhas, e as que o motor trouxer entram pela mesma via, geradas dos dados, sem página escrita à mão. Decisão do diretor de 27.08 («go, follow your recommendation on all of them»). Os factos vêm do reconhecimento de 27.08 (`medicoes/regioes-reconhecimento-2026-08-27.md`). Sem travessões na prosa deste ficheiro.*

## 0 · Numa frase

O motor confirma na fonte o conjunto das regiões NUTS II em vigor e traz as que faltam à régua (hoje: Grande Lisboa, Península de Setúbal, Algarve, Madeira, Alentejo e o país; faltam pelo menos o Norte, o Centro e os Açores, e o que mais o conjunto em vigor tiver), com as linhas do Eurostat como as que existem; o sítio faz `/regioes` com a régua completa nas duas larguras e uma página por região, e a primeira página deixa de mostrar regiões no lugar do país.

## 1 · R1 · o motor

1. **O conjunto em vigor, confirmado na fonte.** A classificação NUTS 2024 do Eurostat para Portugal (a lista das regiões NUTS II e os seus códigos), lida da fonte e alojada (o ficheiro, o endereço, a data); a nota do estudo 03 diz que `PT1C` é o Alentejo e a sua consulta ao Eurostat nomeia `PT11, PT15, PT19, PT1A, PT1B, PT1C, PT1D, PT20, PT30`: o que cada código é fica escrito da fonte, não de memória.
2. **As linhas que faltam**, na forma das que existem (`pib-pc-<regiao>-2024`, índice UE-27 = 100, e a distância `distancia-<regiao>-ue27-2024` derivada com a fórmula e a conta, como as seis de 25.08): o mesmo indicador e o mesmo período do Eurostat que as linhas existentes usam (lê a linha `pib-pc-grande-lisboa-2024` no sítio para o endereço e o excerto), para cada região em vigor que não tem linha; se o período de uma região não for o mesmo, a linha diz o seu período e a régua marca-o.
3. **A travessia**: as linhas novas para o sítio pelo exportador que atravessou as regionais (descobre qual: manifesto ou outro caminho; o gate do motor lista «dataset regional-2026-08»), com `study: avaliacao-economica-regional-de-portugal-2026`; as duas linhas do Alentejo com `study: alentejo-algarve` ficam como estão (registadas como discrepância de nome, não corrigidas aqui).
4. Provas: o conjunto em vigor confere com a lista alojada; cada valor novo igual ao ficheiro do Eurostat alojado; três estragos plantados (um código trocado, um valor alterado, uma região a faltar) vermelhos; o gate verde; `NEXT.md`.

## 2 · R2 · o sítio

**RG1 · `/regioes` e `/en/regions`.** A régua da convergência completa (`InstrumentoConvergencia.astro`, a gramática da Emenda 4: referência a tinta à altura toda, barra = distância à referência, traço fino = valor, nenhuma barra sem referência publicada): todas as regiões em vigor e o país; no computador o eixo; no telemóvel a lista com barras, uma região por linha, o 100 marcado, sem rótulos no eixo (IDENTIDADE §11: uma coisa por linha; os instrumentos rolam na sua caixa). Por baixo, a lista das regiões como portas. `convergencia.js` continua a ser melhoria progressiva (a página é correta sem ele).

**RG2 · `/regioes/<slug>` e `/en/regions/<slug>`.** Uma página por região em vigor: a cabeça (o nome, o tipo «região NUTS II»), a régua completa com esta região distinguida só pelo contorno (Emendas 10 e 21c), as peças da região (o índice, a distância, com os selos; as que a região tiver), a leitura do trabalho regional onde exista (as frases que hoje rendem em `?ambito=regiao:<slug>`, se passarem a grelha da voz), as portas (`/regioes`, a primeira página). Disposição da IDENTIDADE §3 escolhida e dita (C · Instrumento, provavelmente), nunca uma quarta.

**RG3 · A primeira página.** Os estados `?ambito=regiao:<slug>` saem (Emenda 21b): `resolveAmbito()` reencaminha um endereço antigo para `/regioes/<slug>`; os blocos de cabeça `regiao:*`, os painéis `regiao:*` e as suas cadeias saem de `HomeView`/`Cabeca`; `data-so-pais` deixa de ter razão (o painel social é sempre do país) e sai; o comando de âmbito ganha «Região» como ligação a `/regioes`, nas duas larguras, ao lado de «País · Concelho». A régua não volta à primeira página.

**RG4 · Os portões e as réguas.** `check:regioes` (ou o alargamento de um portão existente): cada região em vigor tem página e cada página tem as suas linhas; a régua imprime só valores com linha; a neutralidade (um só estilo de barra; o contorno da região da página); nenhuma frase por classificar; as chaves da prova (quantas regiões, quantas com linha). Matriz: as células das regiões que saíram a 25.08 voltam, para `/regioes` (a nota da matriz nas linhas 699 a 710 diz onde). Estragos plantados por regra.

**RG5 · Os registos.** `DECISIONS.md` (o número que couber, antes de «## 4.»), `**Afecta:** nenhum`; `ISSUES.md` (I51 já fechada por remoção; regista o endereço das regiões); `notas/regioes.md`; `CHAVES-EN.md`; o inventário com `bloco: regioes`; `REVISOES-DO-INVENTARIO.md` com `por ler`.

## 3 · O que NÃO muda

Os distritos e os concelhos; o livro-razão além das linhas novas; nenhum texto governado; a constituição (a Emenda 21 já está escrita).

## 4 · Verificação cruzada (o lugar de direção)

Sonnet numa cópia (a régua: cada barra igual à sua linha, a lista do telemóvel, os contornos, os endereços antigos); Codex sobre o diff do inventário, `/regioes` e duas páginas de região com plantas (uma região sem linha na régua; uma barra com cor de estatuto; uma frase de autorreferência; um valor trocado).
