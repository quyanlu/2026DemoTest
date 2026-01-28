import React from 'react';
import Navigation from './components/navigation';
import AppRouter from './AppRouter';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Webpack5 Demo</h1>
        <p>这是一个使用 React 和 Webpack5 搭建的演示项目</p>
        <Navigation />
      </header>
      <main className="app-main">
        <AppRouter />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} React Webpack5 Demo</p>
      </footer>
    </div>
  );
};

export default App;