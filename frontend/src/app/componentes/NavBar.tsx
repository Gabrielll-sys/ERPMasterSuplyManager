"use client"
import React, {useState, useRef, useEffect} from "react";
import { useReactToPrint } from 'react-to-print';
import Link from "next/link";
import Image from "next/image";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
    Button,
    NavbarItem,
} from "@nextui-org/react";

import { Sidebar } from 'flowbite-react';
import IconQrCode from '@/app/assets/icons/IconQrCode';

import { useRouter } from "next/navigation";
import IconExit from "../assets/icons/IconExit";
import AvatarLogin from "./AvatarLogin";
import IconUser from "../assets/icons/IconUser";
import TodoListPen from "../assets/icons/TodoListPen";
import IconFilter from "../assets/icons/IconFilter";
import IconMoneyBill from "../assets/icons/IconMoneyBill";
import IconSideBar from "../assets/icons/IconSideBar";
import SideBarLFT from "./SideBarLFT";
import {currentUser, removeUserLocalStorage} from "@/app/services/Auth.services";
import {jwtDecode} from "jwt-decode";
import {setNonce} from "get-nonce";

const NavBar= ()=>{

    const route = useRouter()
    const iconClasses = "h-4 text-2xl";
    const [showSideBar,setShowSideBar]= useState(false)
    const [userName,setUserName]= useState<string>("")

    useEffect(() => {

    currentUser?.userName !=undefined &&  setUserName(currentUser.userName)

    }, [currentUser]);

    const handleSideBar= ()=>{

        if(showSideBar){
            setShowSideBar(false)
        }

        else setShowSideBar(true)

    }

    useEffect(()=>{

        console.log(isTokenValid())
        if (!isTokenValid()){
            route.push("/login")
        }


    },[])
    const isTokenValid = () =>{
        if(currentUser){

            const decodedToken = jwtDecode(currentUser.token)

            const currentDate = Date.now()/1000
            console.log(decodedToken.exp)
            console.log(currentDate)

            return decodedToken.exp?  decodedToken.exp > currentDate  : false;
        }
    }
    const signOut = ()=>
    {

        removeUserLocalStorage().then(r => route.push("/login") );

    }
    return(
        <>


            <Navbar shouldHideOnScroll
                    maxWidth="full"
                    className=" h-24  bg-master_black font-bold justify-between ">

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


                    {currentUser && currentUser.userName ? (

                            <Dropdown className="p-0 rounded-md shadow-none border-2 border-black">
                                <DropdownTrigger>

                                    <p className="font-semibold text-white my-auto mr-6 hover:underline text-[20px] p-3">
                                        {currentUser.userName}
                                    </p>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Profile Actions"
                                    variant="bordered"
                                    className="bg-light mt-2 "
                                    color="success"
                                    disabledKeys={[""]}
                                >

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