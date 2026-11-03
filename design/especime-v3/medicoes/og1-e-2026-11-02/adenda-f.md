# OG1-E, adenda F: paragem na composição

A passagem parou pela condição do §7, antes de exportar ou construir o sítio.

A frase do §2 contém «RTP Antena 1» sem token para o algarismo. A composição recusou-a: `documento.en.md.tmpl:59: algarismo sem linha`, código 1.

Foi ensaiada numa cópia a marcação integral do nome, sem mudar a frase rendida: `⟦lit:RTP Antena 1@hab-imprensa-assistidos⟧`. O compositor recusou também esse token: `documento.pt.md.tmpl:59: literal sem a linha nomeada: RTP Antena 1@hab-imprensa-assistidos`, código 1.

O excerto de hab-imprensa-assistidos é «oito pessoas foram assistidas no seu quartel»; o localizador é «HTML; início literal único». Nenhum dos excertos ou localizadores das linhas citadas nessa frase contém «Antena 1». A régua dos literais aceita esses campos e datas conferidas; a presença do nome no artigo alojado, indicada no mandato, não é por si um apoio admitido pelo compositor.

A continuação precisa de um apoio conferido no livro para esse nome, ou de uma frase autorizada que o dispense. A régua dos algarismos e a dos literais conservaram-se. Os ensaios dos gabaritos, da régua dos relatos e do teste foram repostos; o motor ficou na cabeça 1723839, sem mudanças. O sítio recebe apenas este diagnóstico. Os §§1 a 6 não ficaram implementados e a edição da habitação não mudou.

Registos: `<temporario>/og1ef-compor.log`, código 1 por erro de sintaxe no primeiro comando de ensaio, antes de executar o compositor; `<temporario>/og1ef-compor2.log`, código 1 por algarismo sem linha; `<temporario>/og1ef-literal.log`, código 1 pela recusa do literal na cópia. Houve duas execuções efetivas do compositor e uma tentativa que falhou no comando. Não correram core.gate, build, verify, capturas ou os portões; não há ficheiros .codigo dessas corridas.

Custo até à redação: 14 chamadas de ferramentas; três tentativas de conferência por curto.sh, das quais duas executaram o compositor. Não foi observada uma linha tokens used.
