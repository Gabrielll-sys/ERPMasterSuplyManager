"use client"
import ArrowLeft from "@/app/assets/icons/ArrowLeft";
import { getMaterialById, updateMaterial } from "@/app/services/Material.Services";
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { Autocomplete, AutocompleteItem, Link, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import IconArrowDownCircle from "@/app/assets/icons/IconArrowDownCircleFill";
import IconCamera from "@/app/assets/icons/IconCamera";
import { IImage } from "@/app/interfaces/IImage";
import { deleteImageFromAzure, getImageDimensions, uploadImageToAzure } from "@/app/services/Images.Services";
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react';
import { Flex, TextField } from "@radix-ui/themes";
import imageCompression from "browser-image-compression";
import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@radix-ui/themes";
export default function UpdateMaterial({params}:any){
  const route = useRouter()

  const [widthImageModal, setWidthImageModal] = useState<number>(0);
  const [heightImageModal, setHeightImageModal] = useState<number>(0);
  const [descricao,setDescricao] = useState<string>("")
  const [codigoInterno,setCodigoInterno] = useState<string>("")
  const [codigoFabricante,setCodigoFabricante] = useState<string>("")
  const [marca,setMarca] = useState<string>("")
  const [ tensao,setTensao] = useState<any>("")
  const [corrente,setCorrente] = useState<string>("")
  const [localizacao,setLocalizacao] = useState<string>("")
  const [ unidade,setUnidade] = useState<any>("")

  const [openSnackBar,setOpenSnackBar]= useState(false)
  const [ messageAlert,setMessageAlert] = useState<string>();
  const [ severidadeAlert,setSeveridadeAlert] = useState<AlertColor>()

  const[oldCategory,setOldCategory]= useState<string>("")
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();

  const[precoCusto,setPrecoCusto] = useState<string >()
  const[precoVenda,setPrecoVenda] = useState<string>()
  const[markup,setMarkup] = useState< string>()
  const[imagem,setImagem] = useState<IImage>()
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [unidadeMaterial,setUnidadeMaterial] = useState<any>(["UN","RL","PC","MT","P"])
  const tensoes : string[] = ["12V","24V","127V","220V","380V","440V","660V"]
  const [descricaoMaterial,setDescricaoMaterial] = useState<string>()
  const [imageModal, setImageModal] = useState<IImage>();
 
  const[blockButton,setBlockButton] = useState<boolean>(false)
 
 useEffect(()=>{
 
    getMaterial(params.materialId).then().catch()
    

 },[])
 const handleImageModal = async (urlImagem: string | undefined) => {
  const res: any = await getImageDimensions(urlImagem);
  setWidthImageModal(res.width);
  setHeightImageModal(res.height);
  setImageModal(res);
};

const handleDeleteImagemMaterial = async () => {

  setBlockButton(true)
  await deleteImageFromAzure(imageModal?.urlImagem,"materiais-images");

  const material = {
    id:params.materialId,
    codigoInterno:"",
    codigoFabricante:codigoFabricante.trim().replace(/\s\s+/g, ' '),
    categoria: oldCategory.trim().replace(/\s\s+/g, " "),
    descricao:descricao.trim().replace(/\s\s+/g, ' '),
    marca:marca.trim().replace(/\s\s+/g, ' '),
    corrente:corrente.trim().replace(/\s\s+/g, ' '),
    unidade:unidade,
    tensao:tensao,
    localizacao:localizacao.trim().replace(/\s\s+/g, ' '),
    precoCusto:Number(precoCusto)==0?0:Number(precoCusto?.toString().replace(',','.')),
    precoVenda:Number(precoVenda)==0?0:Number(precoVenda?.toString().replace(',','.')),
    markup:Number(markup)==0?null:Number(markup?.toString().replace(',','.')),
    urlImage:null
    }

   
  await updateMaterial(material)

  setTimeout(()=>{
    setBlockButton(false)
  },2000)
  setImagem(undefined)
 await getMaterial(params.materialId).then().catch()

};

 const readImageFromFile = (file: File): Promise<string> => {
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
};

const convertToPng = async (file: File): Promise<File> => {
  const options = {
    maxSizeMb: 3,
    maxWidthOrHeight: 2000,
    fileType: 'image/png',
  };
  return await imageCompression(file, options);
};

const handleImageChange = async (event: any) => {
  const selectedImage: File = event.target.files[0];

  if (selectedImage !== undefined) {
    let imageFile = selectedImage;

    if (selectedImage.type === 'image/jpeg') {
      imageFile = await convertToPng(selectedImage);
    }
  
    const imageBase64 = await readImageFromFile(imageFile);
    const urlImagem = await uploadImageToAzure(imageBase64, imageFile.name,"materiais-images");
    await handleImageUploadResponse(urlImagem);
  }
};

const handleImageUploadResponse = async (urlImagem: string) => {

  const material = {
    id:params.materialId,
    codigoInterno:"",
    codigoFabricante:codigoFabricante.trim().replace(/\s\s+/g, ' '),
    categoria: oldCategory.trim().replace(/\s\s+/g, " "),
    descricao:descricao.trim().replace(/\s\s+/g, ' '),
    marca:marca.trim().replace(/\s\s+/g, ' '),
    corrente:corrente.trim().replace(/\s\s+/g, ' '),
    unidade:unidade,
    tensao:tensao,
    localizacao:localizacao.trim().replace(/\s\s+/g, ' '),
    precoCusto:Number(precoCusto)==0?0:Number(precoCusto?.toString().replace(',','.')),
    precoVenda:Number(precoVenda)==0?0:Number(precoVenda?.toString().replace(',','.')),
    markup:Number(markup)==0?null:Number(markup?.toString().replace(',','.')),
    urlImage:urlImagem,
    }


  const res=  await updateMaterial(material)


  if (res === 200) {
    setOpenSnackBar(true);
    setSeveridadeAlert('success');
    setMessageAlert('Imagem Adicionada ao Material');
    getMaterial(params.materialId)
  }
};

 //Função para calcular o markup ja trocando as virgulas por pontos,pois a variável é string,para permitir usar , ao invés de .
 const  calcularMarkup= ()=>
 {
  
  const PRECO_CUSTO = Number(precoCusto)

  const PRECO_VENDA = Number(precoVenda)

  console.log(PRECO_VENDA.toFixed(4))

  let markupCalculado = ((PRECO_VENDA/ PRECO_CUSTO)*10)-1

    console.log(markupCalculado)



    
    
  if(Number.isNaN(markupCalculado))
  {
 
   setMarkup("")

  }
  else{

    setMarkup((markupCalculado).toFixed(2).toString().replace('.',','))
  }
  return 

 }
 const  calcularPrecoVenda= ()=>
 {

  let percentage = (Number(markup)/10)+1
  const a =  Number((Number(precoCusto?.toString().replace(`,`,`.`))*Number(percentage?.toString().replace(`,`,`.`))-1)+1).toFixed(2).toString()
  setPrecoVenda(a)
  console.log(a)

 }
 //esta função serve para verificar se o item é nulo,aonde quando importamos os dados do excel os dados vem como nulo
 //e para realizar a  edição aqui
 const verifyNull = (item:any)=>{
 
   return item==null?"":item
 
 }

  const getMaterial = async(id:number)=>{
   const material = await getMaterialById(id)


setCodigoInterno(material.id)
setUnidade(material.unidade)
setCodigoFabricante(verifyNull(material.codigoFabricante))
setCorrente(verifyNull(material.corrente))
setMarca(verifyNull(material.marca))
setDescricaoMaterial(material.descricao)
setDescricao(material.descricao)
setOldCategory(verifyNull(material.categoria))
setLocalizacao(verifyNull(material.localizacao))
setPrecoCusto(verifyNull(material.precoCusto))
setPrecoVenda(material.precoVenda == null?"0":material.precoVenda.toFixed(2))
setMarkup(verifyNull(material.markup))

setTensao(material.tensao)

const image  = await getImageDimensions(material.urlImage);
console.log(image)
  setImagem(image)

  }
 
 
 const handleUpdateMaterial=  async (id:number)=>{
 
 if(precoCusto == "" && markup==""){

   setPrecoCusto("0")
   setMarkup("0")
 }
   // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
 const material = {
     id:id,
     codigoInterno:"",
     codigoFabricante:codigoFabricante.trim().replace(/\s\s+/g, ' '),
     categoria: oldCategory.trim().replace(/\s\s+/g, " "),
     descricao:descricao.trim().replace(/\s\s+/g, ' '),
     marca:marca.trim().replace(/\s\s+/g, ' '),
     corrente:corrente.trim().replace(/\s\s+/g, ' '),
     unidade:unidade,
     tensao:tensao,
     localizacao:localizacao.trim().replace(/\s\s+/g, ' '),
     precoCusto:Number(precoCusto)==0?0:Number(precoCusto?.toString().replace(',','.')),
     precoVenda:Number(precoVenda)==0?0:Number(precoVenda?.toString().replace(',','.')),
     markup:Number(markup)==0?null:Number(markup?.toString().replace(',','.')),
     }

     
   const materialAtualizado =  await updateMaterial(material)
   
     
   if (materialAtualizado){
       setOpenSnackBar(true)
       setSeveridadeAlert("success")
       setMessageAlert("Material Atualizado com sucesso")
       //Contará um tempo depois que atualizar o material e voltara para a tela de materias
      setTimeout(()=>{
        route.back()
      },1200)
   }
   
   
 
 }
 

 
 
   return (
     <>
 

 
     <Link
        size="sm"
        as="button"
        className="p-3 mt-4 text-base tracking-wide text-dark hover:text-success border border-transparent hover:border-success transition-all duration-200"
        onClick={() => route.push("/create-material")}
      >
        <ArrowLeft /> Retornar
      </Link>
     <h1  className='text-center font-bold text-2xl mt-10'>Editando {descricaoMaterial}  (Codigo Interno: {codigoInterno}) </h1>
   
     <Flex direction="column" gap="6">
       <Flex direction="row" justify="center"  gap="6" height="7" className=' mt-10' >
        <TextField.Root>
                    <TextField.Input
                      value={codigoFabricante}
                      variant='classic'
                      onChange={(x) => setCodigoFabricante(x.target.value)}
                      placeholder='Código Fabricante'
                      size="3"
                    />
                  </TextField.Root>
          <TextField.Root>
                    <TextField.Input
                      value={descricao}
                      variant='classic'
                      onChange={(x) => setDescricao(x.target.value)}
                      placeholder='Descricao'
                      className="w-[400px]"
                      size="3"
                    />
                  </TextField.Root>
           <TextField.Root>
                    <TextField.Input
                      value={marca}
                      variant='classic'
                      onChange={(x) => setMarca(x.target.value)}
                      placeholder='Marca'
                      size="3"
                    />
                  </TextField.Root>
            <TextField.Root>
                    <TextField.Input
                      value={localizacao}
                      variant='classic'
                      onChange={(x) => setLocalizacao(x.target.value)}
                      placeholder='Localização'
                      size="3"
                    />
                  </TextField.Root>
          
       
           </Flex>

        <Flex direction="row" justify="center"  gap="6" height="7" >
        <TextField.Root>
                    <TextField.Input
                      value={precoCusto}
                      variant='classic'
                      onChange={(x) => setPrecoCusto(x.target.value)}
                      placeholder='Preço De Custo'
                      size="3"
                    />
                  </TextField.Root>
            <TextField.Root>
                    <TextField.Input
                      value={markup}
                      variant='classic'
                      onChange={(x) => {setMarkup(x.target.value),calcularPrecoVenda()}}
                      placeholder='Markup'
                      size="3"
                    />
              </TextField.Root>
       
              <TextField.Root>
                    <TextField.Input
                      value={precoVenda}
                      variant='classic'
                      onChange={(x) => {setPrecoVenda(x.target.value),calcularMarkup()}}
                      placeholder='Preço de Venda'
                      size="3"
                    />
              </TextField.Root>

              <TextField.Root>
                    <TextField.Input
                      value={corrente}
                      variant='classic'
                      onChange={(x) => setCorrente(x.target.value)}
                      placeholder='Corrente'
                      size="3"
                    />
              </TextField.Root>
           {tensao && (
              <Autocomplete
              label="Tensão "
              className="max-w-[180px] "
              allowsCustomValue
              value={tensao}
              onSelectionChange={setTensao}
              defaultSelectedKey={tensao}
              >
              {tensoes.map((item:any) => (
                <AutocompleteItem
                key={item}
                aria-label=''
                  value={tensao}
                  >
                  {item}
                </AutocompleteItem>
              ))}
              </Autocomplete>
           )}
          
        {unidade && (
       
        <Autocomplete
         label="Unidade "
         placeholder="EX:MT"
         className="max-w-[180px]  "
          value={unidadeMaterial}
          onSelectionChange={setUnidade}
          allowsCustomValue
          defaultSelectedKey={unidade==""?"":unidade}
       >
       
       {unidadeMaterial.map((item:any) => (
       
          <AutocompleteItem
           key={item}
           aria-label='teste'
       
            value={unidade}
            >
            {item}
          </AutocompleteItem>
        ))}
        </Autocomplete>
        )}
       
       
       </Flex>
     </Flex>

     <div className=' w-[100%] text-center mt-12 flex flex-col gap-4 items-center'>
     <Button  onClick={x=>handleUpdateMaterial(params.materialId)} 
      size="4"
      variant='outline' className=' p-6 rounded-lg font-bold cursor-pointer   '>
       Atualizar Material
      </Button>
      <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              className="bg-master_yellow text-black py-2 px-4 rounded-md items-center gap-2 hover:bg-white hover:border-1 hover:border-black flex flex-row"
              onClick={() => fileInputRef.current?.click()}
            >
              Subir Imagem
              <IconCamera height="1.4em" width="1.4em" />
            </button>
            {imagem && (
              <>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-[100%]">
    {/* Empty div to fill the first column and create the centering effect */}
    <div className="hidden md:block"></div>
    
    <div
        className="relative flex justify-center items-center bg-gray-200 rounded-lg shadow-md overflow-hidden"
        style={{
            width: '100%',
            height: 350,
        }}
        onClick={() => {
            onOpenChange(), handleImageModal(imagem?.urlImagem)
        }}
    >
        <Image
            src={imagem.urlImagem != undefined ? imagem.urlImagem : ""}
            alt={`Imagem ${descricao} `}
            layout="fill"
            objectFit="cover"
            className="cursor-pointer"
        />
    </div>
    
    {/* Empty div to fill the third column */}
    <div className="hidden md:block"></div>
</div>
              
              
              
              </>
            )}
      </div>
      <Modal isOpen={isOpen } backdrop="blur" size='xl' onOpenChange={onOpenChange} >
          <ModalContent>
          {(onClose) => (
                 <>
            <ModalBody className="flex flex-col items-center justify-center relative">
              {imageModal ? (
                <Image
                  src={imageModal.urlImagem != undefined ?imageModal.urlImagem:""}
                  alt="Imagem da Atividade"
                  width={imageModal.width}
                  height={heightImageModal}
                />
              ) : (
                <p>Carregando...</p>
              )}
              <a
                               href={imageModal?.urlImagem}
                               download={descricao}
                                className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                                     >
      
                                     <IconArrowDownCircle height={"1.4em"} width={"1.4em"}  />
                             </a>
             
            </ModalBody>
            <ModalFooter className="flex flex-row justify-between">
           
              
              <Button color="crimson" size='3' variant="solid" className='p-2 cursor-pointer ' onClick={handleDeleteImagemMaterial}>
                                Deletar Imagem
                            </Button>
              <Button color="blue" variant="outline" className='p-2 cursor-pointer ' onClick={()=>{onClose(),setImageModal(undefined)}}>
                             Fechar
                         </Button>
            </ModalFooter>
                 </>
                             )}
          </ModalContent>
        </Modal>

     <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={e=>setOpenSnackBar(false)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
     >
             <MuiAlert onClose={e=>setOpenSnackBar(false)} severity={severidadeAlert} sx={{ width: '100%' }}>
              {messageAlert}
            </MuiAlert>
            </Snackbar>
   
 
     
     </>
     
     
   );
}
