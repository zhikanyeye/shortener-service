import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BingWallpaper from '../components/BingWallpaper';
import AnimatedButton from '../components/AnimatedButton';

const EXPIRY_OPTIONS = [
  { value: 2592000, label: '30天', adminOnly: false },
  { value: 5184000, label: '60天', adminOnly: false },
  { value: 15552000, label: '180天', adminOnly: false },
  { value: 31536000, label: '1年', adminOnly: false },
  { value: 0, label: '永久', adminOnly: true },
];

export default function Home() {
  const [formData, setFormData] = useState({
    url: '',
    customSlug: '',
    expiresIn: '2592000', // 默认30天
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formData.url,
          slug: formData.customSlug || undefined,
          expiresIn: parseInt(formData.expiresIn),
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '创建失败');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('创建失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BingWallpaper />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              短链接服务
            </motion.h1>
            <motion.p
              className="text-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              将长链接转换成简短的、易于分享的链接
            </motion.p>
          </div>

          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* 表单内容... */}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
