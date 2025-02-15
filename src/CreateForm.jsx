import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CreateForm() {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [duration, setDuration] = useState(30);
  const [result, setResult] = useState('');

  const createShortLink = async () => {
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url,
        slug: customSlug || undefined,
        duration: duration !== 'permanent' ? duration : null
      })
    });

    const data = await res.json();
    setResult(`${window.location.origin}/${data.slug}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="main-form"
    >
      <h1>短链生成器 🔗</h1>
      
      <div className="input-group">
        <input
          type="url"
          placeholder="输入长链接"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="settings">
        <input
          type="text"
          placeholder="自定义短链 (可选)"
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
        />
        
        <select 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="30">30天有效</option>
          <option value="60">60天有效</option>
          <option value="180">180天有效</option>
          <option value="365">1年有效</option>
          <option value="permanent">永久有效</option>
        </select>
      </div>

      <button onClick={createShortLink}>生成短链</button>

      {result && (
        <div className="result-box">
          <p>您的短链：</p>
          <a href={result} target="_blank">{result}</a>
        </div>
      )}
    </motion.div>
  );
}
