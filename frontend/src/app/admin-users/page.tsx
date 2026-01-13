"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers, resetUserPassword } from "../services/User.Services";
import { IUsuario } from "../interfaces/IUsuario";
import { toast } from "sonner";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Spinner,
    Card,
    CardHeader,
    CardBody,
} from "@nextui-org/react";

import IconUsers from "../assets/icons/IconUsers";

// Roles permitidas para acessar esta página
const ALLOWED_ROLES = ["Administrador", "Diretor", "SuporteTecnico"];

export default function AdminUsersPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<IUsuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<IUsuario | null>(null);
    const [resetting, setResetting] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Verifica autorização
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (user && !ALLOWED_ROLES.includes(user.role)) {
            toast.error("Você não tem permissão para acessar esta página");
            router.push("/");
            return;
        }

        loadUsers();
    }, [isAuthenticated, user, router]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    };

    const handleResetClick = (usuario: IUsuario) => {
        setSelectedUser(usuario);
        onOpen();
    };

    const confirmReset = async () => {
        if (!selectedUser?.id) return;

        try {
            setResetting(true);
            await resetUserPassword(selectedUser.id);
            toast.success(`Senha de ${selectedUser.nome} resetada com sucesso!`);
            onClose();
        } catch (error) {
            toast.error("Erro ao resetar senha");
        } finally {
            setResetting(false);
            setSelectedUser(null);
        }
    };

    const getStatusChip = (isActive: boolean | undefined) => {
        return isActive ? (
            <Chip color="success" variant="flat" size="sm">
                Ativo
            </Chip>
        ) : (
            <Chip color="danger" variant="flat" size="sm">
                Inativo
            </Chip>
        );
    };

    const getCargoChip = (cargo: string | undefined) => {
        const colorMap: Record<string, "primary" | "secondary" | "warning" | "default"> = {
            Administrador: "primary",
            Diretor: "secondary",
            SuporteTecnico: "warning",
        };
        return (
            <Chip color={colorMap[cargo || ""] || "default"} variant="flat" size="sm">
                {cargo || "N/A"}
            </Chip>
        );
    };

    // Se não autenticado ou sem permissão, não renderiza
    if (!isAuthenticated || (user && !ALLOWED_ROLES.includes(user.role))) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <Card className="shadow-lg">
                <CardHeader className="flex gap-3 bg-gradient-to-r from-master_black to-gray-800 text-white rounded-t-lg">
                    <IconUsers className="text-2xl" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold">Gerenciamento de Usuários</h1>
                        <p className="text-small text-white/70">
                            Lista de usuários cadastrados no sistema
                        </p>
                    </div>
                </CardHeader>
                <CardBody>
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <Spinner size="lg" label="Carregando usuários..." />
                        </div>
                    ) : (
                        <Table
                            aria-label="Tabela de usuários"
                            isStriped
                            classNames={{
                                wrapper: "min-h-[400px]",
                            }}
                        >
                            <TableHeader>
                                <TableColumn>NOME</TableColumn>
                                <TableColumn>EMAIL</TableColumn>
                                <TableColumn>CARGO</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn align="center">AÇÕES</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="Nenhum usuário encontrado">
                                {users.map((usuario) => (
                                    <TableRow key={usuario.id}>
                                        <TableCell className="font-medium">
                                            {usuario.nome}
                                        </TableCell>
                                        <TableCell>{usuario.email}</TableCell>
                                        <TableCell>{getCargoChip(usuario.cargo)}</TableCell>
                                        <TableCell>{getStatusChip(usuario.isActive)}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                color="warning"
                                                variant="flat"
                                                onPress={() => handleResetClick(usuario)}
                                            >
                                                Resetar Senha
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            {/* Modal de confirmação */}
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Confirmar Reset de Senha
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            Você tem certeza que deseja resetar a senha do usuário{" "}
                            <strong>{selectedUser?.nome}</strong>?
                        </p>
                        <p className="text-small text-gray-500">
                            A senha será redefinida para o padrão: <code>1234</code>
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="default"
                            variant="light"
                            onPress={onClose}
                            isDisabled={resetting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            color="warning"
                            onPress={confirmReset}
                            isLoading={resetting}
                        >
                            Confirmar Reset
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
