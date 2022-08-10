import React, { useState } from 'react';
import ArrowSvg from '../../../assets/arrow.svg';
import { StatusBar} from 'react-native';
import {useTheme} from 'styled-components'; 
import {format, parseISO} from 'date-fns';

import { useNavigation, useRoute } from '@react-navigation/native';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTO';
import { 
  Calendar, 
  DayProps, 
  generateInterval,
  MarkedDateProps
} from '../../components/Calendar';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateTitle,
  DateValue,
  DateInfo,
  Content,
  Footer
} from './styles';


interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;

}

interface Params {
  car: CarDTO;
}


export function Scheduling(){
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps); // começa como sendo de um objeto vazio de DayProps
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps) // as datas marcadas estao aqui
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { car } = route.params as Params; // tipagem do API

  
  function handleConfirmRental() {
      navigation.navigate('SchedulingDetails', {
        car,
        dates: Object.keys(markedDates)
      })
  }

  function handleBack(){
    navigation.goBack();
  }

  function handleChangeDate(date: DayProps) {
    // detalhes dos dias selecionados
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp) {
      //para pega as datas corretamente
      start = end;
      end = start;
    }

    
    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate= Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFormatted: format(
        parseISO(firstDate), 'dd/MM/yyyy'),
      endFormatted: format(parseISO(endDate), 'dd/MM/yyyy'),

    })

  }

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

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod.startFormatted}>
              {rentalPeriod.startFormatted}
              </DateValue>
          </DateInfo>

           <ArrowSvg />

           <DateInfo>
            <DateTitle>ATE</DateTitle>
            <DateValue selected={!!rentalPeriod.endFormatted}>
              {rentalPeriod.endFormatted}
              </DateValue>
          </DateInfo>
        </RentalPeriod>

    </Header>

    <Content>
      <Calendar 
        marketDates={markedDates} // para mudar as cores das datas 
        onDayPress={handleChangeDate}
      />
    </Content>

  <Footer>
    <Button 
      title="Confirmar" 
      onPress={handleConfirmRental} 
      enabled={!!rentalPeriod.endFormatted}
    />

  </Footer>

 </Container>
  );
}