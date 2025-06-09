// components/forms/MaterialFormFields.tsx

"use client";

import { Flex } from "@radix-ui/themes";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import PriceCalculator from "./PriceCalculator";
import { MaterialFormFieldsProps, SelectOption } from "./types";
import { Import } from "lucide-react";

const MaterialFormFields: React.FC<MaterialFormFieldsProps> = ({
  formData,
  onFormDataChange,
  onPriceCalculation,
  disabled = false,
  required = { descricao: true, unidade: true }
}) => {

  // Opções para os selects
  const unidadeOptions: SelectOption[] = [
    { value: "UN", label: "UN" },
    { value: "RL", label: "RL" },
    { value: "PC", label: "PC" },
    { value: "MT", label: "MT" },
    { value: "P", label: "P" },
    { value: "CX", label: "CX" },
    { value: "KIT", label: "KIT" }
  ];

  const tensaoOptions: SelectOption[] = [
    { value: "0V", label: "0V" },
    { value: "12V", label: "12V" },
    { value: "24V", label: "24V" },
    { value: "110V", label: "110V" },
    { value: "127V", label: "127V" },
    { value: "220V", label: "220V" },
    { value: "380V", label: "380V" },
    { value: "440V", label: "440V" },
    { value: "660V", label: "660V" }
  ];

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    onFormDataChange(field, value);
  };
console.log(formData);
  return (
    <Flex direction="column" gap="5">
      {/* Linha 1 - Código Fabricante e Descrição */}
      <Flex direction={{ initial: 'column', md: 'row' }} gap="4">
        <FormInput
          label="Código Fabricante"
          value={formData.codigoFabricante}
          onChange={(value:any) => handleFieldChange('codigoFabricante', value)}
          placeholder="Código do Fabricante"
          disabled={disabled}
          className="flex-1"
        />
        
        <FormInput
          label="Descrição"
          value={formData.descricao}
          onChange={(value:any) => handleFieldChange('descricao', value)}
          placeholder="Descrição do Material"
          required={required.descricao}
          disabled={disabled}
          className="flex-1 md:flex-[2]"
        />
      </Flex>

      {/* Linha 2 - Marca e Localização */}
      <Flex direction={{ initial: 'column', md: 'row' }} gap="4">
        <FormInput
          label="Marca"
          value={formData.marca}
          onChange={(value:any) => handleFieldChange('marca', value)}
          placeholder="Marca do Material"
          disabled={disabled}
        />
        
        <FormInput
          label="Localização"
          value={formData.localizacao}
          onChange={(value:any) => handleFieldChange('localizacao', value)}
          placeholder="Localização no Estoque"
          disabled={disabled}
        />
      </Flex>

      {/* Linha 3 - Preços e Markup */}
      {onPriceCalculation && (
        <PriceCalculator
          precoCusto={formData.precoCusto}
          precoVenda={formData.precoVenda}
          markup={formData.markup}
          onPrecoCustoChange={(value:any) => handleFieldChange('precoCusto', value)}
          onPrecoVendaChange={(value:any) => handleFieldChange('precoVenda', value)}
          onMarkupChange={(value:any) => handleFieldChange('markup', value)}
          onCalculateMarkup={onPriceCalculation.onCalculateMarkup}
          onCalculatePrecoVenda={onPriceCalculation.onCalculatePrecoVenda}
          disabled={disabled}
        />
      )}

      {/* Linha 4 - Corrente, Tensão e Unidade */}
      <Flex direction={{ initial: 'column', md: 'row' }} gap="4">
        <FormInput
          label="Corrente"
          value={formData.corrente}
          onChange={(value:any) => handleFieldChange('corrente', value)}
          placeholder="Corrente Elétrica"
          disabled={disabled}
        />
        
        <FormSelect
          label="Tensão"
          value={formData.tensao}
          onValueChange={(value:any) => handleFieldChange('tensao', value)}
          options={tensaoOptions}
          placeholder="Selecione a Tensão"
          disabled={disabled}
        />
        
        <FormSelect
          label="Unidade"
          value={formData.unidade}
          onValueChange={(value:any) => handleFieldChange('unidade', value)}
          options={unidadeOptions}
          placeholder="Selecione a Unidade"
          required={required.unidade}
          disabled={disabled}
        />
      </Flex>
    </Flex>
  );
};

export default MaterialFormFields;