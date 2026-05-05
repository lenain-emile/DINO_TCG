-- 1. Création de la table 'users'
-- Note : On utilise "users" car "user" est un mot-clé réservé dans PostgreSQL
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Insertion d'un utilisateur de test
INSERT INTO users (username, email, password_hash)
VALUES (
    'jean_dupont',
    'jean.dupont@example.com',
    '$2b$12$dQw4w9WgXcQ.L2j.K3b5ue8H1X5R5X5R5X5R5X5R5X5R5X5R5X5R5' -- Exemple de hash factice
);

-- 3. Vérification des données
SELECT * FROM users;