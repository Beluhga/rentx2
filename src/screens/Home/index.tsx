import React, { useEffect, useState } from 'react';
import { StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';

import {useNetInfo} from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';

import { database} from '../../database';
import {api} from '../../services/api';

import Logo from '../../../assets/logo.svg';
import { Car } from '../../components/Car';
import {Car as ModelCar} from '../../database/model/Car'
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
  const [cars, setCars] = useState<ModelCar[]>([]); // para tipar o carDTO
  const [loading, setLoading] = useState(true);

  const netInfo = useNetInfo();

  const navigation = useNavigation<any>();

  //car: CarDTO é o parametro para passar os dados do carro selecionado
  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', {car})
  }

  //Sincronizando usuário
  async function offlineSynchronize() {
    await synchronize({
      // banco para sicroniza
      database,
      // vai no backend buscar atualização
      pullChanges: async ({ lastPulledAt}) => {
        const response = await api
        // busca na rota de carros, quando foi a ultima atualização (rota q que esta no backend)
        .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);

        // desistruturação do banco de dados
        const {changes, latestVersion} = response.data;
        // retorno de quais são os carros e a data da atualização
        return{ changes, timestamp: latestVersion }
      },
      // que envia as modificações com o servidor feitas pelo usuario quando estava offline
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post('/users/sync', user);
      },
    });
  }

  // para buscar os dados da API
  useEffect(() => {
    let isMounted = true;

    async function fetchCars(){
      try {

        const carCollection = database.get<ModelCar>('cars');
        const cars = await carCollection.query().fetch();

        if(isMounted){
          setCars(cars);
        }

      } catch (error) {
        console.log(error);
      } finally {
        if(isMounted){
        setLoading(false);
        }
      }
    }
    
    useEffect(() => {
      if(netInfo.isConnected === true){
        offlineSynchronize();
      }

    },[netInfo.isConnected === true])
      
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

/*
------------------ SABER SE ESTA ONLINE OU NÃO------------------
 // Verificando conexão
  useEffect(() =>{
    if(netInfo.isConnected){
      Alert.alert('Você está conectado')

      }else{
        Alert.alert('Voce está offline');
      }
    // para mudar toda vez q a coneção mudar, irar dispara a função novamente
  },[netInfo.isConnected])

  -------------- PARA FAZER A BUSCA DENTRO DO API-------------------

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

*/

