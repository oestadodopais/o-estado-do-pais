A fusão ficou bloqueada pela sandbox: `git merge` terminou com código **128**, ao criar `ORIG_HEAD.lock`: `Operation not permitted`.

O caminho pelo escrivão não permite esta operação: `fundir.sh` e `escrivao.py` aceitam apenas `main` ou `master`.

Confirmei:
- Cabeça intacta em `36d48a4ce`, árvore limpa e nenhuma fusão em curso.
- Ramo do lote 1 em `e81a54ee2`, como indicado.
- Nenhum commit, conferência ou build nesta passagem.

Falta um caminho autorizado no escrivão para fundir esse ramo e resolver os conflitos previstos. Não pedi escalada.

**4 chamadas de ferramentas; 0 corridas de conferências.**