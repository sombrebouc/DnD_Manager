import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import supabase from '@utils/supabaseClient';
import Navbar from '../components/Navbar';

const HomePage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const [characters, setCharacters] = useState([]);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user, logout } = authContext;

  useEffect(() => {
    if (!user) {
      history.push('/login');
    } else {
      fetchCharacters();
    }
  }, [user, history]);

  const fetchCharacters = async () => {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id_utilisateur', user?.id);

    if (error) {
      console.error('Erreur lors de la récupération des personnages:', error);
    } else {
      setCharacters(data);
    }
  };

  const handleDeleteCharacter = async (id: number) => {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du personnage:', error);
    } else {
      setCharacters(characters.filter((char: any) => char.id !== id));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mt-8">
          Bienvenue, {user?.pseudo} !
        </h2>
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">Vos Personnages</h3>
          <div className="space-y-4">
            {characters.length > 0 ? (
              characters.map((char: any) => (
                <div key={char.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{char.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{char.race} - {char.class}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteCharacter(char.id)} 
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">Aucun personnage trouvé.</p>
            )}
          </div>
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => history.push('/CreateCharacter')} 
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Créer un Personnage
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
