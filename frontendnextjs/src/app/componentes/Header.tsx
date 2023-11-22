"use client"
import React from "react";
import Image from "next/image";



const Header= ()=>{

return(

    <header  className=" h-24 bg-master_black">

<div className="ml-1">
    <Image  className="py-5" src={require('../assets/logo.png')} width={132} height={123} alt="logo master" />
</div>

    </header>

)


}
export default Header;
