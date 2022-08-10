import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Input } from '../../../components/Input';
import {Button} from '../../../components/Button';

import * as Yup from 'yup';


import {
  Container,
  Header,
  Step,
  Title,
  SUBTitle,
  Form,
  FormTitle
} from './styles';

export function FirstStep(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [driverLicense, setDriverLicense] = useState(0);

  const navigation = useNavigation();

  function handleBack(){
    navigation.goBack();
  }

  async function handleNextStep(){
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.number()
        .min(9, "CNH tem 9 numeros")
        .required('CNH é obrigatória'),
        email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail é obrigatório'),
        name: Yup.string()
        .required('Nome é obrigatório')
      });

      const data = { name, email, driverLicense};
      await schema.validate(data);

      navigation.navigate('SecondStep', { user: data});
    } catch(error){
      if(error instanceof Yup.ValidationError) {
        return Alert.alert('Opa', error.message)
      }

    }
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
          <FormTitle>1. Dados</FormTitle>

          <Input 
            iconName="user"
            placeholder="Nome"
            onChangeText={setName}
            value={name}
          />
          <Input 
            iconName="mail"
            placeholder="E-mail"
            keyboardType='email-address'
            onChangeText={setEmail}
            value={email}
          />
          <Input 
            iconName="credit-card"
            placeholder="CNH"
            keyboardType='numeric'
            onChangeText={(value) => setDriverLicense(Number(value))} // modo de passar de forma numerica            
          />
        </Form>

        <Button 
          title="Próximo"
          onPress={handleNextStep}
        />

      </Container>
  </TouchableWithoutFeedback>
 </KeyboardAvoidingView>
  );
}