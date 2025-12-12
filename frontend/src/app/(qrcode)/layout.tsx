import React from "react";
import Footer from "../componentes/Footer";


export default function GenerateMaterialQRCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className=" mx-auto mb-48 ">
    
    {children}
    <Footer/>
  </div>;

}
