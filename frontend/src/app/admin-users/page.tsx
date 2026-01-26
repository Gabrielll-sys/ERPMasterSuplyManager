"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createSystemUser, getAllUsers, resetUserPassword, turnUserInactive, turnUserActive } from "../services/User.Services";
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
    Input,
    Chip,
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
    const [deactivating, setDeactivating] = useState(false);
    // Estado do formulario de criacao de usuario.
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    // Controle de feedback e bloqueio apos criacao.
    const [createdBadge, setCreatedBadge] = useState(false);
    const [cooldown, setCooldown] = useState(false);
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

    const confirmDeactivate = async () => {
        if (!selectedUser?.id) return;

        try {
            setDeactivating(true);
            await turnUserInactive(selectedUser.id);
            toast.success(`Usuário ${selectedUser.nome} foi desativado com sucesso!`);
            onClose();
            // Recarrega a lista para atualizar o status
            await loadUsers();
        } catch (error) {
            toast.error("Erro ao desativar usuário");
        } finally {
            setDeactivating(false);
            setSelectedUser(null);
        }
    };

    const confirmActivate = async () => {
        if (!selectedUser?.id) return;

        try {
            setDeactivating(true); // Reutilizando o estado
            await turnUserActive(selectedUser.id);
            toast.success(`Usuário ${selectedUser.nome} foi reativado com sucesso!`);
            onClose();
            // Recarrega a lista para atualizar o status
            await loadUsers();
        } catch (error) {
            toast.error("Erro ao reativar usuário");
        } finally {
            setDeactivating(false);
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

    // Valida o formulario antes de enviar para API.
    const validateNewUser = () => {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!newUserName.trim()) {
            toast.error("Nome e obrigatorio");
            return false;
        }
        if (!emailRegex.test(newUserEmail)) {
            toast.error("Email invalido");
            return false;
        }
        return true;
    };

    // Cria usuario no sistema com cargo padrao.
    const handleCreateUser = async () => {
        if (!validateNewUser()) return;

        try {
            setIsCreating(true);
            await createSystemUser({
                nome: newUserName.trim(),
                email: newUserEmail.trim(),
                cargo: "Usuario",
            });
            toast.success("Usuario criado com sucesso");
            setNewUserName("");
            setNewUserEmail("");
            setCreatedBadge(true);
            setCooldown(true);
            setTimeout(() => {
                setCreatedBadge(false);
                setCooldown(false);
            }, 3000);
            await loadUsers();
        } catch (error) {
            toast.error("Erro ao criar usuario");
        } finally {
            setIsCreating(false);
        }
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

            {/* Formulario de criacao de usuario para perfis autorizados. */}
            <Card className="shadow-lg mb-6">
                <CardHeader className="flex gap-3 bg-gradient-to-r from-master_black to-gray-800 text-white rounded-t-lg">
                    <IconUsers className="text-2xl" />
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">Criar Usuario</h2>
                        <p className="text-small text-white/70">
                            Informe nome e email. Cargo padrao: Usuario.
                        </p>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Campo de nome do usuario. */}
                        <Input
                            label="Nome"
                            placeholder="Ex: Maria Silva"
                            value={newUserName}
                            onValueChange={setNewUserName}
                            isRequired
                        />
                        {/* Campo de email do usuario. */}
                        <Input
                            label="Email"
                            placeholder="exemplo@empresa.com"
                            type="email"
                            value={newUserEmail}
                            onValueChange={setNewUserEmail}
                            isRequired
                        />
                    </div>
                    {/* Acao de criacao com senha padrao no backend. */}
                    <div className="flex items-center justify-end gap-3 mt-4">
                        {createdBadge && (
                            <Chip color="success" variant="flat" size="sm">
                                Usuario criado
                            </Chip>
                        )}
                        <Button
                            color="primary"
                            onPress={handleCreateUser}
                            isLoading={isCreating}
                            isDisabled={cooldown || isCreating}
                        >
                            Criar Usuario
                        </Button>
                    </div>
                </CardBody>
            </Card>

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
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="lg">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Gerenciar Usuário: {selectedUser?.nome}
                    </ModalHeader>
                    <ModalBody>
                        {/* Seção de Reset de Senha */}
                        <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                            <h4 className="font-semibold text-warning-700 mb-2">
                                🔑 Resetar Senha
                            </h4>
                            <p className="text-small text-gray-600 mb-3">
                                A senha do usuário será redefinida para o padrão: <code className="bg-gray-200 px-1 rounded">1234</code>
                            </p>
                            <Button
                                color="warning"
                                onPress={confirmReset}
                                isLoading={resetting}
                                isDisabled={deactivating}
                                size="sm"
                            >
                                Resetar Senha
                            </Button>
                        </div>

                        {/* Seção de Desativação - só mostra se o usuário estiver ativo */}
                        {selectedUser?.isActive && (
                            <div className="p-4 bg-danger-50 rounded-lg border border-danger-200 mt-4">
                                <h4 className="font-semibold text-danger-700 mb-2">
                                    🚫 Desativar Usuário
                                </h4>
                                <p className="text-small text-gray-600 mb-3">
                                    Ao desativar, o usuário <strong>não poderá mais fazer login</strong> no sistema.
                                    Esta ação pode ser revertida posteriormente.
                                </p>
                                <Button
                                    color="danger"
                                    onPress={confirmDeactivate}
                                    isLoading={deactivating}
                                    isDisabled={resetting}
                                    size="sm"
                                >
                                    Desativar Usuário
                                </Button>
                            </div>
                        )}

                        {!selectedUser?.isActive && (
                            <div className="p-4 bg-success-50 rounded-lg border border-success-200 mt-4">
                                <h4 className="font-semibold text-success-700 mb-2">
                                    ✅ Reativar Usuário
                                </h4>
                                <p className="text-small text-gray-600 mb-3">
                                    Este usuário está <strong>inativo</strong>. Ao reativar, ele poderá fazer login novamente no sistema.
                                </p>
                                <Button
                                    color="success"
                                    onPress={confirmActivate}
                                    isLoading={deactivating}
                                    isDisabled={resetting}
                                    size="sm"
                                >
                                    Reativar Usuário
                                </Button>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="default"
                            variant="light"
                            onPress={onClose}
                            isDisabled={resetting || deactivating}
                        >
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
