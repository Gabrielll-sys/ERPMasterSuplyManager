import React from "react";




const Header= ({props})=>{

return(

    <header >
    <img  style={{width: "120px",
height: "50px",
marginLeft:"10px",
marginTop: "12px"}} src={require('../assets/logo.png')}  alt="logo.png"/>
    </header>


)


}

export default Header;