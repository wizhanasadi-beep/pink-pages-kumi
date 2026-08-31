CREATE TABLE public.avis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestataire_id uuid NOT NULL REFERENCES public.prestataires(id) ON DELETE CASCADE,
  autrice text NOT NULL,
  note smallint NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX avis_prestataire_id_idx ON public.avis (prestataire_id);

GRANT SELECT, INSERT ON public.avis TO anon;
GRANT SELECT, INSERT, DELETE ON public.avis TO authenticated;
GRANT ALL ON public.avis TO service_role;

ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Avis are public" ON public.avis FOR SELECT USING (true);

CREATE POLICY "Anyone can add an avis" ON public.avis FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(autrice) BETWEEN 1 AND 60
  AND char_length(commentaire) <= 1000
  AND EXISTS (SELECT 1 FROM public.prestataires p WHERE p.id = prestataire_id AND p.statut = 'publiee')
);

CREATE POLICY "Admins can delete avis" ON public.avis FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));