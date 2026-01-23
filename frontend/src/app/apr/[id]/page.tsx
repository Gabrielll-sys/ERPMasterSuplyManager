"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AprForm from "../AprForm";
import { downloadAprPdf, getAprById, updateApr } from "../../services/Aprs.Service";
import { IApr } from "../../interfaces/IApr";

export default function AprEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const aprId = Number(params.id);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: apr, isLoading, isError } = useQuery<IApr>({
    queryKey: ["apr", aprId],
    queryFn: () => getAprById(aprId),
    enabled: !!aprId,
  });

  const mutation = useMutation({
    mutationFn: (payload: IApr) => updateApr(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aprs"] });
      queryClient.invalidateQueries({ queryKey: ["apr", aprId] });
    },
  });

  if (isLoading) {
    return <p className="p-6 text-sm text-slate-500">Carregando APR...</p>;
  }

  if (isError || !apr) {
    return (
      <div className="p-6">
        <p className="text-sm text-rose-600">Não foi possível carregar a APR.</p>
        <button
          className="mt-3 text-sm text-blue-600 hover:underline"
          onClick={() => router.push("/apr")}
        >
          Voltar
        </button>
      </div>
    );
  }

  // Faz download do PDF da APR em formato blob.
  const handleDownloadPdf = async () => {
    if (!aprId) return;
    try {
      setIsDownloading(true);
      const blob = await downloadAprPdf(aprId);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `APR_${aprId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editar APR #{apr.id}</h1>
            <p className="text-sm text-slate-500">{apr.titulo}</p>
          </div>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              isDownloading
                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isDownloading ? "Gerando PDF..." : "Baixar PDF"}
          </button>
        </div>
        <AprForm
          apr={apr}
          onSave={async (payload) => mutation.mutateAsync(payload)}
          saving={mutation.isPending}
        />
      </div>
    </div>
  );
}
