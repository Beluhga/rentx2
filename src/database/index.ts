import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import {schemas} from './schema';
import { User} from './model/User';
import { Car } from './model/Car';


// estancia do SQLiter e quais as tabelas do banco
const adapter = new SQLiteAdapter({
    schema: schemas
});

export const database = new Database({
    // adaptador de conecção
    // classes de modelo
    adapter,
    modelClasses: [
        User,
        Car
    ],
    
});