import Button from '@siga/components/Button';
import Container from '@siga/components/Container';
import { CustomText } from '@siga/components/CustomText';
import Header from '@siga/components/Header';
import { useAuth } from '@siga/context/authProvider';
import { useTheme } from '@siga/context/themeProvider';
import { View, StyleSheet, Switch } from 'react-native';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { toggleTheme, theme, colors } = useTheme();
  return (
    <Container style={styles.container}>
      <Header mode="drawer" />
      <View style={styles.body}>
        <CustomText style={styles.title}>Pantalla de ajustes</CustomText>
        <Button title="Cerrar sesión" style={{ marginTop: 10 }} onPress={logout} />
        <Switch
          trackColor={{ false: colors.primaryContainer, true: colors.primaryContainer }}
          thumbColor={colors.onTertiaryFixedVariant}
          ios_backgroundColor={colors.primary}
          onValueChange={toggleTheme}
          value={theme === 'dark'}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22 },
});
