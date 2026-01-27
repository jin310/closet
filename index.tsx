
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 暂时移除 Service Worker 以确保移动端能够加载最新代码，不被缓存干扰

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
