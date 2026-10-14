#!/bin/sh
# Monta o pacote de uma leitura a frio de um bloco (decisão do lugar de direção, 07.09.2026: o pacote montado por um guião).
# uso: pacote.sh <repositório> <base> <cabeça> <pacote> <brief.md> <relatório.md> [<caminho em dist/>...]
#   PACOTE_EXTRA="<caminho> <caminho>" copia também esses caminhos do repositório tal como estão na cabeça
#   (ficheiros ou pastas), para o que o diff não traz: as páginas congeladas de um brief entram com o brief,
#   antes do intervalo do diff, e a leitura do R1 a 23.09.2026 ficou sem elas (M25, a segunda metade).
#   PACOTE_RETIRA="<padrão> <padrão>" retira só secções do diff; os ficheiros ficam inteiros.
#   PACOTE_MOTOR="<árvore> <base> <cabeça> [<padrão>...]" junta os ficheiros e o diff do motor.
#   Padrões glob de caminhos relativos; aspas interiores protegem caminhos com espaços.
#   <pacote>/brief.md, relatorio-construtor.md, diff.patch (base..cabeça, sem binários e sem o relatório),
#   os ficheiros mudados nos seus caminhos tal como estão na cabeça, built/<caminho> copiado de
#   <repositório>/dist/, e numeros-do-relatorio.txt com a saída do conferir-relatorio.py sobre o relatório.
#   O «antes/» copia-se à mão quando a leitura compara. As plantas plantam-se depois, com plantar.py.
#   M-A: os registos build.log, verify.log e typecheck.log com .codigo ao lado
#   ficam fora do diff e das cópias inteiras, incluindo PACOTE_EXTRA. Conservam-se
#   os códigos, tempos.json e só as linhas citadas no relatório pela forma:
#   <!-- portao: portoes/verify.log | npm run check:series · -->
#   PACOTE_LOGS=inteiros conserva os registos inteiros. Por omissão, cada
#   registo reduzido ou omitido é dito com o tamanho original e o conservado.
#   O caminho parte da pasta do relatório. A falta da linha fecha a montagem;
#   linhas-dos-portoes.json dá os números das linhas e o sha256 da origem.
#   M83 (14.10.2026, §1.192): cada linha mudada em ledger/claims/ com `document.source_sha256` traz o seu
#   documento alojado da cabeça do motor (PACOTE_MOTOR), copiado para motor/<caminho> e conferido pelo sha256,
#   com o recibo do pedido e a pasta direitos/ ao lado, listado em motor/CORPOS-ALOJADOS.md; sem o corpo a
#   montagem recusa. PACOTE_ESTUDOS="<content/estudo> ..." acrescenta pastas a percorrer quando a nota da linha
#   não declara o estudo; PACOTE_SEM_CORPOS="<a razão, vinte caracteres ou mais>" é a única exceção, e fica
#   escrita em SEM-CORPOS-ALOJADOS.md para o leitor a ler como Blocking. As páginas construídas das linhas
#   mudadas entram sozinhas de dist/ quando lá estão.
set -eu
repo="$1"; base="$2"; cabeca="$3"; pacote="$4"; brief="$5"; relatorio="$6"; shift 6

# OS NÚMEROS DO RELATÓRIO CONFEREM-SE ANTES DE SE COPIAR SEJA O QUE FOR (M5,
# 22.09.2026, com a correção da leitura a frio desse dia). O leitor a frio fica a
# saber à partida que números do relatório foram medidos e quais não estão em
# ficheiro nenhum, sem ter de descobrir um a um. A saída é dita, nunca engolida:
# o código 1 é «há números sem ficheiro» e entra no pacote; o 2 é «o guião não
# correu, ou o seu conhecido-positivo falhou», e nesse caso o pacote NÃO SE CRIA,
# porque um zero de um detetor calado enganaria o leitor. A primeira redação
# desta parte corria no fim, depois de o pacote já estar montado, e por isso um
# código 2 deixava um pacote meio feito com a promessa por cumprir.
guiao="$(dirname "$0")/conferir-relatorio.py"
numeros_tmp="$(mktemp)"
trap 'rm -f "$numeros_tmp"' EXIT
codigo=0
python3 "$guiao" "$relatorio" "$(dirname "$relatorio")" > "$numeros_tmp" 2>&1 || codigo=$?
echo "código de saída do conferir-relatorio.py: $codigo" >> "$numeros_tmp"
if [ "$codigo" -ge 2 ]; then
  cat "$numeros_tmp"
  rm -f "$numeros_tmp"
  echo "pacote.sh: o conferir-relatorio.py não correu, ou o seu conhecido-positivo falhou (código $codigo). O pacote não se cria." >&2
  exit 1
fi

# O Python lê os caminhos com NUL e os padrões com shlex, sem expansão pela shell.
python3 "$(dirname "$0")/pacote.py" "$repo" "$base" "$cabeca" "$pacote" "$brief" "$relatorio" "$numeros_tmp" "$@"
rm -f "$numeros_tmp"
