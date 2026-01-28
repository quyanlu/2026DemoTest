import React from 'react';
import Counter from '../../components/counter';
import './index.scss';

interface CounterPageProps {}

const CounterPage: React.FC<CounterPageProps> = () => {
  return (
    <div className="page">
      <h2>计数器演示</h2>
      <Counter />
    </div>
  );
};

export default CounterPage;