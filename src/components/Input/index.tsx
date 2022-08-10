import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { useTheme} from 'styled-components';

import {
  Container,
  IconContainer,
  InputText
} from './styles';

// função para usar os icones
interface Props extends TextInputProps {
  // para poder tipar o tipo(typeof) de feather e pega os nomes
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;

}

export function Input({
  iconName,
  value,
  ...rest
}: Props ){
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

return (
 <Container >
  <IconContainer isFocused={isFocused}>
    <Feather
      name={iconName}
      size={24}
      color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
      

    />
  </IconContainer>

  <InputText 
  // onFocus(quando entra na caixinha), onBlur(quando sai da caixinha)
    onFocus={handleInputFocus}
    onBlur={handleInputBlur}
    isFocused={isFocused}
    {...rest}/>

 </Container>
  );
}