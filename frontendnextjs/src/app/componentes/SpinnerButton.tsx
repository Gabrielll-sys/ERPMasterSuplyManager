import React from "react";

function SpinnerForButton(props:any) {
const classButton = "animate-spin h-10 w-10 text-current"
const classSpinnerForSearch = "animate-spin h-40 w-40 text-current"

  return (
    
    
    <svg
      className={props.tipo=="botao"?classButton:classSpinnerForSearch}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SpinnerForButton;