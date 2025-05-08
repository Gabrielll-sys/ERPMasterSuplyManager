"use client"
import { isTokenValid } from "@/app/services/Auth.services";
import MuiAlert from "@mui/material/Alert";
import { Button, Input } from '@nextui-org/react';
import { AlertColor, Snackbar } from '@mui/material';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "dayjs/locale/pt-br";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import MailIcon from "@/app/assets/icons/MailIcon";
import { authenticate } from "@/app/services/Auth.services";
import { useAuth } from "@/contexts/AuthContext";

export default function Login(){
    const route = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const [senha, setSenha] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        if (isAuthenticated) {
            route.push("/create-material");
        }
    }, [isAuthenticated]);

    const loginUser = async () => {
        const user = {
            email: email,
            senha: senha
        };
        
        try {
            const response = await authenticate(user);
            if (response === 200) {
                // Usar o contexto de autenticação para login
                const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
                login(userData.token, userData.userId, userData.userName, userData.role);
                route.push("/reports");
            } else if (response === 401) {
                setOpenSnackBar(true);
                setSeveridadeAlert("warning");
                setMessageAlert("Email ou Senha incorretas");
            } else if (response === 403) {
                setOpenSnackBar(true);
                setSeveridadeAlert("warning");
                setMessageAlert("Você Não possui mais permissão de acesso");
            }
        } catch (error) {
            setOpenSnackBar(true);
            setSeveridadeAlert("error");
            setMessageAlert("Erro ao realizar login");
        }
    };

    return(
        <>
            <div className='justify-center items-center  flex flex-col 
              h-[35vh] max-sm:h-[75vh] m-auto w-[20%] gap-4 rounded-sm shadow-black shadow-md border-1 border-black'>
                <Input
                    labelPlacement='outside'
                    value={email}
                    className="border-1 border-black justify-center rounded-md shadow-sm shadow-black max-w-2xl  w-[60%]"
                    onValueChange={setEmail}
                    label="Email"
                    endContent={
                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"  />
                    }
                />
                <Input
                    labelPlacement='outside'
                    value={senha}
                    className="border-1 border-black rounded-md shadow-sm shadow-black max-w-3xl w-[60%]"
                    onValueChange={setSenha}
                    label="Senha"
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                />

                <Button onPress={loginUser} className='bg-master_black text-white p-4 rounded-lg font-bold text-base shadow-lg'>
                    Entrar
                </Button>
            </div>

            <Snackbar
                open={openSnackBar}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                autoHideDuration={2000}
                onClose={(e) => setOpenSnackBar(false)}
            >
                <MuiAlert
                    onClose={(e) => setOpenSnackBar(false)}
                    severity={severidadeAlert}
                    sx={{ width: "100%" }}
                >
                    {messageAlert}
                </MuiAlert>
            </Snackbar>
        </>
    );
}
