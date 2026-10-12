import origens from '../../data/pensao-rp4n.json';
export function GET() {
  const a = origens['pensao-legal'].alojada;
  return new Response(JSON.stringify({ pdf: a.motor, sha256: a.sha256, prova: a.prova_data }, null, 2) + '\n', {headers: {'Content-Type':'application/json'}});
}
