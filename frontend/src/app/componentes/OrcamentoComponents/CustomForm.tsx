"use client";

import { motion } from "framer-motion";
import { User, MapPin, Mail, Hash, Phone, MessageSquare, Percent, CreditCard } from 'lucide-react';

type BudgetState = {
  nomeCliente: string;
  endereco: string;
  emailCliente: string;
  cpfOrCnpj: string;
  telefone: string;
  observacoes: string;
  metodoPagamento: string;
  desconto: string;
};

type CustomerFormProps = {
  formState: BudgetState;
  onFormChange: (field: keyof BudgetState, value: string) => void;
  onBlur: () => void;
};

export function CustomerForm({ formState, onFormChange, onBlur }: CustomerFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden"
    >
      {/* Card Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Dados do Cliente</h2>
            <p className="text-sm text-gray-500">Informações de contato e identificação</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Nome do Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Cliente
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formState.nomeCliente}
                onChange={(e) => onFormChange('nomeCliente', e.target.value)}
                onBlur={onBlur}
                placeholder="Nome completo"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
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
                value={formState.endereco}
                onChange={(e) => onFormChange('endereco', e.target.value)}
                onBlur={onBlur}
                placeholder="Rua, número, bairro"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
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
                value={formState.emailCliente}
                onChange={(e) => onFormChange('emailCliente', e.target.value)}
                onBlur={onBlur}
                placeholder="email@exemplo.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
          </div>

          {/* CPF/CNPJ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF/CNPJ
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Hash className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formState.cpfOrCnpj}
                onChange={(e) => onFormChange('cpfOrCnpj', e.target.value)}
                onBlur={onBlur}
                placeholder="000.000.000-00"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
          </div>

          {/* Telefone */}
          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={formState.telefone}
                onChange={(e) => onFormChange('telefone', e.target.value)}
                onBlur={onBlur}
                placeholder="(31) 99999-9999"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma de Pagamento
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
              <select
                value={formState.metodoPagamento}
                onChange={(e) => onFormChange('metodoPagamento', e.target.value)}
                onBlur={onBlur}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="PIX">PIX</option>
                <option value="Boleto">Boleto</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Transferência">Transferência</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
          </div>

          {/* Desconto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desconto (%)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Percent className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formState.desconto}
                onChange={(e) => onFormChange('desconto', e.target.value)}
                onBlur={onBlur}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Percentual de desconto sobre o total</p>
          </div>
        </div>

        {/* Observações */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              Observações
            </div>
          </label>
          <textarea
            value={formState.observacoes}
            onChange={(e) => onFormChange('observacoes', e.target.value)}
            onBlur={onBlur}
            placeholder="Observações adicionais sobre o orçamento..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
}