import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="counter">
      <h2>计数器</h2>
      <div className="counter-display">
        <h3>{count}</h3>
      </div>
      <div className="counter-controls">
        <button onClick={increment} className="btn btn-primary">
          +
        </button>
        <button onClick={decrement} className="btn btn-secondary">
          -
        </button>
        <button onClick={reset} className="btn btn-reset">
          重置
        </button>
      </div>
    </div>
  );
}

export default Counter;
