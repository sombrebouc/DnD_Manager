import React, { useEffect, useState } from 'react';
import supabase from '@utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

const CharacterList: React.FC = () => {
  const auth = useAuth();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id_utilisateur', auth?.user?.id); // Filtre les personnages par utilisateur

      if (error) {
        console.error('Erreur lors de la récupération des personnages:', error);
      } else {
        setCharacters(data);
      }
    };

    if (auth?.user) {
      fetchCharacters();
    }
  }, [auth?.user]);

  return (
    <div>
      <h2>Mes Personnages</h2>
      {characters.map((char: any) => (
        <div key={char.id}>
          <p>Nom : {char.name}</p>
          <p>Race : {char.race}</p>
          <p>Classe : {char.class}</p>
        </div>
      ))}
    </div>
  );
};

export default CharacterList;
