// src/app/(os-management)/editing-os/[osId]/components/OsHeader.tsx
"use client";

import { Flex, Heading, Button, Box } from '@radix-ui/themes';
import { ArrowLeft, Edit3, Lock } from 'lucide-react';
import { IOrdemSeparacao } from '@/app/interfaces/IOrdemSeparacao';
import { Chip } from '@nextui-org/react';

interface OsHeaderProps {
  os: IOrdemSeparacao;
  onBack: () => void;
}

export function OsHeader({ os, onBack }: OsHeaderProps) {

  const isAuthorized = os.isAuthorized;
  const statusText = isAuthorized ? 'Finalizada' : 'Em Edição';
  // Map custom colors to valid Chip color values
  const statusColor: "success" | "warning" = isAuthorized ? "success" : "warning";
  const StatusIcon = isAuthorized ? Lock : Edit3;

  return (
    <Flex align="center" justify="between" mb="6">
    
      <Button variant="soft" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <Flex direction="column" align="center" gap="1">
        <Heading size={{ initial: "6", md: "8" }} className="text-gray-800" align="center">
          Ordem de Separação
        </Heading>
      
        <Chip color={statusColor} variant="light">
          <StatusIcon className="w-3 h-3 mr-1" />
          Nº {os.id} - {statusText}
        </Chip>
      </Flex>

     
      <Box className="w-24" />
    </Flex>
  );
}