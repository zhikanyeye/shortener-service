export async function handleRequest(request, env) {
  const url = new URL(request.url);
  
  // 短链跳转
  if (url.pathname.length === 7) {
    const slug = url.pathname.slice(1);
    const result = await env.DB.prepare(`
      SELECT url, expires 
      FROM links 
      WHERE slug = ? AND (expires > ? OR expires IS NULL)
    `)
    .bind(slug, Math.floor(Date.now()/1000))
    .first();

    return result 
      ? Response.redirect(result.url, 302)
      : new Response('链接已过期', { status: 404 });
  }

  // 创建短链
  if (url.pathname === '/api/create') {
    const { url: longUrl, slug, duration } = await request.json();
    
    // 生成随机slug
    const finalSlug = slug || generateSlug(6);
    const expires = duration ? 
      Math.floor(Date.now()/1000) + duration * 86400 : 
      null;

    try {
      await env.DB.prepare(`
        INSERT INTO links (slug, url, expires)
        VALUES (?, ?, ?)
      `).bind(finalSlug, longUrl, expires).run();
      
      return new Response(JSON.stringify({ slug: finalSlug }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response('短链已存在', { status: 409 });
    }
  }

  return new Response('Not Found', { status: 404 });
}

function generateSlug(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(byte => chars[byte % chars.length])
    .join('');
}
