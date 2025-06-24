"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Supondo que você tenha um AuthContext
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Serviços e Interfaces
import { getUserById, updateInfosUser } from "@/app/services/User.Services";
import { IUsuario } from "@/app/interfaces/IUsuario";

// Componentes Radix UI e Ícones
import { Box, Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { User, Mail, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Spinner } from "@nextui-org/react"; // Mantendo Spinner para feedback visual
import { Toaster, toast } from 'sonner';

// --- Lógica de Estado do Formulário com useReducer ---

type FormState = Omit<IUsuario, 'id' | 'dataCadastro' | 'isActive'>; // Pegamos apenas os campos editáveis

type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState; value: string }
  | { type: 'LOAD_DATA'; payload: FormState };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
};

const initialState: FormState = {
  nome: '',
  email: '',
  senha: '',
  cargo: '',
};

export default function MyAccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth(); // Usando o usuário do seu contexto de autenticação

  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  

  // Query para buscar os dados do usuário
  const { data: userData, isLoading: isLoadingUser, isError } = useQuery({
    queryKey: ['userDetails', authUser?.userId],
    queryFn: () => getUserById(authUser?.userId),
    enabled: !!authUser?.userId, // A query só roda se houver um ID de usuário
    staleTime: 1000 * 60 * 15, // Dados ficam "frescos" por 15 minutos


  });
  // Efeito para carregar os dados no formulário uma vez que a query os traga
  useEffect(() => {
    if (userData) {
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          nome: userData.nome || '',
          email: userData.email || '',
          senha: '', // Senha nunca é preenchida por segurança
          cargo: userData.cargo || '',
        },
      });
    }
  }, [userData]);

  // Mutação para atualizar os dados do usuário
  const updateUserMutation = useMutation({
    mutationFn: updateInfosUser,
    onSuccess: () => {
      toast.success("Informações atualizadas com sucesso!");
      // Invalida a query para que na próxima vez que a página for acessada, os dados sejam buscados novamente
      queryClient.invalidateQueries({ queryKey: ['userDetails', authUser?.userId] });
    },
    onError: (error: any) => {
      toast.error(`Falha ao atualizar: ${error.message}`);
    }
  });

  // --- Handlers ---

  const handleInputChange = (field: keyof FormState, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!authUser?.userId) return;

    // Monta o payload apenas com os campos que foram alterados
    const payload: IUsuario = { id: authUser.userId };
    if (formState.nome !== userData?.nome) {
        payload.nome = formState.nome;
    }
    if (formState.email !== userData?.email) {
        payload.email = formState.email;
    }
    // Só envia a senha se o campo não estiver vazio
    if (formState.senha && formState.senha.trim() !== '') {
        payload.senha = formState.senha;
    }

    // Não envia a mutação se nada foi alterado (exceto senha)
    if (Object.keys(payload).length > 1) {
        updateUserMutation.mutate(payload);
    } else {
        toast.info("Nenhuma alteração para salvar.");
    }
  };

  if (isLoadingUser) {
    return (
      <Flex align="center" justify="center" className="min-h-[70vh]">
        <Spinner label="Carregando suas informações..." />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex align="center" justify="center" className="min-h-[70vh]">
        <Text color="red">Ocorreu um erro ao carregar seus dados.</Text>
      </Flex>
    );
  }
  return (
    <>
      <Toaster richColors position="top-right" />
      <Flex align="center" justify="center" className="min-h-[80vh] p-4">
        <Card size="4" className="w-full max-w-2xl shadow-lg">
          <Heading as="h1" size="7" align="center" mb="6">
            Minhas Informações
          </Heading>
          
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="5">
              <TextField.Root size="3">
                <TextField.Slot>
                  <User size={18} />
                </TextField.Slot>
                <TextField.Input
                  placeholder="Seu nome de usuário"
                  value={formState.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  disabled={true}
                />
              </TextField.Root>
              
              <TextField.Root size="3">
                <TextField.Slot>
                  <Mail size={18} />
                </TextField.Slot>
                <TextField.Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={formState.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={true}
                />
              </TextField.Root>

              <TextField.Root size="3">
                <TextField.Slot>
                  <KeyRound size={18} />
                </TextField.Slot>
                <TextField.Input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Nova senha (deixe em branco para não alterar)"
                  value={formState.senha}
                  onChange={(e) => handleInputChange('senha', e.target.value)}
               
                />
                <TextField.Slot >
                  <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} aria-label="Toggle password visibility">
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </TextField.Slot>
              </TextField.Root>

              <Flex justify="end" mt="4">
                <Button size="3" type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? <Spinner size="sm" /> : <CheckCircle size={18} />}
                  <Text ml="2">Salvar Alterações</Text>
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </>
  );
}