import React, { useState, useCallback } from 'react';
import TraditionalVirtualListFixed from '../../components/traditional-virtual-list-fixed';
import './index.scss';

/**
 * 列表项类型定义
 * 
 * @remarks
 * TypeScript 接口使用说明：
 * - 明确定义列表项的数据结构
 * - 提供完整的类型信息，支持代码提示和类型检查
 */
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

const TraditionalVirtualListFixedPage: React.FC = () => {
  const [users] = useState<User[]>(Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `用户 ${i}`,
    email: `user${i}@example.com`,
    avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${i}`,
  })));

  /**
   * 列表项渲染函数
   * 
   * @remarks
   * TypeScript 类型推断：
   * - item 参数自动推断为 User 类型
   * - 可以安全访问 item.id, item.name 等属性
   * - 编辑器会提供完整的代码提示
   * 
   * 使用 useCallback 缓存渲染函数，避免每次渲染时创建新函数
   * 提高虚拟滚动性能，减少卡顿
   */
  const renderItem = useCallback((item: User, index: number) => (
    <div key={item.id} className="virtual-list-fixed-page-item">
      <img src={item.avatar} alt={item.name} />
      <div className="virtual-list-fixed-page-item-content">
        <div className="virtual-list-fixed-page-item-content-name">{item.name}</div>
        <div className="virtual-list-fixed-page-item-content-email">{item.email}</div>
      </div>
    </div>
  ), []);


  return (
    <div className="virtual-list-fixed-page">
      <h2>虚拟列表固定高度演示</h2>
      <p>
        该组件演示了如何使用传统虚拟列表固定高度，未使用现在浏览器API。
      </p>
      <TraditionalVirtualListFixed
        items={users}
        height={400}
        itemHeight={60}
        overscan={5}
        renderItem={renderItem}
        className="virtual-list-fixed-container"
        itemClassName="virtual-list-fixed-user-item"
      />
    </div>
  );
};

export default TraditionalVirtualListFixedPage;