import Button from '@siga/components/Button';
import Container from '@siga/components/Container';
import { CustomText } from '@siga/components/CustomText';
import Header from '@siga/components/Header';
import { useAuth } from '@siga/context/authProvider';
import { View, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const { logout } = useAuth();
  return (
    <Container style={styles.container}>
      <Header mode="drawer" />
      <View style={styles.body}>
        <CustomText style={styles.title}>Pantalla de ajustes</CustomText>
        <Button title="Cerrar sesión" style={styles.button} onPress={logout} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22 },
  button: { marginTop: 10 },
});
