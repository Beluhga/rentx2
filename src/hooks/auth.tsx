import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect

} from 'react';
import { api } from '../services/api';
import { database } from '../database';
// {User as ModelUSer faz renomear o nome User para ModelUSer}
import { User as ModelUser} from '../database/model/User';

// dados do usuario - para autenticação
interface User {
    id: string;
    user_id: string;
    email: string;
    name: string;
    driver_license: string;
    avatar: string;
    token: string; //para que toda hora q o usuario se conectar a aplicação, gerar um token

}


// as credenciais
interface SignInCredentials {
    email: string;
    password: string;
}

// para o contexto, para compartilha os dados do usuario e compartilha a funcao do signin e irar retorna um promise de void
interface AuthContextData {
    user: User;
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode
}

// o contexto AuthContextData e do tipo (as) do AuthContextData
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// para provar ele recebe um children
function AuthProvider({children} : AuthProviderProps){

    //o estado para armazena os dados de autenticação eo dtipo de dado é o AuthState
    const [data, setData]= useState<User>({} as User);

    //irar recebe os parametros do email e senha
    async function signIn({email, password} : SignInCredentials){
        try{

        // requisição da API post da rota sessions
        const response = await api.post('/sessions', {
            email,
            password,
        });
        
        // para desistrutura o token e o user
        const { token, user} = response.data;

        // valores por padrao do header, e irar acrescente em todas as requisições q quiser um cabecelho
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // resgate da coleção do database(pegando a tabela 'users')
        const userCollection = database.get<ModelUser>('users');
        // write recebe uma funcao q ira executar alguma coisa
        await database.write(async() => {
        // depois q o userCollection pegar a tabela de usuario, e irar criar outro usuario. "newUser" é uma nova model do usuario
            await userCollection.create(( newUser) => {
                newUser.user_id = user.id,
                newUser.name = user.name,
                newUser.email = user.email,
                newUser.driver_license = user.driver_license,
                newUser.avatar = user.avatar,
                newUser.token = token
            })
        })

        // para atualizar os dados do token e do user
        setData({...user, token});

    } catch(error) {
        throw new Error(error);
    }

    }

    async function signOut() {
        try {
            const userCollection = database.get<ModelUser>('users');
            await database.write(async () => {
                // para guarda a seção do usuario quando abrir o APP
                const userSelected = await userCollection.find(data.id);
                await userSelected.destroyPermanently();
            });

            setData({} as User);
        }catch (error) {
            throw new Error(error);
        }
    }

    // para obter os dados do usuario
    useEffect(() => {
        async function loadUserData() {
            const userCollection = database.get<ModelUser>('users')
            const response = await userCollection.query().fetch();

            if (response.length > 0){
                // as unknown as User para força uma tipagem
                const userData = response[0]._raw as unknown as User;
                api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
                setData(userData);


            }
        }

        loadUserData()

    })

    return (
        // provider os valores do usuario
        <AuthContext.Provider 
        value= {{
            user: data,
            signIn,
            signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() : AuthContextData {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };