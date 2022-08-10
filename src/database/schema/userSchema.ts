import {tableSchema} from '@nozbe/watermelondb';

// tabela criada
const userSchema = tableSchema({
    //nome da tabela
    name: 'users',
    // colunas da tabela
    columns: [
        {
            name: 'user_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'driver_license',
            type: 'string'
        },
        {
            name: 'avatar',
            type: 'string'
        },
        {
            name: 'token',
            type: 'string'
        },

    ]
})

export { userSchema}

