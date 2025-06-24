// 🎓 EXPLICAÇÃO GERAL: Este hook customizado encapsula TODA a lógica de gerenciamento de tarefas.
// Ele utiliza a API moderna do @tanstack/react-query (v5) e a estratégia correta de
// gerenciamento de datas com DateValue para compatibilidade com o NextUI Calendar.

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { DropResult } from "react-beautiful-dnd";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";
import {
  getUserTasksByDate,
  createTarefaUsuario,
  updateTarefaUsuario,
  deleteTarefaUsuario,
} from "../services/TarefasUsuarios.Services";

type StatusType = "alta" | "media" | "baixa" | "concluidas";

const STATUS_MAP: Record<StatusType, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
  concluidas: "Concluídas",
};

export function useTaskManager() {
  const queryClient = useQueryClient();

  const [tasks, setTasks] = useState<Record<StatusType, ITarefaUsuario[]>>({
    alta: [], media: [], baixa: [], concluidas: [],
  });

  // O estado agora armazena o tipo `DateValue`, nativo do calendário.
  const [selectedDate, setSelectedDate] = useState<DateValue>(today(getLocalTimeZone()));

  // 🎓 useQuery com sintaxe de objeto e conversão de data no momento do uso.
  const { data: fetchedTasks, isLoading } = useQuery({
    queryKey: ["tasks", selectedDate.toDate(getLocalTimeZone()).toDateString()],
    queryFn: () => getUserTasksByDate(selectedDate.toDate(getLocalTimeZone()).toDateString()),
  });

  // Sincroniza os dados do servidor (cache do react-query) para o estado local.
  useEffect(() => {
    if (fetchedTasks) {
      const newState: Record<StatusType, ITarefaUsuario[]> = {
        alta: [], media: [], baixa: [], concluidas: [],
      };
      fetchedTasks.forEach(task => {
        if (task.isFinished) {
          newState.concluidas.push(task);
        } else {
          // Adicionando verificação de nulidade para `prioridade` para maior robustez
          const priorityKey = task.prioridade?.toLowerCase() as StatusType;
          if (newState[priorityKey]) {
            newState[priorityKey].push(task);
          }
        }
      });
      setTasks(newState);
    }
  }, [fetchedTasks]);

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTarefaUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedDate.toDate(getLocalTimeZone()).toDateString()] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTarefaUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedDate.toDate(getLocalTimeZone()).toDateString()] });
    },
  });

  // 🎓 Mutação de atualização com "Optimistic Update" robusto.
  const updateTaskMutation = useMutation({
    mutationFn: updateTarefaUsuario,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", selectedDate.toDate(getLocalTimeZone()).toDateString()] });
      const previousTasks = queryClient.getQueryData<ITarefaUsuario[]>(["tasks", selectedDate.toDate(getLocalTimeZone()).toDateString()]);
      queryClient.setQueryData<ITarefaUsuario[]>(["tasks", selectedDate.toDate(getLocalTimeZone()).toDateString()], oldTasks =>
        oldTasks ? oldTasks.map(task => task.id === updatedTask.id ? updatedTask : task) : []
      );
      return { previousTasks };
    },
    onError: (err, updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", selectedDate.toDate(getLocalTimeZone()).toDateString()], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedDate.toDate(getLocalTimeZone()).toDateString()] });
    },
  });

  const handleCreateTask = (prioridade: 'Alta' | 'Média' | 'Baixa') => {
    createTaskMutation.mutate({
      prioridade,
      nomeTarefa: "Nova Tarefa",
      usuario: {},
      //@ts-ignore
      data: selectedDate.toDate(getLocalTimeZone()).toISOString(),
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const startColId = source.droppableId as StatusType;
    const endColId = destination.droppableId as StatusType;
    const taskToMove = tasks[startColId]?.find(t => String(t.id) === draggableId);

    if (taskToMove) {
      updateTaskMutation.mutate({
        ...taskToMove,
        prioridade: STATUS_MAP[endColId] || taskToMove.prioridade,
        isFinished: endColId === 'concluidas',
      });
    }
  };

  return {
    tasks,
    isLoading,
    selectedDate,
    setSelectedDate,
    onDragEnd,
    handleCreateTask,
    deleteTask: deleteTaskMutation.mutate,
  };
}