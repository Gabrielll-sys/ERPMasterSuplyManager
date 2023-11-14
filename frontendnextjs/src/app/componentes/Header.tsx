"use client"
import React from "react";
import Image from "next/image";



const Header= ()=>{

return(

    <header  className=" h-24 bg-master_color">

<Image src={require('../assets/logo.png')} width={120} height={103} alt="oiiii"/>

    </header>

)


}
export default Header;
