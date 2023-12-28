import React from "react";
interface IconComponentProps {
  icon: React.ReactElement;
  size?: number;
}
const IconComponent: React.FC<IconComponentProps> = ({ icon, size = 28 }) => (
  <div className="rounded-lg">
    <div className="w-[72px] h-[66.01px] px-[27px] py-[18px] bg-white rounded-[22px] border border-stone-200 justify-start items-start gap-2.5 inline-flex">
      {React.cloneElement(icon, { size })}
    </div>
  </div>
);

export default IconComponent;
