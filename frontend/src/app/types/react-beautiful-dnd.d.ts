// Type overrides para react-beautiful-dnd com React 18
declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export interface DragDropContextProps {
    onDragEnd(result: DropResult, provided: ResponderProvided): void;
    onDragStart?(initial: DragStart, provided: ResponderProvided): void;
    onDragUpdate?(initial: DragUpdate, provided: ResponderProvided): void;
    children: React.ReactNode;
  }

  export const DragDropContext: React.ComponentType<DragDropContextProps>;
  export const Droppable: any;
  export const Draggable: any;

  export interface DropResult {
    draggableId: string;
    type: string;
    source: DraggableLocation;
    reason: DropReason;
    mode: MovementMode;
    destination?: DraggableLocation | null;
    combine?: Combine | null;
  }

  export interface DraggableLocation {
    droppableId: string;
    index: number;
  }

  export type DropReason = 'DROP' | 'CANCEL';
  export type MovementMode = 'FLUID' | 'SNAP';

  export interface Combine {
    draggableId: string;
    droppableId: string;
  }

  export interface DragStart {
    draggableId: string;
    type: string;
    source: DraggableLocation;
    mode: MovementMode;
  }

  export interface DragUpdate extends DragStart {
    destination?: DraggableLocation;
    combine?: Combine;
  }

  export interface ResponderProvided {
    announce(message: string): void;
  }
}
