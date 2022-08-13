import {appSchema} from '@nozbe/watermelondb';

import { userSchema} from './userSchema';
import { carSchema } from './carSchema';

const schemas = appSchema({
    // versao do banco de dados
    version: 2,
    // tabelas do banco
    tables: [
        userSchema,
        carSchema
    ]
});

export {schemas}