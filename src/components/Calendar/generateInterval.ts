import { eachDayOfInterval, format, parseISO} from 'date-fns';
import { MarkedDateProps, DayProps } from '.';

import theme from '../../../styles/theme';

export function generateInterval(start: DayProps, end: DayProps){
    let interval: MarkedDateProps = {};

    //passa a data inicial e final para o eachDayOfInterval, depois persegue cada item q tem cada data,e pra cada data, faz uma formatação para o getPlatformDates com ano, mes e dia
    eachDayOfInterval({ 
        start: parseISO(start.dateString), 
        end: parseISO(end.dateString)})
    .forEach(( item ) => {
        const date = format(item, 'yyyy-MM-dd');

        // passa todos os objetos que tinha antes e cria um novo objeto como data como chave e passa as cores
        interval = {
            ...interval,
            [date]: {
                    color: start.dateString === date || end.dateString === date
                    ? theme.colors.main : theme.colors.main_light,

                    textColor: start.dateString === date || end.dateString === date
                    ? theme.colors.main_light : theme.colors.main,
                }
            }
        }
    )
    return interval;
}