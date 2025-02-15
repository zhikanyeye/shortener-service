import { handleRequest } from './shortener';
import { handleAdminRoutes, adminAuth, handleAdminLogin } from './admin';

// 处理静态文件
async function handleStaticFile(url) {
  const publicFiles = {
    '/': '/public/index.html',
    '/dist.js': '/public/dist.js',
  };

  const filePath = publicFiles[url.pathname] || url.pathname;
  
  // 如果是根路径，返回 index.html
  if (url.pathname === '/') {
    return new Response(indexHtml, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
  }

  // 如果是dist.js，返回构建后的js文件
  if (url.pathname === '/dist.js') {
    return new Response(distJs, {
      headers: {
        'content-type': 'application/javascript',
      },
    });
  }

  return null;
}

// HTML 内容
const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>短链服务</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script src="/dist.js"></script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 首先尝试处理静态文件
    const staticResponse = await handleStaticFile(url);
    if (staticResponse) return staticResponse;
    
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
    
    // 短链路由处理
    return handleRequest(request, env);
  }
};
