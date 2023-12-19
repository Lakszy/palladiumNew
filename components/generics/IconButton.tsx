// IconComponent.tsx
import React from "react";

interface IconComponentProps {
  icon: React.ReactElement;
  size?: number;
}

const IconComponent: React.FC<IconComponentProps> = ({ icon, size = 14 }) => (
  <div className="rounded-lg">
    <div className="h-full flex items-center justify-center rounded-lg border-2 bg-white p-2">
      {React.cloneElement(icon, { size })}
    </div>
  </div>
);

export default IconComponent;
