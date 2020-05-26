import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Initial from '../screens/';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const SwitchNavigator = createSwitchNavigator(
  {
    Initial: Initial,
    Auth: AuthNavigator,
    App: AppNavigator,
  },
  {
    initialRouteName: 'Initial',
  }
);

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;
