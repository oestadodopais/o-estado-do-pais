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
                                               'ATERRAR_LOTE_EXTRA': '', 'ATERRAR_SEM_CUSTO': ''})
        self.ambiente.start(); self.addCleanup(self.ambiente.stop)

    def test_blocos_prefixos_e_ausencias(self):
        with patch.object(aterrar, 'git', side_effect=['b' * 40, 'A1-1: conteúdo\nB1: conteúdo\nLote-r: registos']):
            self.a.conferir_blocos()
        self.assertEqual(self.a.recibo['blocos'], ['A1', 'B1'])
        for assuntos, motivo in [('A1: só um', 'sem commit'), ('A1: um\nB1: dois\nX1: surpresa', 'fora dos blocos')]:
            with patch.object(aterrar, 'git', side_effect=['b' * 40, assuntos]), self.assertRaises(aterrar.Parar) as e:
                self.a.conferir_blocos()
            self.assertIn(motivo, e.exception.motivo)
        with patch.dict(os.environ, OEDP_BLOCOS=''), self.assertRaises(aterrar.Parar) as e:
            self.a.conferir_blocos()
        self.assertIn('falta OEDP_BLOCOS', e.exception.motivo)

    def test_custo_um_por_bloco(self):
        self.a.recibo['blocos'] = ['A1', 'B1']
        nomes = []
        for b in ('A1', 'B1'):
            p = self.p / f'design/especime-v3/medicoes/{b}/custo-2026-10-29.json'
            p.parent.mkdir(parents=True); p.write_text(json.dumps({'bloco': b}))
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

    def test_pre_mandato_exige_declaracao_e_corre_ambos(self):
        m = modulo('pre-mandato'); p = self.p / 'mandato.md'; p.write_text('Acrescenta: linhas\n')
        with patch.dict(os.environ, OEDP_ACRESCENTA='linhas', OEDP_LINHA_IRMA='irma'), patch.object(m.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0)) as r:
            self.assertEqual(m.main([str(self.p), str(p)]), 0)
            self.assertEqual(r.call_count, 2)
            self.assertTrue(r.call_args_list[0].args[0][1].endswith('listas-de-uma-linha.sh'))
            self.assertTrue(r.call_args_list[1].args[0][1].endswith('voz-do-mandato.py'))
        with patch.dict(os.environ, OEDP_ACRESCENTA='', OEDP_LINHA_IRMA=''):
            self.assertEqual(m.main([str(self.p), str(p)]), 9)


if __name__ == '__main__':
    unittest.main(verbosity=2)
