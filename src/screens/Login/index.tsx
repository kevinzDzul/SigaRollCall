import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@siga/context/authProvider';
import Button from '@siga/components/Button';
import { InputText } from '@siga/components/InputText';
import Container from '@siga/components/Container';
import { CustomText } from '@siga/components/CustomText';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [user, setUser] = useState<string>('');
  const [pass, setPass] = useState<string>('');

  const [userError, setUseError] = useState<string | undefined>();
  const [passError, setPassError] = useState<string | undefined>();

  const isEmpty = (text: string): boolean => {
    return text.trim() === '' ? true : false;
  };

  const handleLogin = async () => {
    const userErrorMessage = isEmpty(user) ? 'Campo requerido' : undefined;
    const passwordErrorMessage = isEmpty(pass) ? 'Campo requerido' : undefined;
    setUseError(userErrorMessage);
    setPassError(passwordErrorMessage);

    if (user && pass) {
      await login({ user, password: pass });
    }
  };

  return (
    <Container style={styles.container}>
      <CustomText style={styles.title}>Login</CustomText>
      <InputText
        error={userError}
        style={styles.input}
        placeholder="Usuario"
        onChangeText={setUser}
        onFocus={() => setUseError(undefined)}
      />
      <InputText
        placeholder="Contraseña"
        error={passError}
        onFocus={() => setPassError(undefined)}
        secureTextEntry
        style={styles.input}
        onChangeText={setPass} />
      <Button title="Entrar" type="primary" isLoading={isLoading} onPress={handleLogin} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});
