// medicoes/m9-a-cadeia.mjs — medição 9: a cadeia (npm run verify, npm run typecheck).
import { spawnSync } from 'node:child_process';

function correr(cmd, args, cwd) {
  const inicio = Date.now();
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const duracaoMs = Date.now() - inicio;
  return {
    comando: `${cmd} ${args.join(' ')}`,
    codigoDeSaida: r.status,
    duracaoMs,
    stdoutFim: (r.stdout || '').split('\n').slice(-25).join('\n'),
    stderrFim: (r.stderr || '').split('\n').slice(-25).join('\n'),
  };
}

export async function medir({ repoRoot }) {
  const verify = correr('npm', ['run', 'verify'], repoRoot);
  const typecheck = correr('npm', ['run', 'typecheck'], repoRoot);

  // ---- caso vermelho plantado: prova que o captador de código de saída
  // distingue 0 de não-0, correndo um comando que falha de propósito pelo
  // MESMO caminho (`spawnSync`) que os dois de cima. ----------------------
  const falhaDeProposito = correr('node', ['-e', 'process.exit(7)'], repoRoot);
  const sucessoDeProposito = correr('node', ['-e', 'process.exit(0)'], repoRoot);

  return {
    medicao: 9,
    verify,
    typecheck,
    conforme: verify.codigoDeSaida === 0 && typecheck.codigoDeSaida === 0,
    casoConhecido: {
      descricao: 'dois comandos `node -e "process.exit(N)"`, N=7 e N=0, corridos pelo mesmo captador de código de saída.',
      falhaDeProposito: { codigoDeSaida: falhaDeProposito.codigoDeSaida },
      viuVermelho: falhaDeProposito.codigoDeSaida === 7,
      sucessoDeProposito: { codigoDeSaida: sucessoDeProposito.codigoDeSaida },
      confirmaQueZeroTambemPassa: sucessoDeProposito.codigoDeSaida === 0,
    },
  };
}
