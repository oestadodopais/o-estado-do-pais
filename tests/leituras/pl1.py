"""PL1: lotes, limite diário, custos, corridas, métricas e pré-mandato."""
from datetime import date, datetime, timezone
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

GUIOES = Path(__file__).resolve().parents[2] / 'scripts/leituras'
sys.path.insert(0, str(GUIOES))
import aterrar
import estado
from apoio_ferramentas import repo, worktree, git as git_ensaio, commit


def modulo(nome):
    spec = importlib.util.spec_from_file_location(nome, GUIOES / (nome + '.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


class Lotes(unittest.TestCase):
    def setUp(self):
        self.t = tempfile.TemporaryDirectory(); self.addCleanup(self.t.cleanup)
        self.p = Path(self.t.name)
        self.a = object.__new__(aterrar.Aterragem)
        self.a.sitio = self.p; self.a.principal = self.p / 'principal'
        self.a.saida = self.p / 'saida'; self.a.cabeca = 'a' * 40
        self.a.recibo = {}; self.arquivo = self.p / '_aterragens'; self.arquivo.mkdir()
        self.ambiente = patch.dict(os.environ, {'OEDP_ATERRAGENS': str(self.arquivo), 'OEDP_BLOCOS': 'A1 B1',
                                               'ATERRAR_LOTE_EXTRA': '', 'ATERRAR_SEM_CUSTO': '', 'ATERRAR_DECISAO': ''})
        self.ambiente.start(); self.addCleanup(self.ambiente.stop)
        for nome in ('A1', 'B1', 'Lote'):
            (self.p / 'design/especime-v3/medicoes' / nome).mkdir(parents=True)

    def test_blocos_prefixos_e_ausencias(self):
        with patch.object(aterrar, 'git', side_effect=['b' * 40, 'A1-1: conteúdo\nB1: conteúdo\nLote-r: registos']):
            self.a.conferir_blocos()
        self.assertEqual(self.a.recibo['blocos'], ['A1', 'B1'])
        for assuntos, motivo in [('A1: só um', 'sem commit'), ('A1: um\nB1: dois\nX1: surpresa', 'fora dos blocos')]:
            with patch.object(aterrar, 'git', side_effect=['b' * 40, assuntos]), self.assertRaises(aterrar.Parar) as e:
                self.a.conferir_blocos()
            self.assertIn(motivo, e.exception.motivo)
        with patch.dict(os.environ, OEDP_BLOCOS=''), patch.object(aterrar, 'git', side_effect=['b' * 40, 'A1: conteúdo']), self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_blocos()
        self.assertIn('falta OEDP_BLOCOS', e.exception.motivo)

    def test_custo_um_por_bloco(self):
        self.a.recibo['blocos'] = ['A1', 'B1']
        nomes = []
        for b in ('A1', 'B1'):
            p = self.p / f'design/especime-v3/medicoes/{b}/custo-2026-10-29.json'
            p.parent.mkdir(parents=True, exist_ok=True); p.write_text(json.dumps({'bloco': b, 'pontos_do_bloco': 1}))
            nomes.append(str(p.relative_to(self.p)))
        with patch.object(aterrar, 'git', return_value='\n'.join(nomes)):
            self.a.conferir_custo()
        self.assertEqual(set(self.a.recibo['custos_por_bloco']), {'A1', 'B1'})
        del self.a.recibo['custo']
        with patch.object(aterrar, 'git', return_value=nomes[0]), self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_custo()
        self.assertIn('B1', e.exception.motivo)

    def test_limite_diario_e_excecao(self):
        for n in range(2):
            p = self.arquivo / str(n); p.mkdir()
            (p / 'aterragem.json').write_text(json.dumps({'inicio': datetime.now(timezone.utc).isoformat(), 'codigo': 0}))
        with self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_limite_diario()
        self.assertIn('duas aterragens', e.exception.motivo)
        with patch.dict(os.environ, ATERRAR_LOTE_EXTRA='fonte urgente'):
            self.a.conferir_limite_diario()
        self.assertEqual(self.a.recibo['lote_extra'], 'fonte urgente')
        (self.arquivo / '1/aterragem.json').write_text(json.dumps({'inicio': '2020-01-01T00:00:00Z', 'codigo': 0}))
        self.a.conferir_limite_diario()
        self.assertEqual(self.a.recibo['aterragens_do_dia'], 1)

    def test_corrida_inteira_dirigida_e_vermelha(self):
        self.a.conferir_corrida(); self.assertEqual(self.a.recibo['conferencias']['modo'], 'por medir')
        p = self.arquivo / 'lote-conferir'; p.mkdir()
        (p / 'cabeca').write_text(self.a.cabeca)
        d = {'cabeca': self.a.cabeca, 'cabeca_fim': self.a.cabeca, 'passos': [{'passo': 'a', 'codigo': 0}]}
        (p / 'resumo.json').write_text(json.dumps(d)); self.a.conferir_corrida()
        self.assertEqual(self.a.recibo['conferencias']['modo'], 'inteira')
        (p / 'DIRIGIDAS.txt').write_text('Passos: a\nRazão: frase\n'); self.a.conferir_corrida()
        self.assertEqual(self.a.recibo['conferencias']['modo'], 'dirigidas')
        d['passos'][0]['codigo'] = 1; (p / 'resumo.json').write_text(json.dumps(d))
        with self.assertRaises(aterrar.Parar): self.a.conferir_corrida()

    def test_semana_valores_ausentes_nao_sao_zero(self):
        p = self.p / 'design/especime-v3/medicoes/a/custo-2026-10-29.json'; p.parent.mkdir(parents=True)
        d = {'bloco': 'A1', 'mandato_escrito_em': '2026-10-28T10:00:00Z', 'no_ar_em': '2026-10-29T10:00:00Z',
             'passagens_codex': [{'pontos': 1}, {'pontos': 2}], 'leituras': [{'simbolos': 100}, {'simbolos': 200}], 'frases_ao_leitor': 2}
        p.write_text(json.dumps(d))
        self.assertIn('| 24 | 3 | 300 | 150 |', '\n'.join(estado.blocos_da_semana(self.p, date(2026, 10, 29))))
        d['leituras'][1]['simbolos'] = None; d['passagens_codex'][0]['pontos'] = None; d['no_ar_em'] = None
        p.write_text(json.dumps(d))
        self.assertIn('| por medir | por medir | por medir | por medir |', '\n'.join(estado.blocos_da_semana(self.p, date(2026, 10, 29))))

    def custo(self, dados):
        self.a.recibo = {'blocos': ['A1']}
        f = 'design/especime-v3/medicoes/A1/custo-2026-10-29.json'
        (self.p / f).write_text(json.dumps({'bloco': 'A1', **dados}))
        return f

    def test_orcamento_recusa_12_e_aceita_decisao(self):
        f = self.custo({'pontos_do_bloco': 12, 'orcamento': {'pontos_codex_por_bloco': 'menos de 10'}})
        with patch.object(aterrar, 'git', return_value=f), self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_custo()
        self.assertIn('atingem o orçamento', e.exception.motivo)
        decisao = '29.10.2026: decisão escrita do ensaio'
        with patch.dict(os.environ, ATERRAR_DECISAO=decisao), patch.object(aterrar, 'git', return_value=f):
            self.a.conferir_custo()
        self.assertEqual(self.a.recibo['decisao_do_financiador'], decisao)

    def test_passagens_12_e_limite_igual_recusados(self):
        for dados in ({'passagens_codex': [{'pontos': None}, {'pontos': 7}, {'pontos': 5}]}, {'pontos_do_bloco': 10}):
            f = self.custo(dados)
            with patch.object(aterrar, 'git', return_value=f), self.assertRaises(aterrar.Parar) as e:
                self.a.conferir_custo()
            self.assertIn('atingem o orçamento', e.exception.motivo)

    def test_orcamento_por_omissao_e_soma_medida(self):
        f = self.custo({'pontos_do_bloco': None, 'passagens_codex': [{'pontos': None}, {'pontos': 2}, {'pontos': 1}]})
        with patch.object(aterrar, 'git', return_value=f):
            self.a.conferir_custo()
        self.assertEqual(self.a.recibo['orcamento_por_omissao'], 10)
        self.assertEqual(self.a.recibo['medidas_de_custo']['A1']['pontos'], 3)

    def test_pontos_nulos_sem_passagens_recusados(self):
        f = self.custo({'pontos_do_bloco': None})
        with patch.object(aterrar, 'git', return_value=f), self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_custo()
        self.assertIn('por medir', e.exception.motivo)

    def test_sem_custo_nao_dispensa_bloco_de_conteudo(self):
        self.custo({'pontos_do_bloco': None})
        with patch.dict(os.environ, ATERRAR_SEM_CUSTO='ensaio'), self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_custo()
        self.assertIn('só de registos', e.exception.motivo)

    def test_so_registos_carrega_custo_de_outro_bloco(self):
        self.custo({'pontos_do_bloco': None})
        with patch.dict(os.environ, OEDP_BLOCOS='', ATERRAR_SEM_CUSTO='registos de fecho'), patch.object(aterrar, 'git', side_effect=['b' * 40, 'Lote-r: custos e registos', 'design/custo.json\0scripts/leituras/estado.py\0DECISIONS.md\0']):
            self.a.conferir_blocos()
            self.a.conferir_custo()
        self.assertTrue(self.a.recibo['so_registos'])
        self.assertEqual(self.a.recibo['custos_por_bloco'], {})
        self.assertEqual(self.a.recibo['sem_custo'], 'registos de fecho')

    def test_ramo_de_registos_recusa_src_e_lista_todos_os_ficheiros(self):
        proibidos = ['src/pagina.astro', 'ledger/linha.yml', 'tests/prova.py', 'public/imagem.svg', 'scripts/outro.py', 'package.json']
        with patch.dict(os.environ, OEDP_BLOCOS=''), patch.object(aterrar, 'git', side_effect=['b' * 40, 'Lote-r: registos', '\0'.join(proibidos) + '\0']), self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_blocos()
        for f in proibidos:
            self.assertIn(f, e.exception.motivo)
        self.assertNotIn('so_registos', self.a.recibo)

    def test_ramo_git_de_registos_recusa_src_e_espaco_no_nome(self):
        principal = repo(self.p / 'git-principal', 'main')
        ramo = worktree(principal, self.p / 'git-registos', 'A1-r')
        (ramo / 'design/especime-v3/medicoes/A1').mkdir(parents=True)
        proibidos = ['src/planta.txt', ' design/fora.txt']
        for f in proibidos:
            alvo = ramo / f; alvo.parent.mkdir(parents=True, exist_ok=True); alvo.write_text('planta')
        git_ensaio(ramo, 'add', '--', *proibidos)
        commit(ramo, 'A1-r: registos com alterações proibidas')
        self.a.sitio = ramo; self.a.cabeca = git_ensaio(ramo, 'rev-parse', 'HEAD')
        with patch.dict(os.environ, OEDP_BLOCOS=''), self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_blocos()
        for f in proibidos:
            self.assertIn(f, e.exception.motivo)

    def test_retoma_de_registos_confere_a_base_original(self):
        anterior = {'cabeca': self.a.cabeca, 'blocos': [], 'so_registos': True, 'base_registos': 'b' * 40,
                    'passos': [{'passo': 'fundir-main', 'codigo': 0}]}
        with patch.dict(os.environ, OEDP_BLOCOS=''), patch.object(aterrar, 'git', side_effect=[self.a.cabeca, 'src/pagina.astro\0']) as g, patch.object(self.a, 'recibos_anteriores', return_value=[anterior]), self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_blocos()
        self.assertIn('src/pagina.astro', e.exception.motivo)
        self.assertIn('--no-renames', g.call_args.args)
        self.assertEqual(g.call_args.args[-1], 'b' * 40 + '...' + self.a.cabeca)

    def test_decisao_sem_data_ou_curta_recusada(self):
        f = self.custo({'pontos_do_bloco': 12})
        for decisao, motivo in [('autorizar este custo pelo motivo escrito', 'data DD.MM.AAAA'),
                                ('29.10.2026: sim', 'vinte carateres'), ('31.02.2026: autorização escrita com justificação', 'data inválida')]:
            with patch.dict(os.environ, ATERRAR_DECISAO=decisao), patch.object(aterrar, 'git', return_value=f), self.assertRaises(aterrar.Parar) as e:
                self.a.conferir_custo()
            self.assertIn(motivo, e.exception.motivo)

    def test_retoma_exige_repetir_decisao_guardada(self):
        f = self.custo({'pontos_do_bloco': 12})
        decisao = '29.10.2026: autorização escrita com justificação'
        anterior = {'cabeca': self.a.cabeca, 'blocos': ['A1'], 'custo': [f], 'custos_por_bloco': {'A1': f},
                    'decisao_do_financiador': decisao, 'passos': [{'passo': 'fundir-main', 'codigo': 0}]}
        for repetida in ('', '29.10.2026: autorização diferente com justificação', decisao):
            self.a.recibo = {}
            with patch.dict(os.environ, OEDP_BLOCOS='A1', ATERRAR_DECISAO=repetida), patch.object(aterrar, 'git', return_value=self.a.cabeca), patch.object(self.a, 'recibos_anteriores', return_value=[anterior]):
                self.a.conferir_blocos()
                if repetida == decisao:
                    self.a.conferir_custo()
                    self.assertEqual(self.a.recibo['decisao_do_financiador'], decisao)
                else:
                    with self.assertRaises(aterrar.Parar) as e:
                        self.a.conferir_custo()
                    self.assertIn('igual à decisão guardada', e.exception.motivo)

    def test_prefixo_de_registos_exige_nome_conhecido_e_caixa(self):
        for assunto in ('Desconhecido-r: registos', 'lote-r: registos', 'registos: fecho', 'Lote-r: fecho\nA1: conteúdo'):
            with patch.dict(os.environ, OEDP_BLOCOS=''), patch.object(aterrar, 'git', side_effect=['b' * 40, assunto]), self.assertRaises(aterrar.Parar):
                self.a.conferir_blocos()

    def test_retoma_conserva_custos_por_bloco(self):
        f = self.custo({'pontos_do_bloco': 2})
        anterior = {'cabeca': self.a.cabeca, 'blocos': ['A1'], 'custo': [f], 'custos_por_bloco': {'A1': f},
                    'passos': [{'passo': 'fundir-main', 'codigo': 0}]}
        self.a.recibo = {}
        with patch.dict(os.environ, OEDP_BLOCOS='A1'), patch.object(aterrar, 'git', return_value=self.a.cabeca), patch.object(self.a, 'recibos_anteriores', return_value=[anterior]):
            self.a.conferir_blocos(); self.a.conferir_custo()
        self.assertEqual(self.a.recibo['custos_por_bloco'], {'A1': f})

    def test_retoma_so_de_registos(self):
        anterior = {'cabeca': self.a.cabeca, 'blocos': [], 'so_registos': True, 'sem_custo': 'registos de fecho',
                    'custos_por_bloco': {}, 'base_registos': 'b' * 40, 'passos': [{'passo': 'fundir-main', 'codigo': 0}]}
        with patch.dict(os.environ, OEDP_BLOCOS=''), patch.object(aterrar, 'git', side_effect=[self.a.cabeca, 'design/fecho.md\0']), patch.object(self.a, 'recibos_anteriores', return_value=[anterior]):
            self.a.conferir_blocos(); self.a.conferir_custo()
        self.assertTrue(self.a.recibo['so_registos'])
        self.assertEqual(self.a.recibo['sem_custo'], 'registos de fecho')
        self.assertEqual(self.a.recibo['custos_por_bloco'], {})


class PreMandato(unittest.TestCase):
    def setUp(self):
        self.t = tempfile.TemporaryDirectory(); self.addCleanup(self.t.cleanup)
        self.p = Path(self.t.name); self.guioes = self.p / 'scripts/leituras'; self.guioes.mkdir(parents=True)
        self.mandato = self.p / 'mandato.md'
        self.env = {k: v for k, v in os.environ.items() if not k.startswith('OEDP_')}
        self.env.update(OEDP_LINHA_IRMA='irma', OEDP_TITULO_IRMA='titulo', OEDP_FICHEIRO_IRMA='ficheiro')
        self.listas = self.guioes / 'listas-de-uma-linha.sh'
        self.voz = self.guioes / 'voz-do-mandato.py'
        self.listas.write_text('test "$2" = irma && test "$3" = titulo && test "$4" = ficheiro || exit 8\necho LISTAS-EXECUTADAS\nexit 0\n')
        self.voz.write_text('import sys\nfrom pathlib import Path\nassert Path(sys.argv[1]).is_dir() and Path(sys.argv[2]).is_file()\nprint("VOZ-EXECUTADA")\n')

    def correr(self, texto, **env):
        self.mandato.write_text(texto)
        return subprocess.run([sys.executable, str(GUIOES / 'pre-mandato.py'), str(self.p), str(self.mandato)],
                              env={**self.env, **env}, capture_output=True, text=True)

    def test_sem_cabecalho_e_variavel_vazia_recusados(self):
        r = self.correr('mandato sem declaração', OEDP_ACRESCENTA='linhas')
        self.assertEqual(r.returncode, 9); self.assertIn('cabeçalho', r.stderr)
        r = self.correr('Acrescenta: nada\n', OEDP_ACRESCENTA='')
        self.assertEqual(r.returncode, 9); self.assertIn('declaração ausente', r.stderr)

    def test_variavel_so_aperta(self):
        r = self.correr('Acrescenta: linhas\n', OEDP_ACRESCENTA='nada')
        self.assertEqual(r.returncode, 9); self.assertIn('afrouxar', r.stderr)
        r = self.correr('Acrescenta: nada\n', OEDP_ACRESCENTA='linhas')
        self.assertEqual(r.returncode, 0); self.assertIn('LISTAS-EXECUTADAS', r.stdout)

    def test_listas_reais_no_ensaio_recusam(self):
        self.listas.write_text('echo LISTAS-RECUSARAM\nexit 1\n')
        r = self.correr('Acrescenta: linhas\n')
        self.assertEqual(r.returncode, 1); self.assertIn('LISTAS-RECUSARAM', r.stdout)

    def test_voz_real_no_ensaio_recusa(self):
        self.voz.write_text('print("VOZ-RECUSOU")\nraise SystemExit(1)\n')
        r = self.correr('Acrescenta: frases\n')
        self.assertEqual(r.returncode, 1); self.assertIn('VOZ-RECUSOU', r.stdout)

    def test_selecao_dos_guioes_e_argumentos(self):
        for modo, listas, voz in [('nada', False, False), ('linhas', True, False), ('frases', False, True), ('linhas e frases', True, True)]:
            r = self.correr('Acrescenta: ' + modo + '\n')
            self.assertEqual(r.returncode, 0, r.stderr)
            self.assertEqual('LISTAS-EXECUTADAS' in r.stdout, listas)
            self.assertEqual('VOZ-EXECUTADA' in r.stdout, voz)
        r = self.correr('Acrescenta: linhas\n', OEDP_LINHA_IRMA='')
        self.assertEqual(r.returncode, 9); self.assertIn('OEDP_LINHA_IRMA', r.stderr)


if __name__ == '__main__':
    unittest.main(verbosity=2)
