import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './index.scss';

interface NavigationProps {}
interface NavigationState {}

const Navigation: React.FC<NavigationProps> = () => {
  const navigationItems = [
    {
      to: '/',
      label: '首页',
      end: true,
    },
    {
      to: '/todo-list',
      label: '待办事项',
    },
    {
      to: '/virtual-dom',
      label: '虚拟列表固定高度',
    },
    {
      to: '/traditional-virtual-dom',
      label: '传统虚拟列表固定高度',
    },
  ];
  return (
    <nav className="navigation">
      <ul className="navigation-list">
        {navigationItems.map((item) => (
          <li key={item.to} className="navigation-item">
            <NavLink 
             to={item.to}
             className={({ isActive }) => isActive ? 'navigation-link navigation-item-active' : 'navigation-link'}
             end={item.end}
             >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;