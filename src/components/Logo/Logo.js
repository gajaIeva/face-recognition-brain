import React from "react";
import Tilty from "react-tilty";
import "./Logo.css";
import brain from "./brain.png";

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilty className="tilty br2 shadow-2" max={55}>
        <div className="inner">
          <img src={brain} alt="brain"></img>
        </div>
      </Tilty>
    </div>
  );
};

export default Logo;
