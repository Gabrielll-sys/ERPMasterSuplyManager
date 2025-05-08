import React, { useState, useCallback, memo } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Platform, Image, Alert } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IFormTemplateItem, FormItemType, IFilledItemResponse } from '@/app/models/FormTypes';
import { FormLabel } from '../FormLabel';
import { ChoiceButtons } from '../ChoiceButtons';
import { StyledTextInput } from '../StyledTextInput';

// --- Componentes Internos para Tipos Específicos ---

const OkNcObsInput: React.FC<{
    itemDefinition: IFormTemplateItem;
    currentResponse: IFilledItemResponse | undefined;
    onResponseChange: FormItemRendererProps['onResponseChange'];
    colors: typeof Colors.light | typeof Colors.dark;
    isDisabled: boolean; // Nova prop
}> = memo(({ itemDefinition, currentResponse, onResponseChange, colors, isDisabled }) => {
    const [observation, setObservation] = useState(currentResponse?.observationText ?? '');
    const selectedValue = currentResponse?.responseValue;

    const handleValueChange = useCallback((value: string) => {
        if (isDisabled) return; // Não faz nada se desabilitado
        onResponseChange(itemDefinition.id, 'responseValue', value);
        // Mantém a observação atual ao mudar OK/NC
        onResponseChange(itemDefinition.id, 'observationText', observation);
    }, [onResponseChange, itemDefinition.id, observation, isDisabled]);

    const handleObservationChange = useCallback((text: string) => {
        if (isDisabled) return; // Não faz nada se desabilitado
        setObservation(text);
        onResponseChange(itemDefinition.id, 'observationText', text);
        // Mantém o valor OK/NC atual ao mudar observação
        onResponseChange(itemDefinition.id, 'responseValue', selectedValue ?? null);
    }, [onResponseChange, itemDefinition.id, selectedValue, isDisabled]);

    const okNcOptions = [ { label: 'OK', value: 'OK' }, { label: 'NC', value: 'NC' } ];

    return (
        // Aplica opacidade se desabilitado
        <View style={[styles.itemContainer, isDisabled ? styles.disabled : null]}>
            <FormLabel label={itemDefinition.label} isRequired={itemDefinition.isRequired} />
            <ChoiceButtons
                options={okNcOptions}
                selectedValue={selectedValue}
                onSelect={handleValueChange}
                // Passa isDisabled para o componente ChoiceButtons (precisa ser adicionado lá)
                // Ou desabilita diretamente aqui:
                // onSelect={isDisabled ? () => {} : handleValueChange}
            />
            {/* Desabilita TextInput */}
            <StyledTextInput
                placeholder="Observação (se NC ou necessário)"
                value={observation}
                onChangeText={handleObservationChange}
                multiline
                numberOfLines={3}
                style={styles.textArea}
                editable={!isDisabled} // Prop para desabilitar TextInput
                selectTextOnFocus={!isDisabled}
            />
        </View>
    );
});

const YesNoInput: React.FC<{
    itemDefinition: IFormTemplateItem;
    currentResponse: IFilledItemResponse | undefined;
    onResponseChange: FormItemRendererProps['onResponseChange'];
    colors: typeof Colors.light | typeof Colors.dark;
    isDisabled: boolean; // Nova prop
}> = memo(({ itemDefinition, currentResponse, onResponseChange, colors, isDisabled }) => {
    const selectedValue = currentResponse?.responseValue;

    const handleValueChange = useCallback((value: string) => {
        if (isDisabled) return; // Não faz nada se desabilitado
        onResponseChange(itemDefinition.id, 'responseValue', value);
    }, [onResponseChange, itemDefinition.id, isDisabled]);

    const yesNoOptions = [ { label: 'Sim', value: 'YES' }, { label: 'Não', value: 'NO' } ];

    return (
        // Aplica opacidade se desabilitado
        <View style={[styles.itemContainer, isDisabled ? styles.disabled : null]}>
            <FormLabel label={itemDefinition.label} isRequired={itemDefinition.isRequired} />
            <ChoiceButtons
                options={yesNoOptions}
                selectedValue={selectedValue}
                onSelect={handleValueChange}
                 // Passa isDisabled para o componente ChoiceButtons (precisa ser adicionado lá)
                 // Ou desabilita diretamente aqui:
                 // onSelect={isDisabled ? () => {} : handleValueChange}
            />
        </View>
    );
});

// --- Componente Principal ---

interface FormItemRendererProps {
  itemDefinition: IFormTemplateItem;
  currentResponse: IFilledItemResponse | undefined;
  onResponseChange: (
      itemId: number,
      field: keyof Omit<IFilledItemResponse, 'id' | 'filledFormInstanceId' | 'formTemplateItemId'>,
      value: string | null
  ) => void;
  isDisabled: boolean; // Nova prop
}

