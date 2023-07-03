import React, { useState } from "react";
import "./Tooltip.css";

const Tooltip = ({ children, content }) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="tooltip-container"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active && <div className="tooltip">{content}</div>}
    </div>
  );
};

export default Tooltip;
