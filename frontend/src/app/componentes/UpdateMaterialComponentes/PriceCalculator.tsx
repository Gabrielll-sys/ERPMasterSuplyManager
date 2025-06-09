// components/forms/PriceCalculator.tsx

"use client";

import { Flex } from "@radix-ui/themes";
import FormInput from "./FormInput";
import { PriceCalculatorProps } from "./types";

const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  precoCusto,
  precoVenda,
  markup,
  onPrecoCustoChange,
  onPrecoVendaChange,
  onMarkupChange,
  onCalculateMarkup,
  onCalculatePrecoVenda,
  disabled = false
}) => {
  
  const handlePrecoCustoChange = (value: string) => {
    onPrecoCustoChange(value);
  };

  const handlePrecoVendaChange = (value: string) => {
    onPrecoVendaChange(value);
  };

  const handleMarkupChange = (value: string) => {
    onMarkupChange(value);
  };

  const handlePrecoCustoBlur = () => {
    // Calcula markup quando sair do campo de preço custo
    onCalculateMarkup();
  };

  const handlePrecoVendaBlur = () => {
    // Recalcula markup quando sair do campo de preço venda
    onCalculateMarkup();
  };

  const handleMarkupBlur = () => {
    // Calcula preço venda quando sair do campo de markup
    onCalculatePrecoVenda();
  };

  return (
    <Flex direction={{ initial: 'column', md: 'row' }} gap="4">
      <FormInput
        label="Preço Custo"
        value={precoCusto}
        onChange={handlePrecoCustoChange}
        onBlur={handlePrecoCustoBlur}
        placeholder="0,00"
        type="text"
        inputMode="decimal"
        prefix="R$"
        disabled={disabled}
      />
      
      <FormInput
        label="Markup"
        value={markup}
        onChange={handleMarkupChange}
        onBlur={handleMarkupBlur}
        placeholder="0,00"
        type="text"
        inputMode="decimal"
        suffix="%"
        disabled={disabled}
      />
      
      <FormInput
        label="Preço Venda"
        value={precoVenda}
        onChange={handlePrecoVendaChange}
        onBlur={handlePrecoVendaBlur}
        placeholder="0,00"
        type="text"
        inputMode="decimal"
        prefix="R$"
        disabled={disabled}
      />
    </Flex>
  );
};

export default PriceCalculator;