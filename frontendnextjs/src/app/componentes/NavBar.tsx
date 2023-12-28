import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { usePathname } from 'next/navigation'
import clsx from "clsx";
import GoogleIcon from "../assets/icons/GoogleIcon";


const NavBar= ()=>{
const rota = usePathname()

return(

   <div className="flex flex-row justify-center mt-5 gap-24">

<Link href="/create-material " >

    <div className="flex flex-row">
        <p className={clsx(
            "text-lg",
        {
            "underline font-extrabold":rota=="/create-material"
        }
        )} >Criar Materiais</p>
        <GoogleIcon className="mt-1.5 ml-2" />
        
    </div>
</Link>
<Link href="/search-inventory">

    <p className={clsx(
        "text-lg font-bold ",
    {
        "underline font-extrabold":rota=="/search-inventory"
    }
    )}>Gerenciamento de Inventário</p>
</Link>
{/* <Link href="/managing-os">

    <p className={clsx(
        "text-lg font-bold   ",
    {
        "underline font-extrabold":rota=="/managing-os"
    }
    )}>Gerenciamento de OS</p>
</Link> */}


   </div>

)


}

export default NavBar;