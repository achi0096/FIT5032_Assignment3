export async function onRequestGet() {
  const resources = [
    { id: 'r1', title: 'Youth Helpline', url: 'https://example.org/helpline' },
    { id: 'r2', title: 'Crisis Plan Template', url: 'https://example.org/crisis-plan' },
  ]
  return new Response(JSON.stringify(resources), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}
