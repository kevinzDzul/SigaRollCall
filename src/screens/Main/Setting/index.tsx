import Button from '@siga/components/Button';
import Container from '@siga/components/Container';
import ContentBody from '@siga/components/ContentBody';
import { CustomText } from '@siga/components/CustomText';
import Header from '@siga/components/Header';
import { useAuth } from '@siga/context/authProvider';
import { StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const { logout } = useAuth();
  return (
    <Container>
      <Header mode="drawer" />
      <ContentBody style={styles.body}>
        <CustomText style={styles.title}>Pantalla de ajustes</CustomText>
        <Button title="Cerrar sesión" style={styles.button} onPress={logout} />
      </ContentBody>
    </Container>
  );
}

const styles = StyleSheet.create({
  body: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22 },
  button: { marginTop: 10 },
});
