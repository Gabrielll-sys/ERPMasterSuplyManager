export interface IMotor {
    potencia: number;
    correntes: {
      '220V': number;
      '380V': number;
      '440V': number;
    };
}