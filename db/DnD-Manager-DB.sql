-- Suppression des tables existantes pour recréation
DROP TABLE IF EXISTS PersonnageObjet, Objet, PersonnageQuete, Quete, PNJ, JournalCampagne, PersonnageCompetence, PersonnageCaracteristiqueSupplementaire, Personnage, Campagne, ClasseCompetence, Sort, Competence, Classe, Race, Utilisateur CASCADE;

-- ------------------------------------------------
-- Table des Utilisateurs (gérée par Supabase Auth, ne conserve que les champs supplémentaires)
-- ------------------------------------------------
CREATE TABLE Utilisateur (
    id UUID PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL,
    preferences_interface JSONB
);

-- ------------------------------------------------
-- Table des Races (données issues de l'API D&D 5e)
-- ------------------------------------------------
CREATE TABLE Race (
    id SERIAL PRIMARY KEY,
    index VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    description TEXT,
    vitesse INT,
    taille VARCHAR(20),
    traits_raciaux TEXT,
    bonus_caracteristiques JSONB,
    url VARCHAR(255)
);

-- ------------------------------------------------
-- Table des Classes (données issues de l'API D&D 5e)
-- ------------------------------------------------
CREATE TABLE Classe (
    id SERIAL PRIMARY KEY,
    index VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    description TEXT,
    de_vie VARCHAR(10),
    maitrises_armures TEXT,
    maitrises_armes TEXT,
    jets_sauvegarde TEXT,
    url VARCHAR(255)
);

-- ------------------------------------------------
-- Table des Compétences
-- ------------------------------------------------
CREATE TABLE Competence (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    description TEXT,
    caracteristique_associee VARCHAR(20) NOT NULL
);

-- ------------------------------------------------
-- Table de Liaison : ClasseCompétence (remplace competences_disponibles JSONB)
-- ------------------------------------------------
CREATE TABLE ClasseCompetence (
    id_classe INT NOT NULL,
    id_competence INT NOT NULL,
    PRIMARY KEY (id_classe, id_competence),
    FOREIGN KEY (id_classe) REFERENCES Classe(id) ON DELETE CASCADE,
    FOREIGN KEY (id_competence) REFERENCES Competence(id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- Table des Sorts (optionnelle, pour gestion avancée des sorts)
-- ------------------------------------------------
CREATE TABLE Sort (
    id SERIAL PRIMARY KEY,
    index VARCHAR(50) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    niveau INT NOT NULL,
    ecole VARCHAR(50),
    temps_incantation VARCHAR(50),
    portee VARCHAR(50),
    composantes VARCHAR(50),
    duree VARCHAR(50),
    description TEXT,
    classes_disponibles JSONB,
    url VARCHAR(255)
);

-- ------------------------------------------------
-- Table des Campagnes
-- ------------------------------------------------
CREATE TABLE Campagne (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    date_creation TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_mj UUID NOT NULL,
    statut VARCHAR(20) DEFAULT 'active',
    parametres_campagne JSONB,
    FOREIGN KEY (id_mj) REFERENCES Utilisateur(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ------------------------------------------------
-- Table des Personnages (liée à Utilisateur, Race et Classe)
-- ------------------------------------------------
CREATE TABLE Personnage (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    niveau INT NOT NULL DEFAULT 1,
    force INT NOT NULL,
    dexterite INT NOT NULL,
    constitution INT NOT NULL,
    intelligence INT NOT NULL,
    sagesse INT NOT NULL,
    charisme INT NOT NULL,
    points_vie_max INT NOT NULL,
    points_vie_actuels INT NOT NULL,
    points_vie_temporaires INT DEFAULT 0,
    classe_armure INT NOT NULL,
    alignement VARCHAR(50),
    background VARCHAR(100),
    experience_points INT NOT NULL DEFAULT 0,
    inspiration BOOLEAN DEFAULT FALSE,
    avatar_url VARCHAR(255),
    id_utilisateur UUID NOT NULL,
    id_campagne INT,
    id_race INT NOT NULL,
    id_classe INT NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_campagne) REFERENCES Campagne(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_race) REFERENCES Race(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_classe) REFERENCES Classe(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ------------------------------------------------
-- Table des Caractéristiques Supplémentaires des Personnages
-- ------------------------------------------------
CREATE TABLE PersonnageCaracteristiqueSupplementaire (
    id SERIAL PRIMARY KEY,
    id_personnage INT NOT NULL,
    nom VARCHAR(50) NOT NULL,
    valeur TEXT,
    FOREIGN KEY (id_personnage) REFERENCES Personnage(id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- Table de Liaison : PersonnageCompétence
-- ------------------------------------------------
CREATE TABLE PersonnageCompetence (
    id_personnage INT NOT NULL,
    id_competence INT NOT NULL,
    est_maitre BOOLEAN DEFAULT FALSE,
    bonus_specifique INT DEFAULT 0,
    source VARCHAR(50),
    PRIMARY KEY (id_personnage, id_competence),
    FOREIGN KEY (id_personnage) REFERENCES Personnage(id) ON DELETE CASCADE,
    FOREIGN KEY (id_competence) REFERENCES Competence(id) ON DELETE RESTRICT
);

-- ------------------------------------------------
-- Table des Objets
-- ------------------------------------------------
CREATE TABLE Objet (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    rarete VARCHAR(50),
    proprietes JSONB
);

-- ------------------------------------------------
-- Table de Liaison : PersonnageObjet
-- ------------------------------------------------
CREATE TABLE PersonnageObjet (
    id_personnage INT NOT NULL,
    id_objet INT NOT NULL,
    quantite INT DEFAULT 1,
    PRIMARY KEY (id_personnage, id_objet),
    FOREIGN KEY (id_personnage) REFERENCES Personnage(id) ON DELETE CASCADE,
    FOREIGN KEY (id_objet) REFERENCES Objet(id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- Table des Journaux de Campagne
-- ------------------------------------------------
CREATE TABLE JournalCampagne (
    id SERIAL PRIMARY KEY,
    id_campagne INT NOT NULL,
    titre VARCHAR(100),
    contenu TEXT,
    date_creation TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    auteur UUID,
    FOREIGN KEY (id_campagne) REFERENCES Campagne(id) ON DELETE CASCADE,
    FOREIGN KEY (auteur) REFERENCES Utilisateur(id) ON DELETE SET NULL
);

-- ------------------------------------------------
-- Table des PNJ
-- ------------------------------------------------
CREATE TABLE PNJ (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    role VARCHAR(50),
    id_campagne INT NOT NULL,
    FOREIGN KEY (id_campagne) REFERENCES Campagne(id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- Table des Quêtes
-- ------------------------------------------------
CREATE TABLE Quete (
    id SERIAL PRIMARY KEY,
    id_campagne INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    statut VARCHAR(20) DEFAULT 'active',
    recompense JSONB,
    FOREIGN KEY (id_campagne) REFERENCES Campagne(id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- Table de Liaison : PersonnageQuete
-- ------------------------------------------------
CREATE TABLE PersonnageQuete (
    id_personnage INT NOT NULL,
    id_quete INT NOT NULL,
    statut VARCHAR(20) DEFAULT 'en cours',
    PRIMARY KEY (id_personnage, id_quete),
    FOREIGN KEY (id_personnage) REFERENCES Personnage(id) ON DELETE CASCADE,
    FOREIGN KEY (id_quete) REFERENCES Quete(id) ON DELETE CASCADE
);
