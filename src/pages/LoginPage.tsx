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
    <div className="container">
      <div className="container my-5 text-center">
        <h1 className="font-weight-extrabold">D & D MANAGER</h1>
      </div>
      <div className='container shadow-lg py-3 rounded flexbox bg-light border border-5 border-white'>
        <h2 className="text-center text-secondary">Connexion</h2>
        <div className="container flex-column d-flex justify-content-center align-items-center">
          {loginSuccess && <p>Connexion réussie ! Vous allez être redirigé vers la page d'accueil.</p>}
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          <form className='form-group flex-column d-flex justify-content-center align-items-center' onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Login</label>
            <input className=" p-1 mt-1 mb-3 px-2 rounded border none" {...register('email', { required: true })} placeholder="Email" />
            {errors.email && <span>Ce champ est requis</span>}
            <label htmlFor="password">Password</label>
            <input className=" p-1 mt-1 mb-3 px-2 rounded border none" {...register('password', { required: true })} type="password" placeholder="Mot de passe" />
            {errors.password && <span>Ce champ est requis</span>}
            <input className="btn btn-dark shadow-md p-1 my-3 px-2 rounded border none" type="submit" value="Se connecter" />
          </form>

        </div>
        <div className="container flex-column d-flex justify-content-center align-items-center">
        <Link className="m-2" to="/register">Pas encore de compte ? Inscrivez-vous</Link>
        <a className="m-2" href="/reset_password">Mot de passe oublié ?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
