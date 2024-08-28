import React from 'react';
import './Tooltip.css';
import "../app/App.css"

const TooltipContent = () => (
  <div className="tooltip-content z-10">
    <p className="body-text z-10 font-medium text-sm whitespace-nowrap">
      SCR = System Collateral Ratio and it is:
    </p>
    <ul className="pt-6 space-y-1 z-10">
      <li className="body-text font-medium text-xs">1 {" "}
        <span className='font-medium' style={{ color: 'red', fontWeight: 'bold' }}>red</span> – less than 110% – recovery mode
      </li>
      <li className="body-text font-medium text-xs">2 {" "}
        <span className='font-medium' style={{ color: 'orange', fontWeight: 'bold' }}>orange</span> – between 150% and 110% – recovery
      </li>
      <li className="body-text font-medium text-xs">3 {" "}
        <span className='font-medium' style={{ color: 'yellow', fontWeight: 'bold' }}>yellow</span> – between 200% and 150% – normal
      </li>
      <li className="body-text font-medium text-xs">4-6 {" "}
        <span className='font-medium' style={{ color: 'green', fontWeight: 'bold' }}>green</span> – above 200% – normal mode
      </li>
    </ul>
    <p className="w300 body-text font-medium text-xs pt-5">
      You can be liquidated below 150%. In order to help avoid liquidation in Normal Mode and Recovery Mode
    </p>
  </div>
);


export default TooltipContent;
