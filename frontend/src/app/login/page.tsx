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

// Radix UI Components
import { 
  Button, 
  TextField, 
  Card, 
  Flex, 
  Box, 
  Heading, 
  Text, 
  IconButton,
  Separator 
} from "@radix-ui/themes";

// Icons
import { 
  EnvelopeClosedIcon, 
  LockClosedIcon, 
  EyeOpenIcon, 
  EyeClosedIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons';

// Next UI
import { Spinner } from "@nextui-org/react";
import { toast } from "sonner"; // ou use Next UI toast se disponível

// Schema de validação
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
  senha: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
});

type LoginFormData = z.infer<typeof loginSchema>;

// Variantes de animação
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { 
      delay: index * 0.1, 
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

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
    watch
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
          login(userData.token, userData.userId, userData.userName, userData.role);
          toast.success("Login realizado com sucesso!", {
            description: `Bem-vindo, ${userData.userName}!`
          });
        } else {
          throw new Error("Dados do usuário não encontrados após autenticação.");
        }
      } else {
        const errorMessages = {
          401: "Email ou senha incorretos",
          403: "Você não possui mais permissão de acesso",
          default: "Erro desconhecido ao tentar fazer login"
        };
        
        const message = errorMessages[responseStatus as keyof typeof errorMessages] || errorMessages.default;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card size="4" className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-black/5">
          {/* Header */}
          <Box className="text-center pb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <LockClosedIcon className="w-8 h-8 text-white" />
              </div>
              <Heading size="8" className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Bem-vindo
              </Heading>
              <Text size="3" color="gray" className="mt-2">
                Faça login para acessar sua conta
              </Text>
            </motion.div>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <motion.div
              custom={0}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <Box>
                <Text as="label" size="2" className="block font-medium mb-2 text-gray-700">
                  Email
                </Text>
                <TextField.Root 
                  size="3"
                  className={`transition-all duration-200 ${
                    errors.email ? 'ring-2 ring-red-200' : 'focus-within:ring-2 focus-within:ring-blue-200'
                  }`}
                >
                  <TextField.Slot>
                    <EnvelopeClosedIcon 
                      height="16" 
                      width="16" 
                      className={errors.email ? 'text-red-400' : 'text-gray-400'}
                    />
                  </TextField.Slot>
                  <TextField.Input
                    {...register("email")}
                    placeholder="seuemail@exemplo.com"
                    type="email"
                    autoComplete="email"
                    className="text-gray-900"
                  />
                </TextField.Root>
                <AnimatePresence mode="wait">
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Flex align="center" gap="1" className="mt-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                        <Text size="1" color="red">
                          {errors.email.message}
                        </Text>
                      </Flex>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>

            {/* Password Field */}
            <motion.div
              custom={1}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <Box>
                <Text as="label" size="2" className="block font-medium mb-2 text-gray-700">
                  Senha
                </Text>
                <TextField.Root 
                  size="3"
                  className={`transition-all duration-200 ${
                    errors.senha ? 'ring-2 ring-red-200' : 'focus-within:ring-2 focus-within:ring-blue-200'
                  }`}
                >
                  <TextField.Slot>
                    <LockClosedIcon 
                      height="16" 
                      width="16"
                      className={errors.senha ? 'text-red-400' : 'text-gray-400'}
                    />
                  </TextField.Slot>
                  <TextField.Input
                    {...register("senha")}
                    placeholder="Digite sua senha"
                    type={isVisible ? "text" : "password"}
                    autoComplete="current-password"
                    className="text-gray-900"
                  />
                  <TextField.Slot>
                    <IconButton 
                      size="1" 
                      variant="ghost" 
                      type="button" 
                      onClick={toggleVisibility}
                      className="hover:bg-gray-100 transition-colors"
                      aria-label={isVisible ? "Esconder senha" : "Mostrar senha"}
                    >
                      {isVisible ? 
                        <EyeClosedIcon height="16" width="16" className="text-gray-500" /> : 
                        <EyeOpenIcon height="16" width="16" className="text-gray-500" />
                      }
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
                <AnimatePresence mode="wait">
                  {errors.senha && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Flex align="center" gap="1" className="mt-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                        <Text size="1" color="red">
                          {errors.senha.message}
                        </Text>
                      </Flex>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              custom={2}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                size="3"
                type="submit"
                disabled={isLoading || !isValid || !isDirty}
                className={`
                  w-full font-semibold transition-all duration-300 
                  ${isLoading || !isValid || !isDirty 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
                variant="solid"
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
                    <motion.span
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Entrar
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Forgot Password Link
            <motion.div
              custom={3}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <Separator size="4" className="my-6" />
              <Text size="2" className="text-gray-600">
                Esqueceu sua senha?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  onClick={() => toast.info("Funcionalidade em breve!")}
                >
                  Recuperar senha
                </button>
              </Text>
            </motion.div> */}
          </form>
        </Card>
      </motion.div>
    </div>
  );
}