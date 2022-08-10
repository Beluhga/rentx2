import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  Extrapolate,
  interpolate,
}from 'react-native-reanimated';

import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import {getAccessoryIcon} from '../../utils/getAccessoryIcon';
import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTO';


import {
  Container,
  Header,
  CarImages,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer

} from './styles';


interface Params {
  car: CarDTO;
}

export function CarDetails(){
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { car } = route.params as Params; // tipagem do API

  const theme = useTheme()

  const scrollY = useSharedValue(0); //ANIMANDO O SCROLL
  // constante para pegar o event de scroll da vertical (y) - ANIMANDO O SCROLL
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
    console.log(event.contentOffset.y)
  });

  //ANIMANDO O SCROLL - para fazer desaparecer a parte do carro quando passa o scroll
  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 200],
        [200, 70],
        Extrapolate.CLAMP
      ),
    }
  });

  const sliderCarsStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 150],
        [1, 0],
        Extrapolate.CLAMP
      )
    }
  })

  function handleConfirmRental() {
    navigation.navigate('Scheduling', {
      car
    })
  }
  function handleBack(){
    navigation.goBack();
  }


return (
 <Container>
   <StatusBar 
    // Para Melhorar o Scroll
     barStyle={"dark-content"}
     translucent
     backgroundColor="transparent"
   />

  <Animated.View
    style={[
      headerStyleAnimation,
      styles.header,
      {backgroundColor: theme.colors.background_secondary}
    ]}
  >
    <Header>
        <BackButton onPress={handleBack}  />
    </Header>

    <Animated.View style={sliderCarsStyleAnimation}>
    <CarImages>
    <ImageSlider imagesUrl={car.photos} />
    </CarImages>
    </Animated.View>

  </Animated.View>


  <Animated.ScrollView
      contentContainerStyle= { { //ANIMANDO O SCROLL
        paddingHorizontal: 24,
        paddingTop: getStatusBarHeight() + 160,
    }}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16} // Para Melhorar o Scroll
    >
      <Details>
        <Description>
          <Brand>{car.brand}</Brand>
          <Name>{car.name}</Name>
        </Description>

      <Rent>
        <Period>{car.period}</Period>
        <Price>R$ {car.price}</Price>
      </Rent>
      </Details>

      <Accessories>
      {
        // para mapear todo o conteudo da API na parte de accessory
        car.accessories.map(accessory => (
        <Accessory
          // aqui mostra todo o conteudo mapeado de acordo com cada um
          key={accessory.type}
          name={accessory.name}
          icon={getAccessoryIcon(accessory.type)} // para executar a função sem precisa ser clicado e para exibir os icones dinamicamente

          />
        ))
      }
      </Accessories>

      <About>
       {/*descrição do carro*/}
        {car.about }

      </About>
    </Animated.ScrollView>

    <Footer>
      <Button 
      title="Escolher período do aluguel" 
      onPress={handleConfirmRental} />
    </Footer>

 </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1,
  }
})