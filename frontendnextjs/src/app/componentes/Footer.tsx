"use client";
import React from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";



export default function Footer({ children, ...props }: any) {
  const route = useRouter();
  return (
    <footer className="fixed  bottom-0  left-0 w-screen " {...props}>
      <div className="grid grid-cols-2  bg-master_black text-light text-tiny h-32">
        <div className=" ml-2 p-6">
          <h3>
            <strong>MASTER ELÉTRICA</strong>
          </h3>
          <br />
          <p className="py-1">Feito em Santa Luzia, Minas Gerais</p>
          <p className="py-1">&copy; 2018-2023</p>
        </div>
       
   
      </div>
    </footer>
  );
}