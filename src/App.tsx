import React from 'react';
import Counter from './components/Counter';

function App(): React.ReactElement {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Webpack5 Demo</h1>
        <p>这是一个使用 React 和 Webpack5 搭建的演示项目</p>
      </header>
      <main className="app-main">
        <Counter />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} React Webpack5 Demo</p>
      </footer>
    </div>
  );
}

export default App;
