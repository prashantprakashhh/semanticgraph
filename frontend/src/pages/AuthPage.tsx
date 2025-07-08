// src/pages/AuthPage.tsx
import { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const switchToRegister = () => setIsRegistering(true);
  const switchToLogin = () => setIsRegistering(false);

  return (
    <>
      {isRegistering ? (
        <RegisterPage onSwitchToLogin={switchToLogin} />
      ) : (
        <LoginPage onSwitchToRegister={switchToRegister} />
      )}
    </>
  );
};

export default AuthPage;