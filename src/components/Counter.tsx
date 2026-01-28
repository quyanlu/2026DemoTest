import React, { useState } from 'react';

function Counter(): React.ReactElement {
  const [count, setCount] = useState<number>(0);

  const increment = (): void => {
    setCount(count + 1);
  };

  const decrement = (): void => {
    setCount(count - 1);
  };

  const reset = (): void => {
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
