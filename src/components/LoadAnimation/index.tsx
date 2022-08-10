import React from 'react';

import loadCar from '../../../assets/loadCar.json';

import {
  Container
} from './styles';

const LottieView = require("lottie-react-native");

export function LoadAnimation(){
return (
 <Container>
    <LottieView
        source={loadCar}
        style={{ height: 200}}
        resizeMode="contain"
        autoPlay
        loop
    
    />
 </Container>
  );
}

// ou import LottieView from "lottie-react-native";