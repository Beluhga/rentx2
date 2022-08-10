import React from 'react';
import { StatusBar, useWindowDimensions} from 'react-native';
import { ConfirmButton } from '../../components/ConfirmButton';
import { useNavigation, useRoute } from '@react-navigation/native';

import LogoSvg from '../../../assets/logo_background_gray.svg';
import DoneSvg from '../../../assets/done.svg';

import {
  Container,
  Content,
  Title,
  Message,
  Footer
  
} from './styles';

// para Flexibilizar a interface
interface Params {
  title: string;
  message: string;
  nextScreenRoute: string;

}

export function Confirmation(){
    const {width} = useWindowDimensions(); /* esse usa dentro da função para nao da erro */

  const navigation = useNavigation<any>();
  const route = useRoute();

  // para Flexibilizar a interface, usa dessa forma quando quiser passar os componentes atraves de uma funcao
  const { title, message, nextScreenRoute } = route.params as Params

  function handleConfirm() {
    navigation.navigate(nextScreenRoute)
  }

  

return (
 <Container>
    <StatusBar 
     barStyle="light-content"
     translucent
     backgroundColor="transparent"
    />
    <LogoSvg width={width} />

    <Content>
        <DoneSvg width={80} height={80} />
        <Title>{title}</Title>

        <Message>
           {message}
        </Message>
    </Content>

    <Footer>
      <ConfirmButton title="OK" onPress={handleConfirm} /> 
    </Footer>

 </Container>
  );
}