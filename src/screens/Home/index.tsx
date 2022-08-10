import React, { useEffect, useState } from 'react';
import { StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';

import {api} from '../../services/api';
import Logo from '../../../assets/logo.svg';
import { Car } from '../../components/Car';
import { CarDTO } from '../../dtos/CarDTO';
import { LoadAnimation } from '../../components/LoadAnimation';

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList,
  
} from './styles';


export function Home(){
  const [cars, setCars] = useState<CarDTO[]>([]); // para tipar o carDTO
  const [loading, setLoading] = useState(true);


  const navigation = useNavigation<any>();

  //car: CarDTO é o parametro para passar os dados do carro selecionado
  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', {car})
  }

  // para buscar os dados da API
  useEffect(() => {
    let isMounted = true;

    async function fetchCars(){
      try {
        const response = await api.get('/cars');
        if(isMounted){
        setCars(response.data);
        }

      } catch (error) {
        console.log(error);
      } finally {
        if(isMounted){
        setLoading(false);
        }
      }
    }
      
    fetchCars();
    // função de limpeza
    return () => {
      isMounted = false

    }
  },[]);



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


  
 </Container>
  );
}



