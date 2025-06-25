import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#6a66a3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d1b69',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6a4c93',
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0d6e2',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6a66a3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#6a66a3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#6a4c93',
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: 'bold',
    color: '#2d1b69',
  },
  errorText: {
    color: '#d9534f',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});
