import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../Capture';
import Button from '@siga/components/Button';
import Header from '@siga/components/Header';
import LottiePlayer from '@siga/components/LottiePlayer';
import Container from '@siga/components/Container';
import { CustomText } from '@siga/components/CustomText';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CaptureScreen'>

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Container style={styles.container}>
      <Header mode="drawer" />
      <View style={styles.body}>
        <CustomText style={styles.title}>🤖 Reconocimiento Facial</CustomText>
        <LottiePlayer style={{ width: 200, height: 200, marginBottom: 20 }} />
        <Button title="🔍 Validar Rostro" onPress={() => navigation.navigate('CaptureScreen', { mode: 'validate' })} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
