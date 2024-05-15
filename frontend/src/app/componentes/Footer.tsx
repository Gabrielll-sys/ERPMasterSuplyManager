"use client";



export default function Footer({ children, ...props }: any) {
  return (
    <footer className="fixed  bottom-0 max-sm:h-20 left-0 w-screen " {...props}>
      <div className="grid grid-cols-2  bg-master_black text-light text-tiny h-32">
        <div className=" ml-2 p-6 max-sm:p-[10px] flex flex-col gap-1">
          <p className="max-sm:min-w-[120px]">
            <strong>MASTER ELÉTRICA</strong>
          </p>
          <br />
          <p className="max-sm:pt-[-20px] max-sm:min-w-[200px]  ">Feito em Santa Luzia, Minas Gerais</p>
          <p className=" max-sm:min-w-[200px] max-sm:ml-10 ">&copy; 2018-2024</p>
        </div>
       
   
      </div>
    </footer>
  );
}