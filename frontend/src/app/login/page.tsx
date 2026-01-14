"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { authenticate } from "@/app/services/Auth.services";

// Icons
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ArrowRight,
  FileText,
  User
} from 'lucide-react';

// Next UI
import { Spinner } from "@nextui-org/react";
import { toast } from "sonner";

// Schema de validação
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
  senha: z
    .string()
    .min(1, "Senha é obrigatória")
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/reports");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const responseStatus = await authenticate(data);
      
      if (responseStatus === 200) {
        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (userData.token) {
          // Atualiza o estado do contexto de autenticação
          login(userData.token, userData.userId, userData.userName, userData.role);
          
          toast.success("Login realizado com sucesso!", {
            description: `Bem-vindo, ${userData.userName}!`
          });
          
          // Redireciona para a página de relatórios após atualizar o estado
          // Isso garante que a navbar atualize corretamente
          router.push("/reports");
        } else {
          throw new Error("Dados do usuário não encontrados após autenticação.");
        }
      } else {
        const errorMessages = {
          401: "Email ou senha incorretos",
          403: "Você não possui mais permissão de acesso",
          default: "Erro desconhecido ao tentar fazer login"
        };
        
        const message = errorMessages[responseStatus as unknown as keyof typeof errorMessages] || errorMessages.default;
        toast.error("Erro no login", { description: message });
      }
    } catch (error) {
      console.error("Erro na função authenticate:", error);
      toast.error("Erro ao realizar login", {
        description: "Verifique sua conexão ou tente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding (Desktop Only) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 relative overflow-hidden"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Master ERP</span>
              <p className="text-xs text-gray-500">Sistema de Gestão</p>
            </div>
          </div>

          {/* Main Content */}
          <div>
            <h1 className="text-3xl font-semibold text-white leading-tight mb-4">
              Sistema de Relatórios
            </h1>
            <p className="text-base text-gray-400 max-w-sm">
              Acesse o sistema para gerenciar relatórios diários, atividades e documentação de projetos.
            </p>
          </div>

          {/* Footer */}
          <div className="text-gray-600 text-sm">
            © 2026 Master Elétrica
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Master ERP</h2>
            <p className="text-sm text-gray-500">Sistema de Gestão</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-7 h-7 text-gray-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Acesse sua conta
              </h1>
              <p className="text-gray-500 text-sm">
                Digite suas credenciais para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className={`w-5 h-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="seuemail@empresa.com"
                    autoComplete="email"
                    className={`
                      w-full pl-12 pr-4 py-3.5 rounded-xl border-2 
                      bg-gray-50 text-gray-900 placeholder-gray-400
                      transition-all duration-200 outline-none
                      ${errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                      }
                    `}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-2 text-red-500"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{errors.email.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className={`w-5 h-5 ${errors.senha ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    {...register("senha")}
                    type={isVisible ? "text" : "password"}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    className={`
                      w-full pl-12 pr-12 py-3.5 rounded-xl border-2 
                      bg-gray-50 text-gray-900 placeholder-gray-400
                      transition-all duration-200 outline-none
                      ${errors.senha 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={isVisible ? "Esconder senha" : "Mostrar senha"}
                  >
                    {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {errors.senha && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-2 text-red-500"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{errors.senha.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isLoading || !isValid || !isDirty}
                  whileHover={isValid && isDirty ? { scale: 1.01 } : {}}
                  whileTap={isValid && isDirty ? { scale: 0.99 } : {}}
                  className={`
                    w-full py-3.5 px-6 rounded-xl font-semibold text-base
                    flex items-center justify-center gap-2
                    transition-all duration-200
                    ${isLoading || !isValid || !isDirty
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                    }
                  `}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Spinner size="sm" color="white" />
                        <span>Entrando...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span>Entrar</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Acesso restrito a colaboradores autorizados
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}