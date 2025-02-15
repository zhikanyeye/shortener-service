import { handleRequest } from './shortener';
import { handleAdminRoutes, adminAuth, handleAdminLogin } from './admin';

// 检查链接是否过期
async function checkExpired(env, slug) {
  const result = await env.DB.prepare(`
    SELECT expires_at 
    FROM links 
    WHERE slug = ?
  `).bind(slug).first();
  
  if (!result) return true;
  if (!result.expires_at) return false;
  
  return Date.now() / 1000 > result.expires_at;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 处理静态文件
    if (url.pathname === '/' || url.pathname === '/admin' || url.pathname === '/login') {
      const html = `<!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>短链服务 - 简单而强大的链接管理工具</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
          }
          #root {
            min-height: 100vh;
          }
          .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        </style>
      </head>
      <body class="bg-gray-50">
        <div id="root"></div>
        <script src="/dist.js"></script>
      </body>
      </html>`;
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    
    if (url.pathname === '/dist.js') {
      return new Response(distJs, {
        headers: { 'Content-Type': 'application/javascript' },
      });
    }
    
    // 管理路由处理
    if(url.pathname.startsWith('/api/admin')) {
      // 登录接口不需要认证
      if(url.pathname === '/api/admin/login') {
        return handleAdminLogin(request, env);
      }
      
      // 其他管理接口需要认证
      const authResponse = await adminAuth(request, env);
      if(authResponse) return authResponse;
      
      return handleAdminRoutes(request, env);
    }
    
    // 短链重定向
    if(!url.pathname.startsWith('/api/')) {
      const slug = url.pathname.slice(1);
      if(slug) {
        // 检查链接是否过期
        const expired = await checkExpired(env, slug);
        if(expired) {
          return new Response('Link has expired', { status: 410 });
        }
      }
    }
    
    // 短链API处理
    return handleRequest(request, env);
  }
};
