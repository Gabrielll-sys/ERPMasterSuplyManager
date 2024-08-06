"use client";
import { AlertDialog, Button, Text } from "@radix-ui/themes";
import "dayjs/locale/pt-br";
import { Card } from 'flowbite-react';
import { useRouter } from "next/navigation";
import { IRelatorioDiario } from '@/app/interfaces/IRelatorioDiario';
import { createRelatorioDiario, getAllRelatoriosDiarios } from "@/app/services/RelatorioDiario.Services";
import dayjs from 'dayjs';
import { useMutation, useQuery } from 'react-query';
import { Flex } from '@radix-ui/themes';

export default function Reports() {

    const route = useRouter();
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    var dataAtual = new Date();

   
    //staleTime:Tempo que os dados são considerados frescos
    //cacheTime:Tempo que os dados ficam no cache,
    //Para ambos é 8 Horas
    const {data:relatoriosDiarios,refetch:refetchRds,isSuccess}= useQuery({
        queryKey:['relatorios'],
        queryFn:getAllRelatoriosDiarios,
        staleTime:1*1000*60*60*8,
        cacheTime:1*1000*60*60*8

    })
    

    const relatorioDiarioMutation = useMutation({
        mutationFn:createRelatorioDiario,
        onSuccess:refetchRds
    })
   
    return (
        <>
            <Flex justify="center" className="  w-full ">
                <Flex direction="row"  justify="between"  className="  w-[1400px] mt-10">
                    <Text className=' text-2xl ml-10 font-bold '>Relatórios Diários</Text>
                    <AlertDialog.Root>
                <AlertDialog.Trigger>
                <Button  className=' bg-blue-500 text-[18px] text-white font-bold px-4 py-5 rounded'>
                        Criar novo relatório
                    </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Title>Criar Novo Relatório Diário</AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    Tem certeza que deseja criar novo relatório diário?
                  </AlertDialog.Description>

                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" className="text-black">
                        Cancelar
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                    <Button onClick={()=>relatorioDiarioMutation.mutate()} className=' bg-blue-500 text-[18px] text-white font-bold px-4 py-5 rounded'>
                        Criar novo relatório
                    </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
                   
                </Flex>
            </Flex>

            <Flex justify="center">
                <Flex justify="center" wrap="wrap" gap="6" mt="7" className="max-w-[1400px]" >
                    {isSuccess && relatoriosDiarios.map((relatorioDiario: IRelatorioDiario) => (
                        <Card key={relatorioDiario.id} className=" shadow-md border-l-4 hover:transform hover:-translate-y-1 hover:shadow-lg transition duration-300 max-w-72 p-2 bg-white rounded-lg">
                            <h5 className="text-xl font-semibold mb-2 text-left">Relatório Diário Nº {relatorioDiario.id}</h5>
                            <Text className="text-left text-gray-700">Data Abertura: {dayjs(relatorioDiario.horarioAbertura).format("DD/MM/YY")} </Text>
                            <Text className="text-left text-gray-700">{semana[dayjs(relatorioDiario.horarioAbertura).day()]}</Text>
                            <Text className={`text-center text-gray-700 mb-4 ${relatorioDiario.isFinished?"bg-[#d4edda] text-[#155724] b-l-[#28a745]":""} `}>Status: {relatorioDiario.isFinished ? "Relatório Concluído" : "Relatório Em Análise"}</Text>
                
                                <Flex justify="end"  >
                                    <Button
                                        onClick={() => route.push(`/report/${relatorioDiario.id}`)}
                
                                        className="text-white text-base rounded-md hover:underline w-[100px] self-end "
                
                                    >
                                        Editar
                
                                                            </Button>
                                </Flex>
                        </Card>
                    ))}
                </Flex>
            </Flex>
        </>
    );
}
