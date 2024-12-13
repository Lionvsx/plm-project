DO $$ BEGIN
    -- Temporairement autoriser la modification des valeurs de l'enum
    ALTER TYPE project_status ADD VALUE 'IN_PROGRESS';
    
    -- Mettre à jour les projets existants
    UPDATE project SET status = 'IN_PROGRESS' WHERE status = 'ACTIVE';
    
    -- Supprimer l'ancienne valeur
    -- Note: PostgreSQL ne permet pas de supprimer des valeurs d'enum directement
    -- Il faudra recréer le type si nécessaire
END $$; 