import { Box, Button, Flex, Slider, Text, TextField } from '@radix-ui/themes'
import React, { useState } from 'react'
import IconCurrencyReal from '../assets/icons/IconCurrencyReal'
import IconTrash from '../assets/icons/IconTrash'


type LeftSearchParametersProps ={
    onFilterChange:()=>void
}

export default function LeftSearchParameters({onFilterChange}:LeftSearchParametersProps) {
  
    const[minValueProduct,setMinValueProduct] = useState(0)
    const[maxValueProduct,setMaxValueProduct] = useState(1000000)
    const [marca,setMarca] = useState<string>("")
    const [descricao,setDescricao] = useState<string>("")
    const handleValueChange = (values: number[]) => {
        setMinValueProduct(values[0]);
        setMaxValueProduct(values[1]);
    }
    return (
    <Box className='w-[400px]' >

    <Flex direction="column" wrap="wrap" className='w-[400px]' gap="5">
  
            <Button variant="surface" className='text-[16px] cursor-pointer'>
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
                      value={minValueProduct}
                      variant='classic'
                      onChange={(x) => setMinValueProduct(Number(x.target.value))}
                      placeholder='Endereço'
                       className='w-[100px]'
                      size="3"
              
                    />
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>

                <TextField.Root  size="3"  variant="classic" >
                    <TextField.Slot>
                    <TextField.Input
                      value={minValueProduct}
                      variant='classic'
                      onChange={(x) => setMinValueProduct(Number(x.target.value))}
                      placeholder='Endereço'
                       className='w-[100px]'
                      size="3"
              
                    />
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>

                <TextField.Root  size="3"  variant="classic" >
                <TextField.Input
                      value={maxValueProduct}
                      variant='classic'
                      onChange={(x) => setMaxValueProduct(Number(x.target.value))}
                      placeholder='Endereço'
                      className='w-[100px]'
                      size="3"
                  
                    />
                    <TextField.Slot>
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>

                <TextField.Root  size="3"  variant="classic" >
                <TextField.Input
                      value={marca}
                      variant='classic'
                      onChange={(x) => setMarca(x.target.value)}
                      placeholder='Marca'
                      className='w-[100px]'
                      size="3"
                  
                    />
                    <TextField.Slot>
                <IconCurrencyReal height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
                <Button  variant="soft" size="3">
                    Buscar
                </Button>
            </Flex>

           

    </Flex>

    </Box>
  )
}