const FormItemRenderer: React.FC<FormItemRendererProps> = ({
  itemDefinition,
  currentResponse,
  onResponseChange,
  isDisabled, // Recebe a prop
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleTextChange = useCallback((
    field: keyof Omit<IFilledItemResponse, 'id' | 'filledFormInstanceId' | 'formTemplateItemId'>,
    text: string
  ) => {
    if (isDisabled) return; // Verifica se está desabilitado
    onResponseChange(itemDefinition.id, field, text);
  }, [onResponseChange, itemDefinition.id, isDisabled]); // Adiciona isDisabled às dependências

  // --- Renderização ---
  // O container principal de cada case agora aplica a opacidade se isDisabled for true
  switch (itemDefinition.itemType) {
    case FormItemType.TEXT_SHORT:
      return (
        <View style={[styles.itemContainer, isDisabled ? styles.disabled : null]}>
          <FormLabel label={itemDefinition.label} isRequired={itemDefinition.isRequired} />
          <StyledTextInput
            placeholder={itemDefinition.placeholder ?? 'Digite aqui...'}
            value={currentResponse?.responseValue ?? ''}
            onChangeText={(text: string) => handleTextChange('responseValue', text)}
            editable={!isDisabled} // Desabilita TextInput
            selectTextOnFocus={!isDisabled}
          />
        </View>
      );

    case FormItemType.TEXT_LONG:
    case FormItemType.SECTION_OBSERVATIONS:
      return (
        <View style={[styles.itemContainer, isDisabled ? styles.disabled : null]}>
          <FormLabel label={itemDefinition.label} isRequired={itemDefinition.isRequired} />
          <StyledTextInput
            placeholder={itemDefinition.placeholder ?? 'Digite suas observações...'}
            value={currentResponse?.responseValue ?? ''}
            onChangeText={(text: string) => handleTextChange('responseValue', text)}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            editable={!isDisabled} // Desabilita TextInput
            selectTextOnFocus={!isDisabled}
          />
        </View>
      );

    case FormItemType.OK_NC_OBS:
        return <OkNcObsInput
                    itemDefinition={itemDefinition}
                    currentResponse={currentResponse}
                    onResponseChange={onResponseChange}
                    colors={colors}
                    isDisabled={isDisabled} // Passa a prop
                />;

    case FormItemType.YES_NO:
         return <YesNoInput
                    itemDefinition={itemDefinition}
                    currentResponse={currentResponse}
                    onResponseChange={onResponseChange}
                    colors={colors}
                    isDisabled={isDisabled} // Passa a prop
                />;

    case FormItemType.DATETIME:
    case FormItemType.SECTION_DATETIME:
      const displayDate = currentResponse?.responseValue
                            ? new Date(currentResponse.responseValue).toLocaleString('pt-BR')
                            : (itemDefinition.placeholder ?? 'Selecione Data/Hora');
      return (
        <View style={[styles.itemContainer, isDisabled ? styles.disabled : null]}>
            <FormLabel label={itemDefinition.label} isRequired={itemDefinition.isRequired} />
            {/* Desabilita Pressable */}
            <Pressable
                onPress={() => Alert.alert('Abrir DateTimePicker', `Para o campo: ${itemDefinition.label}`)}
                disabled={isDisabled}
            >
                 <View style={[styles.actionPlaceholderContainer, { borderColor: colors.icon }]}>
                    <Text style={[styles.actionPlaceholderText, { color: currentResponse?.responseValue ? colors.text : colors.icon }]}>
                       {displayDate}
                    </Text>
                 </View>
            </Pressable>
        </View>
      );

    case FormItemType.SIGNATURE:
      return (
         <View style={[styles.itemContainer, isDisabled ? styles.disabled : null]}>
            <FormLabel label={itemDefinition.label} isRequired={itemDefinition.isRequired} />
             {/* Desabilita Pressable */}
             <Pressable
                onPress={() => Alert.alert('Abrir Signature Pad', `Para o campo: ${itemDefinition.label}`)}
                disabled={isDisabled}
             >
                 <View style={[styles.signatureBox, { borderColor: colors.icon }]}>
                    {currentResponse?.signatureValueBase64 ? (
                        <Image
                            source={{ uri: `data:image/png;base64,${currentResponse.signatureValueBase64}` }}
                            style={styles.signaturePreview}
                        />
                    ) : (
                        <Text style={[styles.actionPlaceholderText, { color: colors.icon }]}>
                            Toque para assinar
                        </Text>
                    )}
                 </View>
            </Pressable>
        </View>
      );

    case FormItemType.NUMBER:
       return (
        <View style={[styles.itemContainer, isDisabled ? styles.disabled : null]}>
          <FormLabel label={itemDefinition.label} isRequired={itemDefinition.isRequired} />
          <StyledTextInput
            placeholder={itemDefinition.placeholder ?? 'Digite um número...'}
            value={currentResponse?.responseValue ?? ''}
            onChangeText={(text: string) => handleTextChange('responseValue', text)}
            keyboardType="numeric"
            editable={!isDisabled} // Desabilita TextInput
            selectTextOnFocus={!isDisabled}
          />
        </View>
      );

    default:
      // Itens não implementados ou informativos não são desabilitados por padrão
      return (
        <View style={styles.itemContainer}>
          <FormLabel label={itemDefinition.label} />
          <Text style={{ color: 'orange' }}>Tipo de item não implementado ou informativo: {itemDefinition.itemType}</Text>
        </View>
      );
  }
};

export default memo(FormItemRenderer);

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 24,
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  disabled: { // Estilo para itens desabilitados
    opacity: 0.5, // Reduz a opacidade para indicar desativação
    // backgroundColor: '#f0f0f0', // Ou muda a cor de fundo
  },
  label: { /* ... mantido ... */ },
  requiredIndicator: { /* ... mantido ... */ },
  inputContainer: { /* ... mantido ... */ },
  textInput: { /* ... mantido ... */ },
  textArea: { /* ... mantido ... */ },
  buttonGroupContainer: { /* ... mantido ... */ },
  choiceButton: { /* ... mantido ... */ },
  choiceButtonText: { /* ... mantido ... */ },
  okButtonSelected: { /* ... mantido ... */ },
  ncButtonSelected: { /* ... mantido ... */ },
   actionPlaceholderContainer: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  actionPlaceholderText: {
    fontSize: 16,
  },
   signatureBox: {
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    padding: 10,
  },
  signaturePreview: {
      width: '100%',
      height: 120,
      resizeMode: 'contain',
  }
});