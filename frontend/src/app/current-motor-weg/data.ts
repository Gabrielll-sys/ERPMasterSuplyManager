// 🎓 CONCEITO: Fonte Única da Verdade (Single Source of Truth)
// 📝 O QUE FAZ: Centralizamos nossos dados estáticos em um único local.
// 🤔 PORQUÊ: Evita a recriação de dados em cada render do componente, melhora a performance e
//    facilita a manutenção. Se precisarmos atualizar um valor de corrente, mudamos em um só lugar.
// 📊 EFEITO: Código mais organizado, performático e de fácil manutenção.

export interface IMotor {
  potencia: number; // Em CV
  correntes: {
    '220V': number;
    '380V': number;
    '440V': number;
  };
}

  export const motores: IMotor[] = [
    { potencia: 0.16, correntes: { '220V': 0.86, '380V': 0.50, '440V': 0.43 } },
    { potencia: 0.25, correntes: { '220V': 1.13, '380V': 0.65, '440V': 0.57 } },
    { potencia: 0.33, correntes: { '220V': 1.47, '380V': 0.85, '440V': 0.74 } },
    { potencia: 0.5, correntes: { '220V': 2.07, '380V': 1.20, '440V': 1.04 } },
    { potencia: 0.75 ,correntes: { '220V': 2.83, '380V': 1.64, '440V': 1.42 } },
    { potencia: 1, correntes: { '220V': 2.98, '380V': 1.73, '440V': 1.49 } },
    { potencia: 1.5, correntes: { '220V': 4.42, '380V': 2.56, '440V': 2.21 } },
    { potencia: 2, correntes: { '220V': 6.2, '380V': 3.56, '440V': 3.08 } },
    { potencia: 3, correntes: { '220V': 8.3, '380V': 4.79, '440V': 4.14 } },
    { potencia: 4, correntes: { '220V': 11, '380V': 6.43, '440V': 5.55 } },
    { potencia: 5, correntes: { '220V': 14, '380V': 7.99, '440V': 6.90 } },
    { potencia: 6, correntes: { '220V': 16, '380V': 9.49, '440V': 8.20 } },
    { potencia: 7.5, correntes: { '220V': 20, '380V': 11.58, '440V': 10 } },
    { potencia: 10, correntes: { '220V': 26.4, '380V': 15.28, '440V': 13.20 } },
    { potencia: 12.5, correntes: { '220V': 32, '380V': 18.53, '440V': 16 } },
    { potencia: 15, correntes: { '220V': 38.6, '380V': 22.35, '440V': 19.30 } },
    { potencia: 20, correntes: { '220V': 53.3, '380V': 30.86, '440V': 26.65 } },
    { potencia: 25, correntes: { '220V': 64.7 , '380V': 37.46, '440V': 32.35 } },
    { potencia: 30, correntes: { '220V': 73.9 , '380V': 42.78, '440V': 36.95 } },
    { potencia: 40, correntes: { '220V': 99.6 , '380V': 57.66, '440V': 49.80 } },
    { potencia: 60, correntes: { '220V': 146 , '380V': 84.53, '440V': 73 } },
    { potencia: 75, correntes: { '220V': 174 , '380V': 100.74, '440V': 87 } },
    { potencia: 100, correntes: { '220V': 245 , '380V': 141.84, '440V': 122.50 } },
    { potencia: 125, correntes: { '220V': 292 , '380V': 169.05, '440V': 146 } },
    { potencia: 150, correntes: { '220V': 353 , '380V': 204.37, '440V': 176.50 } },
    { potencia: 175, correntes: { '220V': 418 , '380V': 242, '440V': 209 } },
    { potencia: 200, correntes: { '220V': 474 , '380V': 274.42, '440V': 237 } },
    { potencia: 200, correntes: { '220V': 591 , '380V': 342.16, '440V': 295.50 } },
    { potencia: 300, correntes: { '220V': 691 , '380V': 400.05, '440V': 345.50 } },
    { potencia: 350, correntes: { '220V': 817 , '380V': 473, '440V': 408.50 } },
    { potencia: 400, correntes: { '220V': 930 , '380V': 538.42, '440V': 465 } },
    { potencia: 450, correntes: { '220V': 1020 , '380V': 590.53, '440V': 510 } },
    { potencia: 500, correntes: { '220V': 1140 , '380V': 660, '440V': 570 } },
    { potencia: 500, correntes: { '220V': 1140 , '380V': 660, '440V': 570 } },
  ];