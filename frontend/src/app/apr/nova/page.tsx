"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AprForm from "../AprForm";
import { createApr } from "../../services/Aprs.Service";
import { IApr } from "../../interfaces/IApr";

export default function AprCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: IApr) => createApr(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["aprs"] });
      if (data?.id) {
        router.push(`/apr/${data.id}`);
      } else {
        router.push("/apr");
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nova APR</h1>
          <p className="text-sm text-slate-500">Preencha os dados abaixo</p>
        </div>
        <AprForm
          onSave={async (payload) => {
            await mutation.mutateAsync(payload);
          }}
          saving={mutation.isPending}
        />
      </div>
    </div>
  );
}
