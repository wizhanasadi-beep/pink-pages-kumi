CREATE TABLE public.evenements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('visite','vue_fiche','clic_lien','recherche')),
  chemin text NOT NULL DEFAULT '',
  prestataire_id uuid REFERENCES public.prestataires(id) ON DELETE SET NULL,
  cible text,
  referent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX evenements_created_at_idx ON public.evenements (created_at DESC);
CREATE INDEX evenements_type_idx ON public.evenements (type);

GRANT INSERT ON public.evenements TO anon, authenticated;
GRANT ALL ON public.evenements TO service_role;

ALTER TABLE public.evenements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record an event" ON public.evenements
  FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(chemin) <= 300 AND (cible IS NULL OR char_length(cible) <= 300) AND (referent IS NULL OR char_length(referent) <= 300));