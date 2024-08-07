"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Navbar
} from "@nextui-org/react";
import IconPersonFill from "../assets/icons/IconPersonFill";
import { authenticate, getUserLocalStorage } from "../services/Auth.services";
import { isTokenValid } from "../services/Auth.services";
import { useRouter } from "next/navigation";
import IconExit from "../assets/icons/IconExit";
import IconSideBar from "../assets/icons/IconSideBar";
import SideBarLFT from "./SideBarLFT";

 const NavBar= ()=>{

    const route = useRouter()
    const iconClasses = "h-4 text-2xl";
    const [showSideBar,setShowSideBar]= useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    
    useEffect(() => {
    
        const user = getUserLocalStorage()

    if(user != null)
    {
        setCurrentUser(user)

    }
  else{
      route.push('/login')
    }
    }, []);
 
  
    useEffect(()=>{
        //@ts-ignore

        const user = JSON.parse(localStorage.getItem("currentUser"));

        if( user == null) setCurrentUser(null)
      

        if (!isTokenValid(user?.token)){
            route.push("/login")
        }
         else{
            //  route.push("/create-material")
        
         }


    },[currentUser])

    const signOut = ()=>
    {

        localStorage.clear()
        setCurrentUser(null)
        //@ts-ignore
        const current = JSON.parse(localStorage.getItem('currentUser'));


        route.push("/login")


    }
    return(
        <>


            <Navbar shouldHideOnScroll
                    maxWidth="full"
                    className=" h-24  max-sm:h-20 bg-master_black font-bold justify-between ">

                <div className="  flex flex-row  h-full w-full justify-between ">
                    {currentUser ? (

                    <Button  onMouseEnter={x=>setShowSideBar(true)} className="bg-master_black my-auto " >
                        <IconSideBar  className=" rounded-lg h-10 text-white"  />
                    </Button>
                    ):(
                        <p></p>
                    )}

                    { showSideBar && (

                        <div   className="absolute left-1 z-10" onMouseLeave={()=>setShowSideBar(false)}>
                            <SideBarLFT onMouseLeave={()=>setShowSideBar(false)}/>
                        </div>


                    )}


                    {currentUser != null ? (

                            <Dropdown className="p-2 rounded-md shadow-none border-2 border-black">
                                <DropdownTrigger>

                                    <p className="font-semibold text-white my-auto mr-6 hover:underline  max-sm:text-[18px] md:text-[23px] p-3">
                                        {currentUser.userName}
                                    </p>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Profile Actions"

                                    color="success"
                                    disabledKeys={[""]}
                                >
                                    <DropdownItem
                                        key="my-account"
                                        color="danger"
                                        variant="bordered"
                                        className="bg-light mt-2 "
                                        endContent={<IconPersonFill className={iconClasses}/>}
                                        onClick={() => route.push("/my-account")}
                                    >
                                        <p className="text-base p-1 hover:underline">Minha Conta</p>

                                    </DropdownItem>
                                    <DropdownItem
                                        key="my-account"
                                        color="danger"
                                        variant="bordered"
                                        className="bg-light mt-2 "
                                        endContent={<IconPersonFill className={iconClasses}/>}
                                        onClick={() => route.push("/my-tasks")}
                                    >
                                        <p className="text-base p-1 hover:underline">Minhas Tarefas Diárias</p>

                                    </DropdownItem>

                                    <DropdownItem
                                        key="logout"
                                        color="danger"
                                        endContent={<IconExit className = {iconClasses} />}
                                        onClick={() => signOut()}
                                    >
                                        <p className="text-base p-1 hover:underline">Sair</p>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                        )

                        :

                        (
                            <Link className="mr-11 max-sm:mr-6 max-sm:text-base text-lg text-white rounded-md hover:scale-x-110 hover:underline my-auto" href="/login" >
                                Entrar
                            </Link>)
                    }
                </div>

            </Navbar>

        </>
    )


}
export default NavBar;