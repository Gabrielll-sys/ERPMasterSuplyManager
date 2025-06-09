// components/forms/FormSelect.tsx

"use client";

import { Select } from "@radix-ui/themes";
import FormField from "./FormField";
import { FormSelectProps } from "./types";

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Selecione uma opção",
  required = false,
  disabled = false,
  className = ""
}) => {
  return (
    <FormField
      label={label}
      required={required}
      className={className}
    >
      <Select.Root 
        value={value} 
        onValueChange={onValueChange} 
        size="3"
        disabled={disabled}
      >
        <Select.Trigger variant="surface" placeholder={placeholder} />
        <Select.Content position="popper">
          {options.map((option:any) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </FormField>
  );
};

export default FormSelect;