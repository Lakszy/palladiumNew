import React from 'react';
import './Tooltip.css';
import "../app/App.css"

const TooltipContent = () => (
  <div className="tooltip-content  z-10">
    <p className='body-text z-10 font-medium text-sm whitespace-nowrap'>SCR = System Collateral Ratio and it is :</p>
    <ul className='pt-6 space-y-1 z-10'>
      <li className='body-text font-medium text-xs'>1 red bar  – less than 110%  – recovery mode</li>
      <li className='body-text font-medium text-xs'>2 orange  – between 150% and 110%  – recovery</li>
      <li className='body-text font-medium text-xs'>3 yellow  – between 200% and 150%  – normal</li>
      <li className='body-text font-medium text-xs'>4-6 green  – above 200% –  normal mode</li>
    </ul>
    <p className='w300 body-text font-medium text-xs pt-5'>You can be liquidated below 150%. In order to help avoid liquidation in Normal Mode and Recovery Mode</p>
  </div>
);

export default TooltipContent;
