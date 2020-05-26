import { createStackNavigator } from 'react-navigation-stack';
import { Login, Signup, ForgotPassword } from '../screens/';

const AuthNavigator = createStackNavigator(
  {
    Login: Login,
    Signup: Signup,
    ForgotPassword: ForgotPassword,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
);

export default AuthNavigator;
