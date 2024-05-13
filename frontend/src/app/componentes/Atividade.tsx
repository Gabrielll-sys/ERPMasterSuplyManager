"use client"
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, Textarea, useDisclosure } from '@nextui-org/react';

import "dayjs/locale/pt-br";
import { Table } from 'flowbite-react';
import { useState } from "react";

import { uploadImageToAzure } from "@/app/services/Images.Services";
import Image from "next/image";



// @ts-ignore
 const Atividade = ({ atividade, onUpdate,onDelete,isFinished})=>{
    const [imageModal,setImageModal] = useState<any>()
    const[observacoes,setObservacoes] = useState<string>(atividade.observacoes)
    const [checkboxStatus, setCheckboxStatus] = useState(atividade.status);
    const [descricao, setDescricao] = useState(atividade.descricao);
   
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [image,setImage] = useState<File[]>([]);


    const handleInputChange = () => {
        onUpdate(atividade, checkboxStatus, observacoes,descricao);
         }

     const handleDeleteAtividade = (id:number)=>{
        onDelete(id)
     }
    const readImageFromFile = async (file:File): Promise<string> =>  {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }
    const handleImageChange =  async (event :any) => {
        const selectedImage: File = event.target.files[0];


            // const res =  await uploadImageToAzure(imgBlob,selectedImage.name);


        if(selectedImage !=undefined){
            const image =  readImageFromFile(selectedImage).then( async (imgBlob)=>{
                await uploadImageToAzure(imgBlob,selectedImage.name)

            })
            setImage(current=>[...current,selectedImage]);
        }
    };
    return(


<>


        <Table  hoverable striped className="w-[100%]  ">
            <Table.Head className="border-1 border-black  text-center p-3 ">
                <p className="text-base p-3 font-bold">Atividade</p>
            </Table.Head>
        <Table.Body className="divide-y">

                    <Table.Row  className=" dark:border-gray-700 dark:bg-gray-800 ">

                                                    <Table.Cell className="text-left text-black border-1 border-black " >

                                                        <div className="flex flex-col max-sm:gap-8 md:gap-6">

                                                            <div className="flex flex-col gap-5">
                                                                <p className="md:text-2xl max-sm:text-[20px]"> Nº {atividade.numeroAtividade} - {atividade.descricao} </p>
                                                                <Input className='bg-transparent max-sm:w-[200px] md:w-[250px]'
                                                                  isReadOnly = {isFinished}
                                                                  value={descricao}
                                                                  onValueChange={setDescricao}
                                                                
                                                                 />
                                                            </div>


                                                            <div className="flex md:flex-row gap-4 max-sm:flex-col ">
                                                                <Checkbox color="success"
                                                                            isReadOnly = {isFinished}

                                                                          isSelected={checkboxStatus == "Não Iniciada"}
                                                                          onValueChange={() => setCheckboxStatus("Não Iniciada")}>
                                                                    Não Iniciada
                                                                </Checkbox>

                                                                <Checkbox
                                                                            isReadOnly = {isFinished}

                                                                    color="success"
                                                                    isSelected={checkboxStatus == "Em Andamento"}
                                                                    onValueChange={() => setCheckboxStatus("Em Andamento")}>
                                                                    Em Andamento
                                                                </Checkbox>

                                                                <Checkbox
                                                                    isReadOnly = {isFinished}
                                                                    color="success" isSelected={checkboxStatus == "Concluída"}
                                                                    onValueChange={() => setCheckboxStatus("Concluída")}>
                                                                    Concluída
                                                                </Checkbox>
                                                            </div>

                                                            <Textarea
                                                                            isReadOnly = {isFinished}

                                                                placeholder="Observaçoes Sobre a Atividade"
                                                                className="w-full p-3 rounded-base  bg-transparent shadow-sm shadow-black"
                                                                rows={5}
                                                                value={observacoes}
                                                                onValueChange={setObservacoes}
                                                            />
                                                            {!isFinished && (
                                                                <>

                                                            <div className="flex flex-row max-sm:flex-col gap-6 mx-auto">
                                                            <Button
                                                                color="primary"
                                                                variant="solid"
                                                                onPress={handleInputChange}
                                                                className="w-[120px] self-center"
                                                            >
                                                                Salvar

                                                            </Button>

                                                            <Button
                                                                color="danger"
                                                                variant="solid"
                                                                onPress={()=>handleDeleteAtividade(atividade.id)}
                                                                className="w-[120px] self-center"
                                                            >
                                                                Deletar Atividade

                                                            </Button>
                                                            </div>
                                                                </>
                                                            )}
                                                            {/* <Input className="w-[145px]" type="file"
                                                                   onChange={handleImageChange}/>
                                                            <div
                                                                className=" flex md:flex-row max-sm:flex-col flex-wrap max-sm:items-center gap-4 mx-auto ">

                                                                {image && image.map((x: File, index: number) => (
                                                                    <Button key={index}
                                                                            className="bg-white h-full hover:-translate-y-2  "
                                                                            onPress={() => {
                                                                                onOpenChange(), setImageModal(URL.createObjectURL(x))
                                                                            }}>

                                                                        <Image className="my-auto " key={index} height={150} width={150}
                                                                               src={URL.createObjectURL(x)} alt={"sa"}/>
                                                                    </Button>
                                                                ))}

                                                            </div> */}
                                                        </div>
                                                    </Table.Cell>

                                                </Table.Row>

                        </Table.Body>

                    </Table>

    <Modal isOpen={isOpen} backdrop="blur" size='xl' onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalBody className="flex flex-col gap-4 ">
                        <Image
                            width={200} height={200} className= "hover:scale-30 max-sm:mt-1 max-sm:w-full w-[400px] h-[400px] self-center" src={imageModal} alt="" />
                        <p className='text-center font-bold'>
                            Aqui será descricao da imagem
                        </p>
                        <Button
                            color="primary"
                            variant="ghost"
                            onPress={()=>console.log("dfds")}
                            className="w-[120px] self-center"
                        >
                            Excluir item

                        </Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Fechar
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
</>

    )



}
export default Atividade;