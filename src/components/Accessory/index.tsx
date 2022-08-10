import React from 'react';
import { SvgProps } from 'react-native-svg';

import {
  Container,
  Name
} from './styles';

interface Props {
    name: string;
    icon: React.FC<SvgProps>
}

export function Accessory({name, icon: Icon}: Props){ // Icon passou como letra maiuscula para pode usar como componente
return (
 <Container>
    <Icon width={32} height={32} />
    <Name>{name}</Name>

 </Container>
  );
}