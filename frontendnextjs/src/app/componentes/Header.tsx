"use client"
import React from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar ,Button} from "@nextui-org/react";
import Link from "next/link";

const Header= ()=>{
    const { data: session } = useSession();

return(

    <header  className=" h-24 bg-master_black">

<div className="ml-1  flex flex-row justify-between ">
    <Link href="/create-material">
    <Image  className="py-5 hover:scale-90" src={require('../assets/logo.png')} width={132} height={123} alt="logo master" />
    </Link>

{session && session.user ?(
<>
<div className="justify-end flex flex-row gap-4 mr-6 p-0">
<Avatar
className="hover:scale-110"
isBordered

radius="md"
name={session.user.name ?? ""}
src={session.user.image ?? ""}
/>


<Button className="text-white w-12 h-5 my-auto rounded-md hover:scale-x-110" variant="ghost" onClick={() => signOut()}>
                Sair
              </Button>

</div>

              </>

)

:

(
<Button className="mr-11 text-lg text-white rounded-md hover:scale-x-110" variant="ghost" onClick={() => signIn("google")}>
                Entrar
              </Button>)
}

</div>

    </header>

)


}
export default Header;
