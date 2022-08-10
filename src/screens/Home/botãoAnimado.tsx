import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, BackHandler} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons} from '@expo/vector-icons';
import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';

import {api} from '../../services/api';
import Logo from '../../../assets/logo.svg';
import { Car } from '../../components/Car';
import { CarDTO } from '../../dtos/CarDTO';
import { LoadAnimation } from '../../components/LoadAnimation';
import { useTheme } from 'styled-components';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring
} from 'react-native-reanimated'


import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList,
  

} from './styles';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

export function Home(){
  const [cars, setCars] = useState<CarDTO[]>([]); // para tipar o carDTO
  const [loading, setLoading] = useState(true);

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

   // GESTOS DO USUARIO - MOVER O BOTTOM DO MYCARS
  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: positionX.value },
        { translateY: positionY.value }
      ]
    }
  })

  /* GESTOS DO USUARIO - MOVER O BOTTOM DO MYCARS */
  const onGestureEvent = useAnimatedGestureHandler({
    // o anderlaine (_) é porque nao vai precisa usar evento (event)
    onStart(_, ctx: any){
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value

    },
    onActive(event, ctx: any){
      positionX.value = ctx.positionX + event.translationX
      positionY.value = ctx.positionY + event.translationY
    },
    onEnd(){
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    }
  });

  const navigation = useNavigation<any>();
  const theme = useTheme();

  //car: CarDTO é o parametro para passar os dados do carro selecionado
  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', {car})
  }

  function handleOpenMyCars(car: CarDTO) {
    navigation.navigate('Mycars')
  }

  const myCardsButtonProps = {
    onPress: handleOpenMyCars
    
  }


  // para buscar os dados da API
  useEffect(() => {
    async function fetchCars(){
      try {
        const response = await api.get('/cars');
        setCars(response.data);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
      
    fetchCars();
  },[]);

  // Previnir voltar a Splash
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    })
  },[])

return (
 <Container>
  <StatusBar
    barStyle="light-content" // para ficar com os estatus do celular com cor diferente
    backgroundColor="transparent"
    translucent
    />
    <Header>
      <HeaderContent>
        <Logo
          width={RFValue(108)}
          height={RFValue(12)}
         />
        {
          // para não mostra o total de carros ate ser carregado
          !loading &&
        <TotalCars>
          Total de {cars.length} carros
        </TotalCars>
        }
        </HeaderContent>
    </Header>
    {loading ? <LoadAnimation /> :
      <CarList
        data={cars}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => 
          <Car
          data={item} 
          onPress={() => handleCarDetails(item)} /> // passando dados entre telas
      }
    />
  }


  {/* GESTOS DO USUARIO - MOVER O BOTTOM DO MYCARS */}
  <PanGestureHandler onGestureEvent={onGestureEvent}>
  <Animated.View
    style={[
      
      myCarsButtonStyle,
      {
        position: 'absolute',
        bottom: 13,
        right: 22
      }
    ]}
  >
     
    <ButtonAnimated 
    {...myCardsButtonProps}
    style= {[styles.button, { backgroundColor: theme.colors.main}]}
    >
      <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape} />
    </ButtonAnimated>
  </Animated.View>
  </PanGestureHandler>
 </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'

  }
})

/*
// utilizado para testar
const carData = {
    brand: 'Audi',
    name: 'RS 5 Coupé',
    rent: {
      period: 'AO DIA',
      price: 120,
   },
   thumbnail: 'https://www.pngmart.com/files/22/Audi-RS5-PNG-Isolated-Pic.png'
  }
  <MyCardsButton {...myCardsButtonProps} >
    <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape} />
  </MyCardsButton>
*/