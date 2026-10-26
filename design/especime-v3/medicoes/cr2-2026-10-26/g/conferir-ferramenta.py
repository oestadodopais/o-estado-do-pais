"""Confere as três exigências restauradas do passo de publicação, sem escrever linhas."""
import importlib.util
spec=importlib.util.spec_from_file_location('aplicar','scripts/aplicar-releituras.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
try:m.com_published_at('access_date: "2026-10-26"\npublished_at: "2026-10-24"\n','2026-10-24')
except SystemExit as e:assert 'a linha já tem published_at' in str(e)
else:raise AssertionError('não recusou a data existente')
antes={'access_date':'2026-10-26','value':'1'};depois={**antes,'published_at':'2026-10-24'}
m.conferir_published_at(antes,depois,'2026-10-24','2026-10-26')
for a,d,motivo in [(depois,depois,'fora do published_at'),(antes,{**depois,'published_at':antes['access_date']},'não é o dia do carimbo'),(antes,{**depois,'value':'2'},'fora do published_at')]:
 try:m.conferir_published_at(a,d,'2026-10-24','2026-10-26')
 except AssertionError as e:assert motivo in str(e)
 else:raise AssertionError('planta não detetada')
print('Inserção válida e três recusas confirmadas; dia do acesso detetado como planta.')
