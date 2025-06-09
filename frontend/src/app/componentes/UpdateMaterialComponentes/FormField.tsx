// components/forms/FormField.tsx

"use client";

import { Text, Flex, Box } from "@radix-ui/themes";
import { FormFieldProps } from "./types";

const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  required = false,
  error,
  className = ""
}) => {
  return (
    <Flex direction="column" gap="1" className={`flex-1 ${className}`}>
      <Text size="1" color="gray" as="label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Text>
      
      <Box>
        {children}
      </Box>
      
      {error && (
        <Text size="1" color="red" className="mt-1">
          {error}
        </Text>
      )}
    </Flex>
  );
};

export default FormField;