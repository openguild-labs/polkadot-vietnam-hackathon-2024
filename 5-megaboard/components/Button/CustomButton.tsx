import React from 'react';
import './Button40.css'; // Import CSS for button styles
interface Pros{
    onclick:()=>void
    content:string
}
const CustomButton = ({ content, onclick }:Pros) => {
  return (
    <button className="button-40" role="button" onClick={onclick}>
      <span className="text">{content}</span>
    </button>
  );
};

export default CustomButton;
