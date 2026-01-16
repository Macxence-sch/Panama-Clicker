-- ============================================================================
-- AJOUT DE LA POLITIQUE UPDATE POUR LES SCORES
-- ============================================================================
-- Description: Permet la mise à jour des scores existants
-- À exécuter dans Supabase SQL Editor si la politique n'existe pas déjà
-- ============================================================================

-- Supprimer l'ancienne politique UPDATE si elle existe
DROP POLICY IF EXISTS policy_scores_update_public ON scores;

-- Politique: Mise à jour publique (pour mettre à jour son propre score)
CREATE POLICY policy_scores_update_public
    ON scores
    FOR UPDATE
    TO public
    USING (true)  -- Permet de mettre à jour n'importe quel score
    WITH CHECK (
        money >= 0
        AND renaissance_count >= 0
    );

COMMENT ON POLICY policy_scores_update_public ON scores IS 'Permet à tous de mettre à jour les scores avec validation';

