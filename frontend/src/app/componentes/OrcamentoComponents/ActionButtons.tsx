"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, ShieldCheck, X, AlertTriangle, Loader2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrcamentoPDF from '@/app/componentes/OrcamentoPDF';

type ActionButtonsProps = {
  isPaid?: boolean;
  orcamento: any;
  materiais: any[];
  onAuthorize: () => void;
};

export function ActionButtons({ isPaid, orcamento, materiais, onAuthorize }: ActionButtonsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const canAuthorize = confirmText === "AUTORIZAR";

  const handleAuthorizeClick = async () => {
    setIsAuthorizing(true);
    await onAuthorize();
    setIsConfirmOpen(false);
    setConfirmText("");
    setIsAuthorizing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Ações</h2>
        <p className="text-sm text-gray-500">Finalize ou exporte o orçamento</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        {/* Authorize Button */}
        {!isPaid && (
          <motion.button
            onClick={() => setIsConfirmOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25 transition-all"
          >
            <ShieldCheck className="w-5 h-5" />
            Autorizar Orçamento
          </motion.button>
        )}

        {/* Status if authorized */}
        {isPaid && (
          <div className="py-3.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-medium text-emerald-700">Orçamento Autorizado</span>
          </div>
        )}

        {/* PDF Download Button */}
        <PDFDownloadLink
          document={
            <OrcamentoPDF
              materiaisOrcamento={materiais}
              orcamento={orcamento}
            />
          }
          fileName={`Orcamento_${orcamento?.id}.pdf`}
          className="w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
        >
          <FileDown className="w-5 h-5" />
          Gerar PDF
        </PDFDownloadLink>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar Autorização</h3>
                <p className="text-gray-500">
                  Você está prestes a autorizar o <strong>Orçamento Nº {orcamento?.id}</strong>. 
                  Esta ação é irreversível e irá dar baixa nos materiais do estoque.
                </p>
              </div>

              {/* Confirmation Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para confirmar, digite <strong className="text-red-500">AUTORIZAR</strong> abaixo:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="AUTORIZAR"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none text-center font-mono text-lg"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-medium border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  onClick={handleAuthorizeClick}
                  disabled={!canAuthorize || isAuthorizing}
                  whileHover={canAuthorize ? { scale: 1.02 } : {}}
                  whileTap={canAuthorize ? { scale: 0.98 } : {}}
                  className={`
                    flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                    ${canAuthorize && !isAuthorizing
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isAuthorizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Autorizando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Confirmar
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}