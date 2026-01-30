import { fetcher, poster, deleter } from "../lib/api";
import { url } from "../api/webApiUrl";
import { IChecklistInspecaoImagem } from "../interfaces/IChecklistInspecaoImagem";

// Lista imagens vinculadas ao checklist.
export const getChecklistInspecaoImagens = async (checklistId: number) => {
  return fetcher<IChecklistInspecaoImagem[]>(
    `${url}/ChecklistsInspecaoImagens/checklist/${checklistId}`
  );
};

// Cria imagem vinculada ao checklist (URL + key).
export const addChecklistInspecaoImagem = async (
  checklistId: number,
  model: Pick<IChecklistInspecaoImagem, "imageUrl" | "imageKey">
) => {
  return poster<IChecklistInspecaoImagem>(
    `${url}/ChecklistsInspecaoImagens/${checklistId}`,
    model
  );
};

// Remove imagem (R2 + banco via API).
export const deleteChecklistInspecaoImagem = async (id: number) => {
  return deleter<void>(`${url}/ChecklistsInspecaoImagens/${id}`);
};
