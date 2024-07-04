"use client";
import { Button } from '@nextui-org/react';
import "dayjs/locale/pt-br";
import { Card } from 'flowbite-react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { IRelatorioDiario } from '@/app/interfaces/IRelatorioDiario';
import { createRelatorioDiario, getAllRelatoriosDiarios } from "@/app/services/RelatorioDiario.Services";
import dayjs from 'dayjs';

export default function Reports() {
    const [numeroOrcamento, setNumeroOrcamento] = useState<string>("");
    const [relatoriosDiarios, setRelatorioDiarios] = useState<IRelatorioDiario[]>();
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    var dataAtual = new Date();

    useEffect(() => {
        getAll();
    }, []);

    const route = useRouter();

    const getAll = async () => {
        const res: any = await getAllRelatoriosDiarios();
        if (res) setRelatorioDiarios(res);
    };

    const handleCreateRelatorio = async () => {
        const res = await createRelatorioDiario();
        if (res) await getAll();
    };

  
    return (
        <>
            <div className="flex flex-col gap-5 justify-center items-center mt-10">
                <h1 className='text-center text-3xl font-bold mb-4'>Relatórios Diários</h1>
                <Button onPress={handleCreateRelatorio} className='bg-blue-500 hover:bg-blue-700 text-2xl text-white font-bold py-2 px-4 rounded'>
                    Criar novo relatório
                </Button>
            </div>

            <div className='flex flex-wrap justify-center gap-6 mt-10'>
                {relatoriosDiarios != undefined && relatoriosDiarios.map((relatorioDiario: IRelatorioDiario) => (
                    <Card key={relatorioDiario.id} className="w-full max-w-xs p-5 bg-white rounded-lg shadow-lg transition transform hover:scale-105">
                        <h5 className="text-xl font-semibold mb-2 text-center">Relatório Diário Nº {relatorioDiario.id}</h5>
                        <p className="text-center text-gray-700">Data Abertura: {dayjs(relatorioDiario.horarioAbertura).format("DD/MM/YY")} - {semana[dayjs(relatorioDiario.horarioAbertura).day()]}</p>
                        <p className="text-center text-gray-700 mb-4">Status: {relatorioDiario.isFinished ? "Relatório Concluído" : "Relatório Em Análise"}</p>
                        <div className="text-center">
                            <button
                                onClick={() => route.push(`/report/${relatorioDiario.id}`)}
                                className="inline-flex items-center px-4 py-2 bg-green-500 text-black text-base rounded-md hover:bg-green-700 hover:underline"
                            >
                                Editar
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
}
