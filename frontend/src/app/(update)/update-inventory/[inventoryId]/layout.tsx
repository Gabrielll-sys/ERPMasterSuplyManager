import React from "react";
import Footer from "@/app/componentes/Footer";

export default function UpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto pb-40">
    
    {children}
    <Footer/>
  </div>;

}
