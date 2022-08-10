import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { ptBR } from './localeConfig';
import { generateInterval } from './generateInterval';
import {
  Calendar as CustomCalendar, 
  LocaleConfig,
  DateCallbackHandler
  } from 'react-native-calendars';


 LocaleConfig.locales['pt-br'] = ptBR;
 LocaleConfig.defaultLocale = 'pt-br';

 interface MarkedDateProps {
  [date: string]: {
    color: string;
    textColor: string;
    disable?: boolean;
    disableTouchEvent?: boolean; // para desabilitar click
  },
 }

 interface DayProps {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
 }

 interface CalendarProps {
  marketDates: MarkedDateProps;
  onDayPress: DateCallbackHandler;
 }

 function Calendar({marketDates,onDayPress }: CalendarProps){
  const theme = useTheme();

return (
 <CustomCalendar
   
    renderArrow={(direction) => /*função para mudar a seta do calendario de acordo com a data */
     <Feather
       name={direction == 'left' ? "chevron-left" : "chevron-right"}
       size={24}
       color={theme.colors.shape} 
     />
    }

    headerStyle={{
        /* para modificar a parte acima dos dias e abaixo da semana */
        backgroundColor: theme.colors.background_secondary,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.text_detail,
        paddingBottom: 10,
        marginBottom: 10,
    }}

    theme={{
        /*mudando a font do dia e mes*/
        textDayFontFamily: theme.fonts.primary_400,
        textDayHeaderFontFamily: theme.fonts.primary_500,
        textMonthFontFamily: theme.fonts.secondary_600,
        textDayHeaderFontSize: 10,
        textMonthFontSize: 20,
        monthTextColor: theme.colors.title,
        arrowStyle: {
            marginHorizontal: -15
        }
    }}

    firstDay={1}
    minDate={new Date().toString()}
    markingType="period" // periodos
    markedDates={marketDates} // datas selecionadas para o periodo
    onDayPress={onDayPress} // o click da data escolhida
    />
  );
}

 export {
  Calendar,
  MarkedDateProps,
  DayProps,
  generateInterval
 }