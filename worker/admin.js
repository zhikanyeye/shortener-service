export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);

  // 处理登录
  if (url.pathname === '/api/admin/login') {
    const { username, password } = await request.json();
    
    if (username !== env.ADMIN_USER || password !== env.ADMIN_PASS) {
      return new Response('认证失败', { status: 401 });
    }

    const sessionId = crypto.randomUUID();
    await env.KV.put(`admin_session:${sessionId}`, 'valid', {
      expirationTtl: 86400 // 1天有效期
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Set-Cookie': `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax`
      }
    });
  }

  // 验证管理员身份
  const cookie = request.headers.get('Cookie') || '';
  const session = cookie.match(/session=([^;]+)/)?.[1];

  if (!session || !await env.KV.get(`admin_session:${session}`)) {
    return new Response('请先登录', { 
      status: 302,
      headers: { 'Location': '/login' }
    });
  }

  // 获取所有短链
  if (url.pathname === '/api/admin/links') {
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
  if (url.pathname.startsWith('/api/admin/links/')) {
    const slug = url.pathname.split('/').pop();
    await env.DB.prepare(`
      DELETE FROM links 
      WHERE slug = ?
    `).bind(slug).run();
    
    return new Response(null, { status: 204 });
  }

  return new Response('Not Found', { status: 404 });
}
