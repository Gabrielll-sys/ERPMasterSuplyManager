// Em seu arquivo de tipos (pode ser um novo forms.types.ts ou onde você preferir)

import { Control, FieldError, UseFormRegister } from "react-hook-form";
import { Select, TextField } from "@radix-ui/themes";

// Opção para o Select
export interface SelectOption {
  value: string;
  label: string;
}

// Props para o wrapper FormField
export interface FormFieldProps {
  label: string;
  required?: boolean;
  className?: string;
  error?: FieldError; // MUDANÇA: Para receber o erro do RHF
  children: React.ReactNode;
}

// Props para o FormInput refatorado
export type FormInputProps = {
  label: string;
  name: string;
  register: UseFormRegister<any>; // Para conectar ao RHF
  error?: FieldError;
  required?: boolean;
} & React.ComponentProps<typeof TextField.Root>;

// Props para o FormSelect refatorado
export type FormSelectProps = {
  label:string;
  name: string;
  control: Control<any>; // MUDANÇA: Usaremos 'control' para o Controller
  options: SelectOption[];
  error?: FieldError;
  required?: boolean;
} & React.ComponentProps<typeof Select.Root>; // Permite passar placeholder, disabled, etc.