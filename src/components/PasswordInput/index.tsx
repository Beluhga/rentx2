import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { useTheme} from 'styled-components';
import {BorderlessButton} from 'react-native-gesture-handler';


import {
  Container,
  IconContainer,
  InputText,
  
} from './styles';

// função para usar os icones
interface Props extends TextInputProps {
  // para poder tipar o tipo(typeof) de feather e pega os nomes
  iconName: React.ComponentProps<typeof Feather>['name']
  value?: string;

}

export function PasswordInput({
  iconName,
  value,
  ...rest
}: Props ){
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const theme = useTheme();

  function handleInputFocus() {
    setIsFocused(true);
    
  }

  function handleInputBlur() {
    setIsFocused(false);
    //se tem conteudo(value) verdadeiro, se nao tiver é falso
    setIsFilled(!!value);
  }
  

  // funcao para acessar o setIsPasswordVisible, dai pega o estado anterior e inverte ele
  function handlePasswordVisibilityChange() {
    setIsPasswordVisible(prevState => !prevState)
  }

return (
 <Container >
  <IconContainer isFocused={isFocused}>
    <Feather
      name={iconName}
      size={24}
      color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}

    />
  </IconContainer>

  {/*secureTextEntry para deixar a senha visivel ou nao*/ }
  <InputText 
    onFocus={handleInputFocus}
    onBlur={handleInputBlur}
    secureTextEntry={isPasswordVisible}
    isFocused={isFocused}
    autoCorrect={false}
    {...rest}/>

  <BorderlessButton onPress={handlePasswordVisibilityChange} >
  <IconContainer isFocused={isFocused}>
    <Feather
      name={isPasswordVisible ? 'eye-off' : 'eye'}
      size={24}
      color={theme.colors.text_detail}
    />
    </IconContainer>
    </BorderlessButton>
 </Container>
  );
}