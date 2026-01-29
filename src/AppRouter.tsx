import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import HomePage from './pages/home-page';
import CounterPage from './pages/counter-page';
import TodoListPage from './pages/todo-list-page';
import VirtualListFixedPage from './pages/virtual-list-fixed-page';

interface AppRouterProps {}

const AppRouter: React.FC<AppRouterProps> = () => {
  return (
    <Routes>
        <Route path="/" element={<CounterPage />} />
        <Route path="/todo-list" element={<TodoListPage />} />
        <Route path="/virtual-dom" element={<VirtualListFixedPage />} />
        <Route path="/*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
