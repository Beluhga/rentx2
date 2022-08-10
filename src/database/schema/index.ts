import {appSchema} from '@nozbe/watermelondb';

import { userSchema} from './userSchema';

const schemas = appSchema({
    // versao do banco de dados
    version: 1,
    // tabelas do banco
    tables: [
        userSchema
    ]
});

export {schemas}