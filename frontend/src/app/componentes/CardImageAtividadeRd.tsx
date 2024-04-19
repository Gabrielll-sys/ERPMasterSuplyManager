// Card dos produtos dentro do carrinho
import React, { useContext, useEffect, useState } from "react";

import {
  Image,
  Button,
  Modal,
  useDisclosure,
  ModalContent,
  ModalBody,
  ModalFooter,
  Tooltip,
  Spinner,
} from "@nextui-org/react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";





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
          <div className="flex flex-col md:flex-row justify-between w-full my-1 gap-3">
            <div>
              <div
                className="image-container relative"
                style={{
                  height: "150px",
                  width: "200px",
                  overflow: "hidden",
                }}
              >
                {/*<Image*/}
                {/* */}
                {/*  className={`z-0 w-full h-full object-cover`}*/}
                {/*  src={require("../assets/banana.jpeg")}*/}
                {/*/>*/}
                <Image  className="py-5 hover:scale-30 max-sm:mt-1 max-sm:w-[100px] " src={require('../assets/logo_preta_sem_fundo.png')}  alt="logo master" />

              </div>
            </div>

            <div
              className="flex flex-col place-content-evenly justify-left h
            w-24"
            >
              <h2 className="my-2">sdfsd</h2>
              <p className="my-2">R$ dsfsdf</p>
            </div>

            <div className="flex flex-col place-content-evenly">
              <div className="my-2">

              </div>
              <div className="my-2">
                <Button
                  color="secondary"
                  variant="ghost"
                  onClick={() => onOpen()}
                >

                  Excluir item
                </Button>
              </div>
            </div>
          </div>


        </>
      )

}
