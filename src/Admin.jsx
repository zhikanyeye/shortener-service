import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from './utils';

export default function Admin() {
  const [links, setLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // 获取短链列表
  useEffect(() => {
    const fetchLinks = async () => {
      const res = await fetch('/api/admin/links');
      if(res.status === 401) return navigate('/login');
      const data = await res.json();
      setLinks(data);
    };
    fetchLinks();
  }, [navigate]);

  // 删除短链
  const handleDelete = async (slug) => {
    if(!confirm('确定要删除这个短链吗？')) return;
    
    const res = await fetch(`/api/admin/links/${slug}`, {
      method: 'DELETE'
    });
    
    if(res.ok) {
      setLinks(links.filter(link => link.slug !== slug));
    }
  };

  // 过滤搜索
  const filteredLinks = links.filter(link => 
    link.slug.includes(searchTerm) || 
    link.url.includes(searchTerm)
  );

  return (
    <div className="admin-container p-8 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="搜索短链..."
          className="p-2 border rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          返回首页
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">短链</th>
              <th className="p-3 text-left">原始链接</th>
              <th className="p-3 text-left">创建时间</th>
              <th className="p-3 text-left">过期时间</th>
              <th className="p-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map(link => (
              <tr key={link.slug} className="border-t">
                <td className="p-3">
                  <a 
                    href={`/${link.slug}`} 
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    {link.slug}
                  </a>
                </td>
                <td className="p-3 max-w-xs truncate">{link.url}</td>
                <td className="p-3">{formatDate(link.created_at)}</td>
                <td className="p-3">
                  {link.expires ? formatDate(link.expires) : '永久'}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(link.slug)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
