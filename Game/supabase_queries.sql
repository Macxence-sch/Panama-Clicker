-- ============================================================================
-- REQUÊTES SQL UTILES - LEADERBOARD PANAMA CLICKER
-- ============================================================================
-- Collection de requêtes SQL pour gérer et analyser les scores
-- ============================================================================

-- ============================================================================
-- SECTION 1: REQUÊTES DE LECTURE (LEADERBOARD)
-- ============================================================================

-- Top 10 des meilleurs scores (par money)
SELECT 
    ROW_NUMBER() OVER (ORDER BY money DESC) AS rank,
    name,
    money,
    renaissance_count,
    created_at
FROM scores
ORDER BY money DESC
LIMIT 10;

-- Top 10 avec formatage des nombres
SELECT 
    ROW_NUMBER() OVER (ORDER BY money DESC) AS rank,
    name,
    TO_CHAR(money, 'FM999,999,999,999') AS money_formatted,
    renaissance_count,
    TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') AS date_formatted
FROM scores
ORDER BY money DESC
LIMIT 10;

-- Leaderboard avec score combiné (money + renaissance_count * 1000000)
SELECT 
    ROW_NUMBER() OVER (ORDER BY (money + renaissance_count * 1000000) DESC) AS rank,
    name,
    money,
    renaissance_count,
    (money + renaissance_count * 1000000) AS combined_score,
    created_at
FROM scores
ORDER BY combined_score DESC
LIMIT 10;

-- Statistiques globales
SELECT 
    COUNT(*) AS total_scores,
    COUNT(DISTINCT name) AS unique_players,
    MAX(money) AS highest_money,
    AVG(money)::BIGINT AS average_money,
    MAX(renaissance_count) AS max_renaissance,
    AVG(renaissance_count)::INT AS average_renaissance,
    MIN(created_at) AS first_score_date,
    MAX(created_at) AS last_score_date
FROM scores;

-- Top joueurs par nombre de renaissance
SELECT 
    name,
    MAX(renaissance_count) AS max_renaissance,
    COUNT(*) AS number_of_scores,
    MAX(money) AS best_money
FROM scores
GROUP BY name
ORDER BY max_renaissance DESC, best_money DESC
LIMIT 10;

-- ============================================================================
-- SECTION 2: REQUÊTES D'ANALYSE
-- ============================================================================

-- Distribution des scores par tranches
SELECT 
    CASE 
        WHEN money < 1000 THEN '0-1K'
        WHEN money < 10000 THEN '1K-10K'
        WHEN money < 100000 THEN '10K-100K'
        WHEN money < 1000000 THEN '100K-1M'
        WHEN money < 10000000 THEN '1M-10M'
        ELSE '10M+'
    END AS money_range,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM scores), 2) AS percentage
FROM scores
GROUP BY money_range
ORDER BY MIN(money);

-- Scores par jour (derniers 30 jours)
SELECT 
    DATE(created_at) AS date,
    COUNT(*) AS scores_count,
    COUNT(DISTINCT name) AS unique_players,
    MAX(money) AS best_score
FROM scores
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Joueurs les plus actifs (nombre de scores envoyés)
SELECT 
    name,
    COUNT(*) AS scores_sent,
    MAX(money) AS best_money,
    MAX(renaissance_count) AS best_renaissance,
    MIN(created_at) AS first_score,
    MAX(created_at) AS last_score
FROM scores
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY scores_sent DESC, best_money DESC
LIMIT 20;

-- ============================================================================
-- SECTION 3: REQUÊTES DE MAINTENANCE
-- ============================================================================

-- Compter le nombre total de scores
SELECT COUNT(*) AS total_scores FROM scores;

-- Vérifier l'intégrité des données
SELECT 
    COUNT(*) AS total_rows,
    COUNT(CASE WHEN name IS NULL OR TRIM(name) = '' THEN 1 END) AS invalid_names,
    COUNT(CASE WHEN money < 0 THEN 1 END) AS negative_money,
    COUNT(CASE WHEN renaissance_count < 0 THEN 1 END) AS negative_renaissance
FROM scores;

-- Trouver les doublons (même nom, même money, même renaissance_count)
SELECT 
    name,
    money,
    renaissance_count,
    COUNT(*) AS duplicate_count,
    ARRAY_AGG(id ORDER BY created_at) AS ids,
    ARRAY_AGG(created_at ORDER BY created_at) AS dates
FROM scores
GROUP BY name, money, renaissance_count
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Nettoyer les anciens scores (garder seulement le meilleur score par joueur)
-- ⚠️ ATTENTION: Cette requête supprime des données !
/*
DELETE FROM scores
WHERE id NOT IN (
    SELECT DISTINCT ON (name) id
    FROM scores
    ORDER BY name, money DESC, created_at DESC
);
*/

-- ============================================================================
-- SECTION 4: REQUÊTES DE RECHERCHE
-- ============================================================================

-- Rechercher un joueur par nom
SELECT 
    id,
    name,
    money,
    renaissance_count,
    created_at,
    updated_at
FROM scores
WHERE LOWER(name) LIKE LOWER('%nom_du_joueur%')
ORDER BY money DESC;

-- Trouver la position d'un joueur dans le leaderboard
WITH ranked_scores AS (
    SELECT 
        name,
        money,
        ROW_NUMBER() OVER (ORDER BY money DESC) AS rank
    FROM scores
)
SELECT 
    rank,
    name,
    money
FROM ranked_scores
WHERE LOWER(name) = LOWER('nom_du_joueur');

-- Scores récents (dernières 24 heures)
SELECT 
    name,
    money,
    renaissance_count,
    created_at,
    EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 AS hours_ago
FROM scores
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- ============================================================================
-- SECTION 5: REQUÊTES ADMINISTRATIVES
-- ============================================================================

-- Supprimer tous les scores (⚠️ DANGEREUX - À utiliser avec précaution)
-- ⚠️ DÉCOMMENTEZ UNIQUEMENT SI VOUS ÊTES SÛR !
/*
TRUNCATE TABLE scores RESTART IDENTITY CASCADE;
*/

-- Supprimer les scores d'un joueur spécifique
-- ⚠️ DÉCOMMENTEZ ET MODIFIEZ LE NOM !
/*
DELETE FROM scores
WHERE LOWER(name) = LOWER('nom_du_joueur');
*/

-- Supprimer les scores plus anciens qu'une certaine date
-- ⚠️ DÉCOMMENTEZ ET MODIFIEZ LA DATE !
/*
DELETE FROM scores
WHERE created_at < '2024-01-01'::DATE;
*/

-- Réinitialiser les IDs (après suppression de données)
-- ⚠️ ATTENTION: Réinitialise la séquence d'auto-incrémentation
/*
SELECT setval('scores_id_seq', (SELECT MAX(id) FROM scores));
*/

-- ============================================================================
-- FIN DU FICHIER
-- ============================================================================

