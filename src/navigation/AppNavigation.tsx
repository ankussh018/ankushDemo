import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RecipesScreen } from '../screens/RecipesScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { useAuth } from '../context/AuthContext';
import { lightTheme, darkTheme } from '../theme/theme';
import { useColorScheme } from 'react-native';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Recipes" component={RecipesScreen} />
  </Tab.Navigator>
);

export const AppNavigation: React.FC = () => {
  const { user, loading } = useAuth();
  const scheme = useColorScheme();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer theme={scheme === 'dark' ? darkTheme : lightTheme}>
      {user ? (
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={TabNavigator} />
        </Drawer.Navigator>
      ) : (
        <LoginScreen />
      )}
    </NavigationContainer>
  );
};