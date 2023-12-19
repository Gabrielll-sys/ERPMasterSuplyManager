import React from "react";
import Footer from "../componentes/Footer";

export default function UpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto pb-20">
    
    {children}
    <Footer/>
  </div>;

}
