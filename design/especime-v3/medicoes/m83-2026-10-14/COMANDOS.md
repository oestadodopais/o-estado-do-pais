# Os comandos das medições do bloco M83 (14.10.2026)

*Cada número do relatório vem de um ficheiro desta pasta, escrito por um destes comandos. As worktrees e o motor estão escritos pelo nome da pasta no repositório, não pelo caminho da máquina. Sem travessões.*

## O ensaio do guião do pacote (`teste-pacote.json`)

```
python3 tests/leituras/pacote.py --json <pasta>/teste-pacote.json
```

Repositórios sintéticos criados numa pasta temporária; não lê o motor do projeto nem publica nada.

## Os dois ensaios sobre o bloco V2-a real (`ensaio-v2a-bloco-inteiro.json`, `ensaio-v2a-intervalo-da-correcao.json`)

Na worktree estacionada do sítio `v2a-2026-10-13` (cabeça `c4b22a56`) e na do motor `v2a-2026-10-13` (cabeça `80268af`), com o brief `MANDATO-V2A-e-2026-10-14.md` e o relatório `design/especime-v3/medicoes/v2a-2026-10-12/LEIA-ME.md` dessa worktree; o ficheiro copiado para esta pasta é o `motor/corpos-alojados.json` de cada pacote.

```
PACOTE_LOGS=inteiros PACOTE_MOTOR="<motor/worktree v2a> dfeca64d 80268af content/*" \
  sh scripts/leituras/pacote.sh <sitio/worktree v2a> ef0dc7dd c4b22a56 <pacote-inteiro> <brief> <relatorio>

PACOTE_LOGS=inteiros PACOTE_MOTOR="<motor/worktree v2a> 559eac97 80268af" \
  sh scripts/leituras/pacote.sh <sitio/worktree v2a> 972c1f07 c4b22a56 <pacote-correcao> <brief> <relatorio>
```

O primeiro cobre o bloco inteiro (o diff do motor sem `content/*`, para provar que os corpos chegam pela M83 e não pelo diff); o segundo cobre só o intervalo da passagem de correção, que é o caso que falhou a 13.10.

## O inventário do que há do nome do financiador nas histórias (`inventario-do-nome.json`)

```
INVENTARIO_SITIO=<sitio> INVENTARIO_MOTOR=<motor> INVENTARIO_ORG=oestadodopais INVENTARIO_REPO_PUBLICO=oestadodopais/o-estado-do-pais \
INVENTARIO_DOMINIOS='["oestadodopais.pt","xn--oestadodopas-2fb.pt"]' \
INVENTARIO_CADEIAS='[{"rotulo":"<rótulo neutro>","cadeia":"<a cadeia>"}, ...]' \
  python3 medir-inventario.py <pasta>/inventario-do-nome.json
```

As sete cadeias (o nome da conta da máquina, a parte local do correio pessoal, o nome completo, o nome próprio com o apelido, o nome próprio com o segundo nome, a cidade de residência, o código postal) passam pelo ambiente e nunca se escrevem em ficheiro nenhum; o guião recusa escrever o resultado se uma delas lá aparecer. O `whois` lê as duas grafias do domínio e guarda só se a linha «Owner Name» está vazia; no GitHub contam-se os membros e os membros públicos da organização, e os forks, as estrelas e os pull requests do repositório público. Um comando do Git que falhe para o guião; o `whois` e o `gh` que falhem ficam como erro no seu campo; e o guião recusa escrever se uma cadeia aparecer no resultado (provado com `python3 -O` e um rótulo igual à cadeia).

## As medidas do relatório (`medidas.json`)

```
python3 medir.py
```

Lê os JSON desta pasta e escreve as contagens que o relatório cita.
