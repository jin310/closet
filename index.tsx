import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// 注册 Service Worker 以支持 PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('衣橱服务已就绪', reg))
      .catch(err => console.log('服务注册失败', err));
  });
}

// 简单的错误边界提示
const handleError = (msg: string) => {
  const root = document.getElementById('root');
  if (root && (root.innerHTML === '' || root.innerHTML.includes('正在开启'))) {
    root.innerHTML = `<div style="padding:40px;text-align:center;color:#666;font-family:sans-serif;">
      <p style="font-size:16px;">启动受阻</p>
      <p style="font-size:12px;color:#999;margin-top:8px;">请确保在现代浏览器中打开，或尝试刷新</p>
      <button onclick="location.reload()" style="margin-top:24px;padding:8px 24px;background:#000;color:#fff;border:none;border-radius:20px;font-size:12px;">重新加载</button>
    </div>`;
  }
};

window.onerror = (message, source, lineno, colno, error) => {
  console.error(error);
  handleError('Runtime Error');
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}