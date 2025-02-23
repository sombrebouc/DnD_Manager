// src/pages/RegisterPage.tsx
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/authContext';

const RegisterPage: React.FC = () => {
  const { register: registerForm, handleSubmit, formState: { errors } } = useForm();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const { register } = useContext(AuthContext)!;

  const onSubmit = async (data: any) => {
    console.log('Form data:', data); // Ajoutez ce message de débogage
    const { email, password } = data;
    try {
      await register(email, password);
      // Traitement de la réponse d'inscription réussie
      setRegistrationSuccess(true);
      setRegistrationError(null);
    } catch (error) {
      // Traitement de l'erreur d'inscription
      console.error('Erreur d\'inscription:', error);
      setRegistrationSuccess(false);
      if (error instanceof Error) {
        setRegistrationError(error.message || 'Une erreur est survenue lors de l\'inscription.');
      } else {
        setRegistrationError('Une erreur est survenue lors de l\'inscription.');
      }
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      {registrationSuccess && <p>Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.</p>}
      {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...registerForm('email', { required: true })} placeholder="Email" />
        {errors.email && <span>Ce champ est requis</span>}
        <input {...registerForm('password', { required: true })} type="password" placeholder="Mot de passe" />
        {errors.password && <span>Ce champ est requis</span>}
        <input type="submit" value="S'inscrire" />
      </form>
    </div>
  );
};

export default RegisterPage;