import React, { useState, useRef } from 'react';
import { FlatList, ViewToken } from 'react-native';

import { Bullet } from '../Bullet'

import {
  Container,
  ImageIndexes,
  CarImageWrapper,
  CarImage,
} from './styles';

// exatamente igual ista no CArdDTO - Listando carros do backend
interface Props {
    imagesUrl: {
      id: string;
      photo: string;
    }[];
}

// função para mudar quando o index mudar
interface ChangeImageProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export function ImageSlider({imagesUrl}: Props){
  const [imageIndex, setImageIndex] = useState(0);

  // constante q usa a referencia da imagem para mover as bolinhas
  const indexChanged = useRef((info: ChangeImageProps) => {
    const index = info.viewableItems[0].index!;
     setImageIndex(index);

  });


return (
    <Container>
 <ImageIndexes>
  { 
   /* função para pecorrer as imagens (as bolinhas) e mostras as bolinhas de acordo com a quantidade de fotos */
   imagesUrl.map((item, index) => ( // exatamente igual ista no CArdDTO - Listando carros do backend
        <Bullet 
          key={String(item.id)} // exatamente igual ista no CArdDTO - Listando carros do backend
          active={index === imageIndex} />
      ))
  }
 
 </ImageIndexes>

 <CarImageWrapper>
   <FlatList 
      data={imagesUrl}
      keyExtractor={item => item.id} // exatamente igual ista no CArdDTO - Listando carros do backend
      renderItem={({item}) => (
        <CarImageWrapper>
        <CarImage
          source={{ uri: item.photo}} // exatamente igual ista no CArdDTO - Listando carros do backend
          resizeMode="contain"
        />
        </CarImageWrapper>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      onViewableItemsChanged={indexChanged.current}
   />
  
 </CarImageWrapper>
 </Container>
  );
}