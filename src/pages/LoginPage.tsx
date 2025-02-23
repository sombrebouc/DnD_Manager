import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useContext(AuthContext)!;
  const history = useHistory();

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    try {
      await login(email, password);
      console.log('Redirection vers /homepage'); // Log de confirmation
      history.push('/homepage');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion.');
    }
  };

  return (
    <div className='container mx-auto '>
      <h2>Connexion</h2>
      {loginSuccess && <p>Connexion réussie ! Vous allez être redirigé vers la page d'accueil.</p>}
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email', { required: true })} placeholder="Email" />
        {errors.email && <span>Ce champ est requis</span>}
        <input {...register('password', { required: true })} type="password" placeholder="Mot de passe" />
        {errors.password && <span>Ce champ est requis</span>}
        <input type="submit" value="Se connecter" />
      </form>
      <Link to="/register">Pas encore de compte ? Inscrivez-vous</Link>
      <a href="/reset_password">Mot de passe oublié ?</a>
    </div>
  );
};

export default LoginPage;
