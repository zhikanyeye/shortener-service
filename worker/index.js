import { handleRequest } from './shortener';
import { handleAdminRoutes, adminAuth, handleAdminLogin } from './admin';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
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
