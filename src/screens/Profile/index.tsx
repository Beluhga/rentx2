import React, { useState } from 'react';
import { 
  Alert,
  Keyboard, 
  KeyboardAvoidingView, 
  TouchableWithoutFeedback 
} from 'react-native';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section
} from './styles';
import { useNavigation } from '@react-navigation/native';
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import { useTheme } from 'styled-components';
import {Feather } from '@expo/vector-icons';
import { BackButton } from '../../components/BackButton';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { useAuth } from '../../hooks/auth';
import { Button } from '../../components/Button';


export function Profile(){
  const {user, signOut, updatedUser} = useAuth();

  const [option, setOption]=useState<'dataEdit' | 'passwordEdit'>('dataEdit');
  const [avatar, setAvatar]= useState(user.avatar);
  const [name, setName]= useState(user.name);
  const [driverLicense, setDriverLicense]= useState(user.driver_license);

  const theme = useTheme();
  const navigation = useNavigation();

  function handleBack(){
    navigation.goBack();
  }


  function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit' ) {
    setOption(optionSelected);
  }

  async function handleSelectAvatar() {
    // launchImageLibraryAsync = para pegar as imagens no dispositivo
    // launchCameraAsync = para tirar foto do celular no momento (aquela usando com documento q usa nos bancos)
    const result = await ImagePicker.launchImageLibraryAsync({
      // o tipo de midia (images, videos...)
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // para poder editar
      allowsEditing: true,
      // tamanho da imagem
      aspect: [4, 4],
      // qualidade da imagem
      quality: 1
    });

    // para cancelar a função
    // para usar o URI da imagem
    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  }

  // interface otimista, para salvar mesmo q quando estiver off ele ira atualizar como estiver online
  async function handleProfileUpdate() {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.number()
        .min(9, "CNH tem 9 numeros")
        .required('CNH é obrigatória'),
        name: Yup.string()
        .required('Nome é obrigatorio')
      });

      const data = {name, driverLicense};
      await schema.validate(data);

      await updatedUser({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name,
        driver_license: driverLicense,
        avatar,
        token: user.token
      });

      Alert.alert('Perfil atualizado!')
      
    } catch(error) {
      if(error instanceof Yup.ValidationError) {
        Alert.alert('Opa', error.message);
      } else {
          Alert.alert('Não foi possivel atualiza o perfil');
      }
    }
  }

  // Confirmação de Sign out
  async function handleSignOut() {
    Alert.alert
    ('Tem certeza?',
      'Se você sair, irá precisar de internet para conectar-se novamente',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style:"cancel"
        },
        {
          text: 'Sair',
          onPress: () => signOut()
        }
      ]
    );
  }


return (
  <KeyboardAvoidingView behavior="position" enabled>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <Container>
    <Header>
      <HeaderTop>
        <BackButton 
          color={theme.colors.shape} 
          onPress={handleBack} 
        />
        <HeaderTitle> Editar Perfil</HeaderTitle>
        <LogoutButton onPress={handleSignOut} >
          <Feather 
            name='power' 
            size={24} 
            color={theme.colors.shape} 
          />
        </LogoutButton>
        </HeaderTop>

        <PhotoContainer>
          { !!avatar && <Photo source ={{ uri: avatar}} />}
          <PhotoButton onPress={handleSelectAvatar} >
            <Feather
              name="camera"
              size={24}
              color={theme.colors.shape}
            />
          </PhotoButton>
        </PhotoContainer>
      
    </Header>
 {/* useBottomTabBarHeight(), para alinhar o teclado com os inputs*/}
    <Content style={{marginBottom: useBottomTabBarHeight() }}>
        <Options>
          <Option 
            active={option === 'dataEdit'}
            onPress={() => handleOptionChange('dataEdit')}
          > 
          <OptionTitle active={option === 'dataEdit'}> 
            Dados
          </OptionTitle>
          </Option>

          <Option 
            active={option === 'passwordEdit'}
            onPress={() => handleOptionChange('passwordEdit')}
          > 
          <OptionTitle active={option === 'passwordEdit'}> Trocar Senha</OptionTitle>
          </Option>
        </Options>
        {/*função par alterna entra Dados e Trocar senha */}
        {
          option === 'dataEdit' 
          ? 
          <Section >
            <Input 
              iconName='user'
              placeholder='Nome'
              autoCorrect={false}
              defaultValue={user.name}
              onChangeText={setName}
            />
              <Input 
              iconName='mail'
              editable={false}
              defaultValue={user.email}

            />
              <Input 
              iconName='credit-card'
              placeholder='CNH'
              keyboardType='numeric'
              defaultValue={user.driver_license}
              onChangeText={setDriverLicense}

            />
          </Section>
          :
          <Section >
            <PasswordInput
              iconName='lock'
              placeholder='Senha atual'
              
            />
              <PasswordInput 
              iconName='lock'
              placeholder='Nova senha'
              
            />
              <PasswordInput 
              iconName='lock'
              placeholder='Repetir senha'
              
            />
          </Section>
        }
        <Button 
          title="Salvar alterações"
          onPress={handleProfileUpdate}
        />

    </Content>

  </Container>
  </TouchableWithoutFeedback>
 </KeyboardAvoidingView>
  );
}