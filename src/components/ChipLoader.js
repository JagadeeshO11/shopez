import React from 'react';
import './ChipLoader.css';

const ChipLoader = () => {
  return (
    <div className="chip-loader-container">
      <div className="chip-loader">
        <div className="chip-core">
          <div className="chip-inner"></div>
        </div>
        <div className="data-flow data-flow-top"></div>
        <div className="data-flow data-flow-right"></div>
        <div className="data-flow data-flow-bottom"></div>
        <div className="data-flow data-flow-left"></div>
      </div>
      <p className="loading-text">Processing...</p>
    </div>
  );
};

export default ChipLoader;
