// Card dos produtos dentro do carrinho
import React, { useContext, useEffect, useState } from "react";

import {
  Button,
  Modal,
  useDisclosure,
  ModalContent,
  ModalBody,
  ModalFooter,
  Tooltip,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import IconBxTrashAlt from "@/app/assets/icons/IconBxTrashAlt";




export default function CardImageAtividadeRd({ ...props }: any) {


  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();

  // Modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();



  useEffect(() => {


  }, []);



  // Remove item e atualiza LocalStorage
  function handleRemoveItemCart(id: string, nome: string): void {

  }

  return (



        <>
          <div className="flex flex-col lg::flex-row justify-between w-[400px] my-1 gap-3 border-1 border-black shadow-black shadow-medium">
            <div className="flex flex-row justify-between w-full h-[330px] ">

            <Image  className=" hover:scale-30 max-sm:mt-1 max-sm:w-full w-full h-full self-center" src={require('../assets/mpw18.jpg')} alt="" />
            </div>
            <p className="text-center mb-6">OIIII</p>

          </div>

        </>
      )

}
