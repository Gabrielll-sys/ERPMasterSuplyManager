// 🎓 ARQUIVO DE CONFIGURAÇÃO ATUALIZADO
// O objetivo aqui é integrar as novas animações do Radix UI
// com o mínimo de disrupção ao sistema existente baseado em NextUI.

import type { Config } from 'tailwindcss';
const { nextui } = require("@nextui-org/react");

const config: Config = {
  // 🎓 content: Caminhos para o Tailwind escanear.
  content: [

    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // ✅ MANTIDO: Caminho essencial para os temas e componentes do NextUI.
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    

  ],

  theme: {
    // 🎓 extend: Adicionamos nossas customizações aqui para não sobrescrever o tema padrão.
    extend: {
      // ✅ MANTIDO: Suas configurações de `backgroundImage` e `colors`.
      // Elas continuarão funcionando normalmente.
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        light: "#FBFEF9",
        dark: "#100C08",
        green: "#3d9970",
        grey: "#3b4849",
        master_black: "#2A2E48",
        master_yellow: "#FCDD74",
        light_yellow: "#FBEED1",
        cardbg_color: "#404040",
      },
      // ✅ MANTIDO: Sua configuração de `fontFamily`.
      fontFamily: {
        sans: ['Roboto', 'Sans-serif'],
      },

      // ✨ ADICIONADO: Keyframes e animações para os componentes Radix.
      // 🤔 PORQUÊ: Esta é a única adição necessária para que os componentes
      // `Dialog` e `DropdownMenu` do Radix UI tenham transições suaves.
      // Eles não conflitam com o NextUI, pois são classes utilitárias
      // (`animate-overlayShow`, `animate-contentShow`) que só serão
      // aplicadas onde você as usar explicitamente.
      keyframes: {
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        contentShow: {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },

  // ✅ MANTIDO: Estratégia de modo escuro.
  darkMode: "class",

  // 🎓 plugins:
  plugins: [
    // ✅ MANTIDO: O plugin do NextUI.
    nextui({
      addCommonColors: true,
    }),
    
    // ❌ REMOVIDO: A chamada duplicada `nextui()`.
    // 🤔 PORQUÊ: Chamar o mesmo plugin duas vezes é desnecessário e pode levar
    // a comportamentos inesperados ou aumento no tempo de build.

    // ❌ REMOVIDO: O plugin comentado do Flowbite.
    // 🤔 PORQUÊ: Clean code. Removemos código que não está em uso.
    //  require('flowbite/plugin'),
  ],
};

export default config;