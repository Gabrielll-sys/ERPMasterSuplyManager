import { Flex, Text, TextField } from "@radix-ui/themes";
import React from "react";

// Definindo a interface de props para o nosso componente
interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  inputMode,
  prefix,
  suffix,
  disabled = false,
}) => {
  // O handler do evento onChange do Radix passa o evento completo,
  // então precisamos extrair o `value` do `e.target`.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Flex direction="column" gap="1" className="flex-grow">
      <Text as="label" size="2" weight="bold" className="text-gray-700">
        {label}
      </Text>
      <TextField.Root size="3">
        {prefix && <TextField.Slot>{prefix}</TextField.Slot>}
        <TextField.Input
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          type={type}
          inputMode={inputMode}
          disabled={disabled}
        />
        {suffix && <TextField.Slot>{suffix}</TextField.Slot>}
      </TextField.Root>
    </Flex>
  );
};

export default FormInput;