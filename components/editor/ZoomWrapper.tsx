import React, { useState } from "react";

interface ZoomWrapperProps {
  renderToolbar: (zoomLevel: number, setZoomLevel: React.Dispatch<React.SetStateAction<number>>) => React.ReactNode;
  children: React.ReactNode;
}

export const ZoomWrapper: React.FC<ZoomWrapperProps> = ({ renderToolbar, children }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  return (
    <>
      {renderToolbar(zoomLevel, setZoomLevel)}
      <div 
        className="transition-transform duration-200 ease-in-out origin-top"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        {children}
      </div>
    </>
  );
};
