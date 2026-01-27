
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// 简单的错误边界提示
const handleError = (msg: string) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML.includes('正在启动')) {
    root.innerHTML = `<div style="padding:40px;text-align:center;color:#666;">
      <p>启动受阻</p>
      <p style="font-size:12px;color:#999;">请尝试关闭浏览器 AI 插件或使用无痕模式</p>
      <button onclick="location.reload()" style="margin-top:20px;padding:10px 20px;background:#000;color:#fff;border:none;border-radius:20px;">刷新重试</button>
    </div>`;
  }
};

window.onerror = () => handleError('Runtime Error');

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
