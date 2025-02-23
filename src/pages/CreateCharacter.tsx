import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonLoading } from '@ionic/react';
import supabase from '@utils/supabaseClient';
import { useAuth } from "@context/AuthContext";
import { initialCharacterState, Character } from '../types/characterTypes';
import * as yup from 'yup';
import { fetchRaces, fetchClasses } from '@utils/dndApiService';

// Schéma de validation avec yup
const characterSchema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  race: yup.string().required('La race est requise'),
  class: yup.string().required('La classe est requise'),
  background: yup.string(),
  strength: yup.number().min(1).max(20),
  dexterity: yup.number().min(1).max(20),
  constitution: yup.number().min(1).max(20),
  intelligence: yup.number().min(1).max(20),
  wisdom: yup.number().min(1).max(20),
  charisma: yup.number().min(1).max(20),
});

const CreateCharacter: React.FC = () => {
  const auth = useAuth();
  const user = auth?.user;
  const [character, setCharacter] = useState<Character>(initialCharacterState);
  const [races, setRaces] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les options de races et classes depuis l'API D&D
  useEffect(() => {
    const loadCharacterOptions = async () => {
      try {
        const fetchedRaces = await fetchRaces();
        const fetchedClasses = await fetchClasses();
        setRaces(fetchedRaces);
        setClasses(fetchedClasses);
      } catch (error) {
        console.error('Erreur lors du chargement des données de l\'API D&D:', error);
      }
    };

    loadCharacterOptions();
  }, []);

  // Gestion des changements dans les champs de texte
  const handleChange = (e: CustomEvent) => {
    const { name, value } = e.detail;
    setCharacter({
      ...character,
      [name]: name.match(/strength|dexterity|constitution|intelligence|wisdom|charisma/)
        ? parseInt(value, 10) || 0
        : value,
    });
  };

  // Gestion des changements dans les sélecteurs
  const handleSelectChange = (name: keyof Character, value: string) => {
    setCharacter({
      ...character,
      [name]: value,
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await characterSchema.validate(character);
      setLoading(true);

      const { error } = await supabase.from('characters').insert([{
        ...character,
        id_utilisateur: user?.id  // Associe le personnage à l'utilisateur connecté
      }]);

      if (error) throw error;

      alert('Personnage créé avec succès !');
      setCharacter(initialCharacterState);  // Réinitialisation du formulaire après succès
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        alert(validationError.message);
      } else {
        console.error('Erreur lors de la création du personnage:', validationError);
        alert('Erreur lors de la création du personnage.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Créer un Personnage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} className="space-y-4">
          <IonItem>
            <IonLabel position="stacked">Nom</IonLabel>
            <IonInput name="name" value={character.name} onIonChange={handleChange} required />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Race</IonLabel>
            <IonSelect value={character.race} onIonChange={(e) => handleSelectChange('race', e.detail.value)}>
              {races.map((race: any) => (
                <IonSelectOption key={race.index} value={race.name}>{race.name}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Classe</IonLabel>
            <IonSelect value={character.class} onIonChange={(e) => handleSelectChange('class', e.detail.value)}>
              {classes.map((cls: any) => (
                <IonSelectOption key={cls.index} value={cls.name}>{cls.name}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Historique</IonLabel>
            <IonInput name="background" value={character.background} onIonChange={handleChange} />
          </IonItem>

          {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((stat) => (
            <IonItem key={stat}>
              <IonLabel position="stacked" className="capitalize">{stat}</IonLabel>
              <IonInput type="number" name={stat} value={character[stat as keyof Character] as number} onIonChange={handleChange} />
            </IonItem>
          ))}

          <IonButton expand="block" type="submit">Enregistrer le Personnage</IonButton>
        </form>

        {/* Indicateur de chargement */}
        <IonLoading isOpen={loading} message={"Création du personnage en cours..."} />
      </IonContent>
    </IonPage>
  );
};

export default CreateCharacter;
