import React, { useEffect, useState } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import {AntDesign} from '@expo/vector-icons';
import { BackButton } from '../../components/BackButton';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';


import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarFooter,
  CarWrapper,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate
} from './styles';

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO
  startDate: string;
  endDate: string;
}
export function MyCars(){
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme()
  const navigation = useNavigation();

  function handleBack(){
    navigation.goBack();
  }

  useEffect(() => {
    async function fectCars(){
      try{
        const response = await api.get('/schedules_byuser?user_id=1');
        console.log(response.data)
        setCars(response.data);
      } catch (error){
        console.log(error);
      } finally{
        setLoading(false);
      }
    }
    fectCars();

  },[]);
return (
 <Container>
  <Header>
  <StatusBar
    barStyle="light-content" // para ficar com os estatus do celular com cor diferente
    backgroundColor="transparent"
    translucent
    />
        <BackButton
        onPress={handleBack}
        color={theme.colors.shape}
         />

        <Title> 
          Escolha uma {'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <SubTitle>
          Conforto, segurança e praticidade.
        </SubTitle>

    </Header>
    { loading ? <LoadAnimation /> :
    <Content>
      <Appointments>
        <AppointmentsTitle>Agendamentos Feitos</AppointmentsTitle>
        <AppointmentsQuantity> {cars.length} </AppointmentsQuantity>

      </Appointments>

      <FlatList
        data={cars}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => 
        <CarWrapper>
          <Car data={item.car} />
        
          <CarFooter>
            <CarFooterTitle>Período</CarFooterTitle>
            <CarFooterPeriod>
              <CarFooterDate>{item.startDate}</CarFooterDate>
               <AntDesign 
                  name="arrowright"
                  size={20}
                  color={theme.colors.title}
                  style={{ marginHorizontal: 10}}
               />
              
              <CarFooterDate>{item.endDate}</CarFooterDate>
            </CarFooterPeriod>

          </CarFooter>
          </CarWrapper>
      }

      />
    </Content>
    }
 </Container>
  );
}