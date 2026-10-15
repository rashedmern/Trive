import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import OtpScreen from './src/screens/OtpScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';

export default function App() {
  // Navigation Flow: 'splash' -> 'onboarding' -> 'auth' -> 'otp' -> 'dashboard' <-> 'order-details'
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedOrderId, setSelectedOrderId] = useState('#CB1AD25');
  const [authData, setAuthData] = useState({
    phoneNumber: '1712345678',
    code: '4829',
  });

  const handleAuthContinue = (data) => {
    if (data && data.phoneNumber) {
      setAuthData(data);
    }
    setCurrentScreen('otp');
  };

  const handleOpenOrder = (orderId) => {
    if (orderId) setSelectedOrderId(orderId);
    setCurrentScreen('order-details');
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.root}>
          {currentScreen === 'splash' && (
            <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />
          )}

          {currentScreen === 'onboarding' && (
            <OnboardingScreen onFinish={() => setCurrentScreen('auth')} />
          )}

          {currentScreen === 'auth' && (
            <AuthScreen onContinue={handleAuthContinue} />
          )}

          {currentScreen === 'otp' && (
            <OtpScreen
              phoneNumber={authData.phoneNumber}
              expectedCode={authData.code}
              onBack={() => setCurrentScreen('auth')}
              onSuccess={() => setCurrentScreen('dashboard')}
            />
          )}

          {currentScreen === 'dashboard' && (
            <DashboardScreen onSelectOrder={handleOpenOrder} />
          )}

          {currentScreen === 'order-details' && (
            <OrderDetailsScreen
              orderId={selectedOrderId}
              onBack={() => setCurrentScreen('dashboard')}
            />
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
