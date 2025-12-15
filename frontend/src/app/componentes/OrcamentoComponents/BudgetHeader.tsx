"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle2, Clock } from 'lucide-react';

type BudgetHeaderProps = {
  budgetId?: number;
  onBack: () => void;
  isPaid?: boolean;
};

export function BudgetHeader({ budgetId, onBack, isPaid }: BudgetHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mb-6 sm:mb-8 rounded-b-2xl sm:rounded-b-3xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-blue-400 font-medium text-xs sm:text-sm hidden xs:inline">Editar Orçamento</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold truncate">
              Orçamento <span className="text-blue-400">#{budgetId || '...'}</span>
            </h1>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`
          flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full flex-shrink-0
          ${isPaid 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-amber-500/20 text-amber-400'
          }
        `}>
          {isPaid ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-medium text-xs sm:text-sm hidden sm:inline">Autorizado</span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-medium text-xs sm:text-sm hidden sm:inline">Em Edição</span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}