
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

async function mountApp() {
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err: any) {
    console.error("React Mount Failed:", err);
    // 如果渲染失败，手动调用全局错误显示函数
    if ((window as any).showError) {
      (window as any).showError(err.message || 'React 渲染引擎启动失败');
    }
  }
}

// 确保在 DOM 准备就绪后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
