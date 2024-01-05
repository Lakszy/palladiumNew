import React, { ReactNode, ReactElement } from 'react';
import { FiMessageSquare } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";
interface CircleButtonProps {
  children: ReactNode;
  icon: ReactElement; 
}

const CircleButton: React.FC<CircleButtonProps> = ({ children, icon }) => {
  return (
    <div className="h-12 w-12 hidden lg:block  lg:items-center justify-center rounded-lg border-2 bg-white p-3.5">
      {icon}
      {children}
    </div>
  );
};

export default CircleButton;
