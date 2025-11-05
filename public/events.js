export async function onRequestGet({ env }) {
 
  const events = [
    { id: 'e1', title: 'Mental Health Workshop', start: '2025-11-05T10:00:00Z' },
    { id: 'e2', title: 'Peer Support Session', start: '2025-11-12T09:00:00Z' },
  ]
  return new Response(JSON.stringify(events), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}
