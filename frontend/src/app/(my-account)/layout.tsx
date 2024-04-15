import React from "react";
import Footer from "@/app/componentes/Footer";

export default function osManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className=" mx-auto mb-48   ">
    
    {children}
    <Footer />
  </div>;

}
