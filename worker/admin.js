export async function handleAdminRoutes(request, env) {
  const url = new URL(request.url);
  
  // 获取所有短链
  if(url.pathname === '/api/admin/links') {
    const { results } = await env.DB.prepare(`
      SELECT slug, url, created_at, expires 
      FROM links 
      ORDER BY created_at DESC
    `).all();
    
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 删除短链
  if(url.pathname.startsWith('/api/admin/links/')) {
    const slug = url.pathname.split('/').pop();
    await env.DB.prepare(`
      DELETE FROM links 
      WHERE slug = ?
    `).bind(slug).run();
    
    return new Response(null, { status: 204 });
  }

  return new Response('Not Found', { status: 404 });
}
