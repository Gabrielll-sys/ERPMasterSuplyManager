import React from "react";
import Footer from "../componentes/Footer";

export default function UpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto pb-20">
    
    {children}
    <Footer/>
  </div>;

}
