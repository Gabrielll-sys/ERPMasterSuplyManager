import { Box, Button, Flex, Slider, Text, TextField } from '@radix-ui/themes'
import React, { useState } from 'react'
import IconCurrencyReal from '../assets/icons/IconCurrencyReal'
import IconTrash from '../assets/icons/IconTrash'


type LeftSearchParametersProps ={
    onFilter:(filtro:any)=>void
}

export default function LeftSearchParameters({onFilter}:LeftSearchParametersProps) {
  
    const[precoCustoMinimo,setPrecoCustoMinimo] = useState("")
    const[precoCustoMaximo,setPrecoCustoMaximo] = useState("")
    const[precoVendaMaximo,setPrecoVendaMaximo] = useState("")
    const[precoVendaMinimo,setPrecoVendaMinimo] = useState("")
    const[marca,setMarca] = useState("")
    const [descricao,setDescricao] = useState<string>("")

    const verifyNumberIsEmpty = (item:string | undefined)=>{
 
        return !item?.length ? null: Number(item?.replace(',','.')).toFixed(2)
      
      }
    const handleFiltro = ()=>{
        const filtro  = {
            descricao: descricao,
            marca: marca,
            precoVendaMin:verifyNumberIsEmpty(precoVendaMinimo),
            precoVendaMax:verifyNumberIsEmpty(precoVendaMaximo),
            precoCustoMin:verifyNumberIsEmpty(precoCustoMinimo),
            precoCustoMax:verifyNumberIsEmpty(precoCustoMaximo),
    
        }
        onFilter(filtro)
    }
    const limparFiltros = ()=> {
        setDescricao("")
        setMarca("")
        setPrecoCustoMinimo("")
        setPrecoCustoMaximo("")
        setPrecoVendaMinimo("")
        setPrecoVendaMaximo("")
    }
    return (
    <Box className='w-[300px]' >

    <Flex direction="column" wrap="wrap" className='w-[300px]' gap="5">
  
            <Button onClick={limparFiltros} variant="surface" className='text-[16px] cursor-pointer'>
                <IconTrash height="20" width="20" /> Limpar Filtros
            </Button>
            <Text>Busque por preços</Text>
   
            <Flex direction="row" gap="4" wrap="wrap" >

                <TextField.Root  size="3"  variant="classic" >
                    <TextField.Slot>
                    <TextField.Input
                      value={descricao}
                      variant='classic'
                      onChange={(x) => setDescricao(x.target.value)}
                      placeholder='Descrição'
                       className='w-[270px]'
                      size="3"
              
                    />
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
                <TextField.Root  size="3"  variant="classic" >
                    <TextField.Slot>
                    <TextField.Input
                      value={marca}
                      variant='classic'
                      onChange={(x) => setMarca(x.target.value)}
                      placeholder='Marca'
                       className='w-[270px]'
                      size="3"
              
                    />
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
                <Text align="center" className='w-full'> Preço Custo</Text>
                <TextField.Root  size="3"  variant="classic" >
                    <TextField.Slot>
                    <TextField.Input
                      value={precoCustoMinimo}
                      variant='classic'
                      onChange={(x) => setPrecoCustoMinimo(x.target.value)}
                      placeholder=' Minimo'
                       className='w-[100px]'
                      size="3"
              
                    />
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>

                <TextField.Root  size="3"  variant="classic" >
                    <TextField.Slot>
                    <TextField.Input
                      value={precoCustoMaximo}
                      variant='classic'
                      onChange={(x) => setPrecoCustoMaximo(x.target.value)}
                      placeholder='Máximo'
                       className='w-[100px]'
                      size="3"
              
                    />
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
                <Text align="center" className='w-full'>Preço Venda</Text>
                <TextField.Root  size="3"  variant="classic" >
                <TextField.Input
                      value={precoVendaMinimo}
                      variant='classic'
                      onChange={(x) => setPrecoVendaMinimo(x.target.value)}
                      placeholder='Mínimo'
                      className='w-[100px]'
                      size="3"
                  
                    />
                    <TextField.Slot>
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>

                <TextField.Root  size="3"  variant="classic" >
                <TextField.Input
                      value={precoVendaMaximo}
                      variant='classic'
                      onChange={(x) => setPrecoVendaMaximo(x.target.value)}
                      placeholder='Maxímo'
                      className='w-[100px]'
                      size="3"
                  
                    />
                    <TextField.Slot>
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
             
                    <Button onClick={handleFiltro} variant="soft" size="3" className='w-[100px]'>
                        Buscar
                    </Button>
 
            </Flex>

           

    </Flex>

    </Box>
  )
}
