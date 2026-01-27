
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 关键修复：防止某些模块寻找 process 对象而报错
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: { NODE_ENV: 'production' } };
}

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App mounted successfully");
  } catch (err) {
    console.error("Mounting error:", err);
    if ((window as any).displayFatalError) {
      (window as any).displayFatalError(err);
    }
  }
};

// 立即尝试启动，不再等待 load 事件以减少被拦截概率
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startApp();
} else {
  window.addEventListener('DOMContentLoaded', startApp);
}
