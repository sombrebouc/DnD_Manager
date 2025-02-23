import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user, logout } = authContext;

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="border-b bg-lime-700 dark:bg-gray-800 p-4 flex justify-between items-center">
      <button className="text-gray-800 dark:text-white" onClick={() => history.push('/menu')}>☰ Menu</button>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">D&D Manager</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src="/path/to/avatar.png" alt="Avatar utilisateur" className="w-10 h-10 rounded-full border-2 border-gray-300" />
          <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
        </div>
        <button onClick={() => history.push('/profile')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Profil</button>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Se déconnecter</button>
      </div>
    </header>
  );
};

export default Navbar;
