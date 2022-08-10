import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { api } from '../../../services/api';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import {Button} from '../../../components/Button';
import { PasswordInput } from '../../../components/PasswordInput';


import {
  Container,
  Header,
  Step,
  Title,
  SUBTitle,
  Form,
  FormTitle
} from './styles';

interface Params {
  user: {
    name:string 
    email:string 
    driverLicense: number
  }
}

// para Flexibilizar a interface
export function SecondStep(){
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { user } = route.params as Params

  function handleBack(){
    navigation.goBack();
  }

 async function handleRegister() {
    if(!password || !passwordConfirm){
      return Alert.alert('Informe a senha e a confirmação');
    }

    if(password != passwordConfirm){
      return Alert.alert('As senhas não são iguais');
    }

    // Enviar para API e cadastra ('users' é o nome da rota do backend)
    //para Flexibilizar a interface 
    await api.post('/users', {
      name: user.name,
      email: user.email,
      driver_license: user.driverLicense,
      password
    })
    // para quando ter tudo certo enviar as coisas para o API
    .then(() => {
      navigation.navigate('Confirmation', {
        nextScreenRoute: 'SignIn',
        title: 'Conta Criada',
        message: `Agora é so fazer login\ne aproveitar`
      });
    })
    .catch((error) => {
      console.log(error)
      Alert.alert('Opa', 'Não foi possível cadastrar')
    });
  }
return (
  <KeyboardAvoidingView behavior="position" enabled>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <BackButton onPress={handleBack} />
          <Step>
            <Bullet active/>
            <Bullet />

          </Step>
        </Header>

        <Title>
          Crie sua{'\n'}conta
        </Title>

        <SUBTitle>
          Faça seu cadastro de{'\n'}
          forma rápida e fácil
        </SUBTitle>

        <Form>
          <FormTitle>2. Senha</FormTitle>
            <PasswordInput 
              iconName='lock'
              placeholder='Senha'
              onChangeText={setPassword}
              value={password}
            />
             <PasswordInput 
              iconName='lock'
              placeholder='Repetir Senha'
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
            />
   
   
        </Form>

        <Button 
          color={theme.colors.success}
          title="Cadastrar"
          onPress={handleRegister}
        />

      </Container>
  </TouchableWithoutFeedback>
 </KeyboardAvoidingView>
  );
}