import React from 'react';
import { Chip } from 'react-native-paper';
import { getStatusLabel, getStatusColor } from '../types';

interface StatusChipProps {
  status: number;
  size?: 'small' | 'medium';
}

export function StatusChip({ status, size = 'medium' }: StatusChipProps) {
  const label = getStatusLabel(status);
  const color = getStatusColor(status);

  return (
    <Chip
      mode="flat"
      style={{
        backgroundColor: color + '20',
        alignSelf: 'flex-start',
      }}
      textStyle={{
        color: color,
        fontWeight: '600',
        fontSize: size === 'small' ? 12 : 14,
      }}
    >
      {label}
    </Chip>
  );
}
