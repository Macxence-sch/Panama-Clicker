-- ============================================================================
-- SCHEMA SUPABASE - LEADERBOARD PANAMA CLICKER
-- ============================================================================
-- Description: Création de la table et des politiques pour le leaderboard
-- Auteur: Panama Clicker
-- Date: 2024
-- ============================================================================

-- ============================================================================
-- SECTION 1: CRÉATION DE LA TABLE
-- ============================================================================

DROP TABLE IF EXISTS scores CASCADE;

CREATE TABLE scores (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    money BIGINT NOT NULL DEFAULT 0 CHECK (money >= 0),
    renaissance_count INT NOT NULL DEFAULT 0 CHECK (renaissance_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT scores_name_length CHECK (LENGTH(TRIM(name)) >= 1 AND LENGTH(TRIM(name)) <= 50)
);

COMMENT ON TABLE scores IS 'Table stockant les scores des joueurs pour le leaderboard';
COMMENT ON COLUMN scores.id IS 'Identifiant unique auto-incrémenté';
COMMENT ON COLUMN scores.name IS 'Nom du joueur (1-50 caractères)';
COMMENT ON COLUMN scores.money IS 'Montant d''argent du joueur (>= 0)';
COMMENT ON COLUMN scores.renaissance_count IS 'Nombre de renaissance effectuées (>= 0)';
COMMENT ON COLUMN scores.created_at IS 'Date de création du score';
COMMENT ON COLUMN scores.updated_at IS 'Date de dernière mise à jour';

-- ============================================================================
-- SECTION 2: INDEX POUR OPTIMISATION
-- ============================================================================

-- Index pour les requêtes de leaderboard (tri par money décroissant)
CREATE INDEX idx_scores_money_desc 
    ON scores(money DESC NULLS LAST);

-- Index pour les requêtes par date de création
CREATE INDEX idx_scores_created_at_desc 
    ON scores(created_at DESC);

-- Index composite pour les requêtes combinées (money + renaissance_count)
CREATE INDEX idx_scores_money_renaissance 
    ON scores(money DESC, renaissance_count DESC);

COMMENT ON INDEX idx_scores_money_desc IS 'Optimise les requêtes de leaderboard triées par money';
COMMENT ON INDEX idx_scores_created_at_desc IS 'Optimise les requêtes triées par date';
COMMENT ON INDEX idx_scores_money_renaissance IS 'Optimise les requêtes combinant money et renaissance_count';

-- ============================================================================
-- SECTION 3: FONCTIONS ET TRIGGERS
-- ============================================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_updated_at_column() IS 'Met à jour automatiquement le champ updated_at lors d''une modification';

-- Trigger pour exécuter la fonction update_updated_at_column
DROP TRIGGER IF EXISTS trigger_update_scores_updated_at ON scores;

CREATE TRIGGER trigger_update_scores_updated_at
    BEFORE UPDATE ON scores
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TRIGGER trigger_update_scores_updated_at ON scores IS 'Déclenche la mise à jour de updated_at avant chaque UPDATE';

-- ============================================================================
-- SECTION 4: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activer RLS sur la table
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS policy_scores_select_public ON scores;
DROP POLICY IF EXISTS policy_scores_insert_public ON scores;

-- Politique: Lecture publique (pour afficher le leaderboard)
CREATE POLICY policy_scores_select_public
    ON scores
    FOR SELECT
    TO public
    USING (true);

COMMENT ON POLICY policy_scores_select_public ON scores IS 'Permet à tous de lire les scores (leaderboard public)';

-- Politique: Insertion publique (pour envoyer des scores)
CREATE POLICY policy_scores_insert_public
    ON scores
    FOR INSERT
    TO public
    WITH CHECK (
        name IS NOT NULL 
        AND LENGTH(TRIM(name)) >= 1 
        AND LENGTH(TRIM(name)) <= 50
        AND money >= 0
        AND renaissance_count >= 0
    );

COMMENT ON POLICY policy_scores_insert_public ON scores IS 'Permet à tous d''insérer des scores avec validation';

-- ============================================================================
-- SECTION 5: VÉRIFICATIONS ET TESTS
-- ============================================================================

-- Vérifier que la table existe et est accessible
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'scores') THEN
        RAISE NOTICE '✓ Table "scores" créée avec succès';
    ELSE
        RAISE EXCEPTION '✗ Erreur: La table "scores" n''a pas été créée';
    END IF;
END $$;

-- Afficher la structure de la table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'scores'
ORDER BY ordinal_position;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
