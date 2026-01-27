
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

const initApp = () => {
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Wardrobe App: Render initiated successfully.");
  } catch (err: any) {
    console.error("React Mounting Crash:", err);
    if ((window as any).showError) {
      (window as any).showError(err.message || 'React 渲染引擎启动失败');
    }
  }
};

// 确保在所有资源就绪后执行
if (document.readyState === 'complete') {
  initApp();
} else {
  window.addEventListener('load', initApp);
}
