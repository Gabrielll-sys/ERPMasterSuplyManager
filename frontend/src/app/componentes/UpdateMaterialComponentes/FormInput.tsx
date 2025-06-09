// components/forms/FormInput.tsx

"use client";

import { TextField } from "@radix-ui/themes";
import FormField from "./FormField";
import { FormInputProps } from "./types";

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  type = 'text',
  inputMode = 'text',
  prefix,
  suffix,
  className = ""
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <FormField
      label={label}
      required={required}
      className={className}
    >
      <TextField.Root>
        {prefix && <TextField.Slot>{prefix}</TextField.Slot>}
        <TextField.Input
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          type={type}
          inputMode={inputMode}
          variant="surface"
          size="3"
        />
        {suffix && <TextField.Slot>{suffix}</TextField.Slot>}
      </TextField.Root>
    </FormField>
  );
};

export default FormInput;