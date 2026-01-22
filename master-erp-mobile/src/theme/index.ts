import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

/**
 * Tema customizado baseado no Material Design 3
 */
export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#1E88E5', // Blue
        primaryContainer: '#BBDEFB',
        secondary: '#26A69A', // Teal
        secondaryContainer: '#B2DFDB',
        error: '#EF5350',
        errorContainer: '#FFCDD2',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        surfaceVariant: '#E0E0E0',
        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF',
        onBackground: '#212121',
        onSurface: '#212121',
        outline: '#BDBDBD',
    },
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#42A5F5',
        primaryContainer: '#1565C0',
        secondary: '#4DB6AC',
        secondaryContainer: '#00695C',
        error: '#EF5350',
        errorContainer: '#B71C1C',
        background: '#121212',
        surface: '#1E1E1E',
        surfaceVariant: '#2C2C2C',
        onPrimary: '#000000',
        onSecondary: '#000000',
        onBackground: '#FFFFFF',
        onSurface: '#FFFFFF',
        outline: '#424242',
    },
};

export type AppTheme = typeof lightTheme;
