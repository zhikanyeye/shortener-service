// 管理员认证函数
export async function adminAuth(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const session = cookie.match(/session=([^;]+)/)?.[1];

  if (!session || !await env.KV.get(`admin_session:${session}`)) {
    return new Response('请先登录', { 
      status: 302,
      headers: { 'Location': '/login' }
    });
  }
  
  return null; // 认证通过
}

// 管理路由处理函数
export async function handleAdminRoutes(request, env) {
  const url = new URL(request.url);

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

// 处理管理员登录
export async function handleAdminLogin(request, env) {
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
