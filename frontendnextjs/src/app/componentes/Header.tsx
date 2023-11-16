"use client"
import React from "react";
import Image from "next/image";



const Header= ()=>{

return(

    <header  className=" h-24 bg-master_black">

<div className="ml-6">
    <Image src={require('../assets/logo.png')} width={120} height={103} alt="logo master" />
</div>

    </header>

)


}
export default Header;
