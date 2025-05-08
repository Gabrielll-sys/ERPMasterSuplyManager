"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authenticate } from "@/app/services/Auth.services";

// Radix UI Themes Components
import { Button, TextField, Card, Flex, Box, Heading, Text, Link, IconButton } from "@radix-ui/themes";

// Radix UI Icons (ou use Heroicons/outros se preferir)
import { EnvelopeClosedIcon, LockClosedIcon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';

// MUI Snackbar (mantendo por enquanto)
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { Spinner } from "@nextui-org/react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  // Estados do Formulário
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados do Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: AlertColor }>({ open: false, message: "" });
  const openSnackbar = (message: string, severity: AlertColor) => setSnackbar({ open: true, message, severity });

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/reports"); // Ou sua rota principal
    }
  }, [isAuthenticated, router]);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const credentials = { email, senha };

    try {
      const responseStatus = await authenticate(credentials);
      if (responseStatus === 200) {
        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (userData.token) {
          login(userData.token, userData.userId, userData.userName, userData.role);
          // O useEffect cuidará do redirecionamento
        } else {
          throw new Error("Dados do usuário não encontrados após autenticação.");
        }
      } else if (responseStatus === 401) {
        openSnackbar("Email ou Senha incorretas.", "warning");
      } else if (responseStatus === 403) {
        openSnackbar("Você não possui mais permissão de acesso.", "warning");
      } else {
        openSnackbar("Erro desconhecido ao tentar fazer login.", "error");
      }
    } catch (error) {
      console.error("Erro na função authenticate:", error);
      openSnackbar("Erro ao realizar login. Verifique sua conexão ou tente mais tarde.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Flex
        align="center"
        justify="center"
        className="min-h-screen bg-gradient-to-t from-light_yellow from-5% via-white to-white px-4 py-10" // Adicionado py-10 para espaço vertical
      >
        <Card size="4" className="w-full max-w-md shadow-xl"> {/* Usando Card Radix */}
          {/* Cabeçalho Simulado */}
          <Box className="text-center pb-6">
            {/* <Image src="/path/to/your/logo.png" width={100} height={50} alt="Logo" /> */}
            <Heading size="7" mb="1">Entrar</Heading>
            <Text size="2" color="gray">Acesse sua conta</Text>
          </Box>

          <form onSubmit={handleLoginSubmit}>
            {/* Corpo do Card */}
            <Flex direction="column" gap="5">
              <Box>
                <Text as="label" size="2" mb="1" className="block font-medium">Email</Text>
                <TextField.Root>
                  <TextField.Slot>
                    <EnvelopeClosedIcon height="16" width="16" />
                  </TextField.Slot>
                  <TextField.Input
                    size="3" // Tamanho dos inputs Radix
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    autoComplete="email"
                  />
                </TextField.Root>
                 {/* Exemplo de mensagem de erro simples (pode ser aprimorado) */}
                {/* {!email && <Text size="1" color="red" mt="1">Email é obrigatório.</Text>} */}
              </Box>

              <Box>
                <Text as="label" size="2" mb="1" className="block font-medium">Senha</Text>
                <TextField.Root>
                  <TextField.Slot>
                    <LockClosedIcon height="16" width="16" />
                  </TextField.Slot>
                  <TextField.Input
                    size="3"
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    type={isVisible ? "text" : "password"}
                    required
                    autoComplete="current-password"
                  />
                  <TextField.Slot>
                    <IconButton size="1" variant="ghost" type="button" onClick={toggleVisibility} aria-label={isVisible ? "Esconder senha" : "Mostrar senha"}>
                      {isVisible ? <EyeClosedIcon height="16" width="16"/> : <EyeOpenIcon height="16" width="16"/>}
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
                 {/* Exemplo de mensagem de erro */}
                {/* {!senha && <Text size="1" color="red" mt="1">Senha é obrigatória.</Text>} */}
              </Box>

              {/* Link "Esqueci senha" (opcional) */}
              {/* <Flex justify="end">
                <Link href="#" size="2">Esqueci minha senha?</Link>
              </Flex> */}

            </Flex>

            {/* Footer Simulado */}
            <Flex direction="column" gap="4" pt="6">
              <Button
                size="3"
                type="submit"
                disabled={isLoading || !email || !senha}
                className="bg-master_black text-white font-bold cursor-pointer" // Classe customizada
                
                variant="solid" // Variante padrão Radix
              >
                {isLoading && <Spinner size="sm" />} 
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              {/* Link "Criar conta" (opcional) */}
              {/* <Separator size="4" />
              <Text size="2" align="center">
                Não tem uma conta? <Link href="/register" size="2">Crie uma</Link>
              </Text> */}
            </Flex>
          </form>
        </Card>
      </Flex>

      {/* Snackbar (mantido como está) */}
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}