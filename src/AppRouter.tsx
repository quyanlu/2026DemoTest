import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import HomePage from './pages/home-page';
import CounterPage from './pages/counter-page';
import TodoListPage from './pages/todo-list-page';

interface AppRouterProps {}

const AppRouter: React.FC<AppRouterProps> = () => {
  return (
    <Routes>
        <Route path="/" element={<CounterPage />} />
        <Route path="/todo-list" element={<TodoListPage />} />
    </Routes>
  );
};

export default AppRouter;
