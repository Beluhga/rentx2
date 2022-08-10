import React from 'react';
import theme from './styles/theme';
import {ThemeProvider} from 'styled-components';
import { Routes } from './src/routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium

} from '@expo-google-fonts/inter';

import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold

} from '@expo-google-fonts/archivo';

import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from './src/hooks';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from \'deprecated-react-native-prop-types\'.'
])


export default function App() {
  SplashScreen.preventAutoHideAsync();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold
    
  });

  if(!fontsLoaded){
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        {/* Para as rotas ter acesso a informações de autenticação */ }
        <AppProvider>
          <Routes />
        </AppProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}


