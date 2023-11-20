import React from "react";
import Link from "next/link";



const NavBar= ()=>{

return(

   <div className="flex flex-row justify-center mt-5">

<Link href="/create-material">

    <p className="text-lg font-bold ml-10 hover:text-master_yellow hover:font-extrabold">Criar Materiais</p>
</Link>
<Link href="/search-inventory">

    <p className="text-lg font-bold ml-10 hover:text-master_yellow">Gerenciamento de Inventário</p>
</Link>
<Link href="/os-management">

    <p className="text-lg font-bold ml-10 hover:text-master_yellow">Gerenciamento de OS</p>
</Link>

   </div>

)


}

export default NavBar;