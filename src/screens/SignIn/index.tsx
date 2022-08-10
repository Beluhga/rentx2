import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import theme from '../../../styles/theme';

import {Button} from '../../components/Button'
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';


import {
  Container,
  Header,
  Title,
  SubTitle,
  Footer,
  Form
} from './styles';
import { useAuth } from '../../hooks/auth';


export function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
  const { signIn } = useAuth();

  async function handleSignIn() {
    try{
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string()
          .required('A senha é obrigatório') 
      });

      await schema.validate({email, password})

      // email e senha autenticados
      signIn({email, password});
    }catch(error) {
      if(error instanceof Yup.ValidationError){
        return Alert.alert('Opa', error.message);
      }else {
         Alert.alert(
          'Error na autenticação',
           'Ocorreu um error ao fazer login, verifica as credenciais'
           )
      }
    }
  }

  function handleNewAccount() {
    navigation.navigate('FirstStep');
  }

  

return (
  //Para organizar o teclado com a tela
  <KeyboardAvoidingView behavior="position" enabled>
  {/*Para fechar o teclado quando clicar em qualquer outro lugar da tela */}
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
 <Container>
  <StatusBar 
    barStyle="dark-content"
    backgroundColor={theme.colors.background_primary}
    translucent
  />
  <Header>
    <Title>
      Estamos{'\n'}
      quase lá.
    </Title>
    <SubTitle>
      Faça seu login para começar{'\n'}
      uma experiência incrível
    </SubTitle>
  </Header>

    <Form>
      <Input 
        iconName='mail'
        placeholder='E-mail'
        keyboardType='email-address'
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

    <PasswordInput
      iconName="lock"
      placeholder="Senha"
      onChangeText={setPassword}
      value={password}
    />
    </Form>

  <Footer>
    <Button 
      title="Login"
      onPress={handleSignIn}
      enabled={true}
      loading={false}
    />

    <Button 
      title="Criar conta gratuita"
      color={theme.colors.background_secondary}
      light
      onPress={handleNewAccount}
      enabled={true}
      loading={false}
    />
  </Footer>
 </Container>
 </TouchableWithoutFeedback>
 </KeyboardAvoidingView>
  );
}

/*
------------PARA TESTA SE TEM GENTE LOGADO OU NAO
import { database } from '../../database'

useEffect(() => {
    async function loadData() {
      const usersCollection = database.get('users');
      const users = await usersCollection.query().fetch();
      console.log(users)
    }

    loadData();
  },[])*/