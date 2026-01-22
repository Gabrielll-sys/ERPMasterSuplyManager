"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "dayjs/locale/pt-br";
import { url } from '@/app/api/webApiUrl';
import { poster } from '@/app/lib/api';
import dayjs from 'dayjs';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import { toast } from 'sonner';

// Icons
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  ArrowLeft,
  Plus,
  CreditCard,
  Loader2,
  Search,
  Check,
  X
} from 'lucide-react';

// Interface para cliente encontrado
interface ClienteEncontrado {
  nomeCliente: string;
  cpfOrCnpj: string;
  telefone: string;
  endereco: string;
  emailCliente: string;
}

// Hook de debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CreateBudge() {
  const route = useRouter()
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [nomeCliente, setNomeCliente] = useState<string>("")
  const [emailCliente, setEmailCliente] = useState<string>("")
  const [telefone, setTelefone] = useState<string>("")
  const [cpfOrCnpj, setCpfOrCnpj] = useState<string>("")
  const [endereco, setEndereco] = useState<string>("")
  const [isCreating, setIsCreating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Autocomplete states
  const [showDropdown, setShowDropdown] = useState(false);
  const [clientes, setClientes] = useState<ClienteEncontrado[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<ClienteEncontrado | null>(null);
  
  const debouncedNome = useDebounce(nomeCliente, 400);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user != null) {
        setCurrentUser(user)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função para consolidar clientes duplicados, priorizando registros com mais informações
  const consolidateClientes = (clientesList: ClienteEncontrado[]): ClienteEncontrado[] => {
    const clienteMap = new Map<string, ClienteEncontrado>();
    
    clientesList.forEach(cliente => {
      const nomeNormalizado = (cliente.nomeCliente || '').toLowerCase().trim();
      if (!nomeNormalizado) return;
      
      const existente = clienteMap.get(nomeNormalizado);
      
      if (!existente) {
        clienteMap.set(nomeNormalizado, { ...cliente });
      } else {
        // Mescla as informações, priorizando campos preenchidos
        clienteMap.set(nomeNormalizado, {
          nomeCliente: existente.nomeCliente || cliente.nomeCliente,
          cpfOrCnpj: existente.cpfOrCnpj || cliente.cpfOrCnpj,
          telefone: existente.telefone || cliente.telefone,
          endereco: existente.endereco || cliente.endereco,
          emailCliente: existente.emailCliente || cliente.emailCliente,
        });
      }
    });
    
    return Array.from(clienteMap.values());
  };

  // Search clients when typing
  useEffect(() => {
    const searchClientes = async () => {
      if (!debouncedNome.trim() || debouncedNome.length < 2 || selectedCliente) {
        setClientes([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${url}/Orcamentos/buscaNomeCliente?cliente=${encodeURIComponent(debouncedNome.trim())}`, 
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentUser?.token || ''}`
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          let clientesList: ClienteEncontrado[] = [];
          
          if (Array.isArray(data) && data.length > 0) {
            clientesList = data;
          } else if (data && !Array.isArray(data)) {
            clientesList = [data];
          }
          
          // Consolida clientes duplicados, priorizando registros com mais informações
          const consolidados = consolidateClientes(clientesList);
          
          if (consolidados.length > 0) {
            setClientes(consolidados);
            setShowDropdown(true);
          } else {
            setClientes([]);
            setShowDropdown(false);
          }
        } else {
          setClientes([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setClientes([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchClientes();
  }, [debouncedNome, currentUser?.token, selectedCliente]);

  const handleNomeChange = (value: string) => {
    setNomeCliente(value);
    setSelectedCliente(null);
    if (!value.trim()) {
      clearForm();
    }
  };

  const clearForm = () => {
    setCpfOrCnpj("");
    setTelefone("");
    setEndereco("");
    setEmailCliente("");
    setSelectedCliente(null);
  };

  const handleSelectCliente = (cliente: ClienteEncontrado) => {
    setNomeCliente(cliente.nomeCliente || "");
    setCpfOrCnpj(cliente.cpfOrCnpj || "");
    setTelefone(cliente.telefone || "");
    setEndereco(cliente.endereco || "");
    setEmailCliente(cliente.emailCliente || "");
    setSelectedCliente(cliente);
    setShowDropdown(false);
    toast.success("Cliente selecionado!", { description: "Dados preenchidos automaticamente" });
  };

  const handleClearSelection = () => {
    setNomeCliente("");
    clearForm();
    inputRef.current?.focus();
  };

  const handleCreateBudge = async () => {
    setIsCreating(true);

    try {
      const orcamento: IOrcamento = {
        nomeCliente: nomeCliente?.trim().replace(/\s\s+/g, " "),
        emailCliente: emailCliente?.trim().replace(/\s\s+/g, " "),
        telefone: telefone,
        endereco: endereco.trim().replace(/\s\s+/g, " "),
        cpfOrCnpj: cpfOrCnpj,
        desconto: 0,
        tipoPagamento: "Cartão de Crédito",
        responsavelOrcamento: currentUser?.userName
      }

      const data = await poster<{ id: number }>(`${url}/Orcamentos`, orcamento);

      toast.success("Orçamento criado com sucesso!");
      route.push(`/edit-budge/${data.id}`);
    } catch (error) {
      // Error já é tratado pelo interceptor
    } finally {
      setIsCreating(false);
    }
  }

  const isFormValid = nomeCliente.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <motion.button
              onClick={() => route.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-blue-400 font-medium text-sm">Novo Orçamento</span>
              </div>
              <h1 className="text-2xl font-bold">Informações do Cliente</h1>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden"
        >
          {/* Card Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Dados do Cliente</h2>
                <p className="text-sm text-gray-500">Digite o nome para buscar ou preencha manualmente</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome do Cliente + Autocomplete */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Cliente *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={nomeCliente}
                    onChange={(e) => handleNomeChange(e.target.value)}
                    onFocus={() => clientes.length > 0 && setShowDropdown(true)}
                    placeholder="Digite para buscar cliente..."
                    className={`
                      w-full pl-12 pr-12 py-3.5 rounded-xl border-2 bg-gray-50 text-gray-900 
                      placeholder-gray-400 focus:ring-4 transition-all outline-none
                      ${selectedCliente 
                        ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                      }
                    `}
                  />
                  {selectedCliente && (
                    <button
                      onClick={handleClearSelection}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  )}
                  
                  {/* Selected indicator */}
                  {selectedCliente && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showDropdown && clientes.length > 0 && (
                      <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-64 overflow-y-auto"
                      >
                        <div className="p-2">
                          <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                            Clientes encontrados
                          </p>
                          {clientes.map((cliente, index) => (
                            <button
                              key={`${cliente.nomeCliente}-${index}`}
                              onClick={() => handleSelectCliente(cliente)}
                              className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                  <User className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {cliente.nomeCliente}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {cliente.cpfOrCnpj || cliente.emailCliente || 'Sem informações adicionais'}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {selectedCliente 
                    ? "✓ Cliente selecionado - dados preenchidos automaticamente"
                    : "Digite pelo menos 2 caracteres para buscar clientes cadastrados"
                  }
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={emailCliente}
                    onChange={(e) => setEmailCliente(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(31) 99999-9999"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              {/* CPF/CNPJ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF ou CNPJ
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={cpfOrCnpj}
                    onChange={(e) => setCpfOrCnpj(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, número, bairro"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <motion.button
                  type="button"
                  onClick={() => route.back()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCreateBudge}
                  disabled={!isFormValid || isCreating}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                  className={`
                    px-8 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                    ${!isFormValid || isCreating
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
                    }
                  `}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Criar Orçamento
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-100"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Próximos passos</h3>
              <p className="text-sm text-blue-700">
                Após criar o orçamento, você será redirecionado para adicionar materiais. 
                O orçamento poderá ser editado e finalizado a qualquer momento.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}