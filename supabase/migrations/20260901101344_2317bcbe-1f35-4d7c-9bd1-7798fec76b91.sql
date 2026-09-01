CREATE TYPE public.statut_demande_acces AS ENUM ('en_attente', 'acceptee', 'refusee');

CREATE TABLE public.demandes_acces (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  nom text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  statut public.statut_demande_acces NOT NULL DEFAULT 'en_attente',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.demandes_acces TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.demandes_acces TO authenticated;
GRANT ALL ON public.demandes_acces TO service_role;

ALTER TABLE public.demandes_acces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request access"
ON public.demandes_acces FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(email) BETWEEN 3 AND 200
  AND char_length(nom) <= 120
  AND char_length(message) <= 1000
  AND statut = 'en_attente'
);

CREATE POLICY "Admins read access requests"
ON public.demandes_acces FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update access requests"
ON public.demandes_acces FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete access requests"
ON public.demandes_acces FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER demandes_acces_touch
BEFORE UPDATE ON public.demandes_acces
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Admins read all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));