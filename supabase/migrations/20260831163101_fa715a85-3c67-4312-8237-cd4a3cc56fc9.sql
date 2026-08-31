-- ROLES
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users can read their own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- CATEGORIES
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text not null unique,
  icone text not null default '✦',
  description text,
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "Categories are public" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- PRESTATAIRES
create type public.deplacement_mode as enum ('se_deplace', 'sur_place', 'sur_demande');
create type public.statut_fiche as enum ('en_attente', 'publiee', 'refusee');

create table public.prestataires (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  activite text not null,
  categorie_slug text not null references public.categories(slug) on update cascade,
  sous_categorie text,
  description text not null default '',
  photo_url text,
  ville text not null default '',
  quartier text,
  telephone text,
  instagram text,
  site_web text,
  lien_reservation text,
  latitude double precision,
  longitude double precision,
  deplacement public.deplacement_mode not null default 'sur_place',
  zone_deplacement text,
  statut public.statut_fiche not null default 'en_attente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.prestataires to anon, authenticated;
grant insert on public.prestataires to anon, authenticated;
grant update, delete on public.prestataires to authenticated;
grant all on public.prestataires to service_role;
alter table public.prestataires enable row level security;

create policy "Published listings are public" on public.prestataires for select using (statut = 'publiee');
create policy "Admins can read all listings" on public.prestataires for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Anyone can submit a listing" on public.prestataires for insert to anon, authenticated with check (statut = 'en_attente');
create policy "Admins can update listings" on public.prestataires for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete listings" on public.prestataires for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger prestataires_touch before update on public.prestataires for each row execute function public.touch_updated_at();

-- SEED CATEGORIES
insert into public.categories (nom, slug, icone, description, ordre) values
('Beauté', 'beaute', '💄', 'MUA, coiffure, lash tech, nails, esthétique', 1),
('Mode & Style', 'mode', '👗', 'Personal shopper, couture, retouches, stylisme', 2),
('Événementiel', 'evenementiel', '💐', 'Wedding planner, coordination, décoration, location', 3),
('Création', 'creation', '📸', 'Photographie, vidéo, graphisme, création de contenu', 4),
('Food', 'food', '🍰', 'Pâtisserie, cake design, traiteur', 5),
('Autres services', 'autres', '✦', 'Tous les autres talents des Kumi', 6);

-- SEED PRESTATAIRES
insert into public.prestataires (nom, activite, categorie_slug, sous_categorie, description, ville, quartier, telephone, instagram, site_web, lien_reservation, latitude, longitude, deplacement, zone_deplacement, statut) values
('Amina D.', 'Glow by Amina', 'beaute', 'MUA', 'Make-up artist spécialisée peaux riches en mélanine. Mariages, shootings et soirées : un teint lumineux qui tient toute la nuit.', 'Paris', '10e arrondissement', '+33 6 12 34 56 78', 'https://instagram.com/glowbyamina', 'https://glowbyamina.fr', 'https://calendly.com/glowbyamina', 48.8760, 2.3590, 'se_deplace', 'Île-de-France', 'publiee'),
('Naïla K.', 'Studio Naïla Hair', 'beaute', 'Coiffure', 'Tresses, twists, soins hydratation et pose de perruque sur mesure. Salon cocon, playlist obligatoire.', 'Saint-Denis', 'Centre-ville', '+33 6 22 45 78 90', 'https://instagram.com/studionailahair', null, 'https://planity.com/studio-naila', 48.9362, 2.3574, 'sur_place', null, 'publiee'),
('Léna B.', 'Cils de Léna', 'beaute', 'Lash Tech', 'Extensions de cils russes, volume mixte et rehaussement. Le regard réveillé même à 7h du matin.', 'Boulogne-Billancourt', 'Marcel Sembat', '+33 6 33 21 65 09', 'https://instagram.com/cilsdelena', null, null, 48.8365, 2.2410, 'sur_demande', 'Ouest parisien sur demande', 'publiee'),
('Fatou S.', 'Nails by Fatou', 'beaute', 'Nails', 'Prothésiste ongulaire : gel, chrome, nail art sur mesure. Les ongles qui font tourner les têtes en réunion.', 'Montreuil', 'Croix de Chavaux', '+33 6 45 09 87 12', 'https://instagram.com/nailsbyfatou', null, 'https://planity.com/nailsbyfatou', 48.8580, 2.4370, 'sur_place', null, 'publiee'),
('Sarah M.', 'Maison Sarah Esthétique', 'beaute', 'Esthétique', 'Soins visage, épilation au fil et rituels hammam. Une heure pour souffler, vraiment.', 'Lyon', '3e arrondissement', '+33 6 78 12 34 56', 'https://instagram.com/maisonsarahesthetique', 'https://maisonsarah.fr', null, 45.7570, 4.8600, 'sur_place', null, 'publiee'),
('Inès T.', 'Le Dressing d''Inès', 'mode', 'Personal Shopper', 'Personal shopper : tri de dressing, silhouette et shopping accompagné. On garde ton style, en mieux.', 'Paris', '2e arrondissement', '+33 6 11 22 33 44', 'https://instagram.com/ledressingdines', 'https://ledressingdines.com', 'https://calendly.com/ledressingdines', 48.8680, 2.3410, 'se_deplace', 'Paris & proche banlieue', 'publiee'),
('Khadija R.', 'Atelier Khadija Couture', 'mode', 'Couture', 'Couture sur mesure et pièces cérémonie. Bazin, wax, satin : tout est possible avec deux semaines devant nous.', 'Aubervilliers', 'Quatre-Chemins', '+33 6 55 44 33 22', 'https://instagram.com/atelierkhadija', null, null, 48.9130, 2.3830, 'sur_place', null, 'publiee'),
('Awa N.', 'Retouches Express Awa', 'mode', 'Retouches', 'Retouches en 48h : ourlets, cintrages, fermetures. Ta robe tombera enfin parfaitement.', 'Marseille', '2e arrondissement', '+33 6 99 88 77 66', 'https://instagram.com/retouchesawa', null, null, 43.3020, 5.3680, 'sur_demande', 'Marseille centre sur demande', 'publiee'),
('Mariam C.', 'Mariam Weddings', 'evenementiel', 'Wedding Planner', 'Wedding planner spécialisée mariages franco-africains. Deux cultures, un jour parfait, zéro stress.', 'Paris', '18e arrondissement', '+33 6 74 85 96 20', 'https://instagram.com/mariamweddings', 'https://mariamweddings.fr', 'https://calendly.com/mariamweddings', 48.8920, 2.3440, 'se_deplace', 'France entière', 'publiee'),
('Yasmine L.', 'Yasmine Décoration', 'evenementiel', 'Décoration', 'Décoratrice événementielle : arches florales, backdrops et tables dressées comme dans les magazines.', 'Créteil', 'Centre', '+33 6 63 52 41 30', 'https://instagram.com/yasminedeco', null, null, 48.7900, 2.4600, 'se_deplace', 'Île-de-France & Hauts-de-France', 'publiee'),
('Céline A.', 'Coordination by Céline', 'evenementiel', 'Coordination événementielle', 'Coordinatrice jour J : timing, prestataires, imprévus. Tu profites, je gère.', 'Nanterre', 'Préfecture', '+33 6 41 25 63 87', 'https://instagram.com/coordinationbyceline', null, 'https://calendly.com/coordination-celine', 48.8920, 2.2070, 'se_deplace', 'Île-de-France', 'publiee'),
('Ruth O.', 'Ruth Studio Photo', 'creation', 'Photographie', 'Photographe portraits, EVJF et couples. Lumière douce, direction bienveillante, galerie en 7 jours.', 'Paris', '11e arrondissement', '+33 6 30 20 10 05', 'https://instagram.com/ruthstudiophoto', 'https://ruthstudio.fr', 'https://calendly.com/ruthstudio', 48.8580, 2.3790, 'se_deplace', 'Île-de-France & Europe', 'publiee'),
('Dina F.', 'Dina Films', 'creation', 'Vidéo', 'Vidéaste mariage et brand content. Des films qu''on regarde encore trois ans après.', 'Villeurbanne', 'Gratte-Ciel', '+33 6 28 74 19 55', 'https://instagram.com/dinafilms', null, null, 45.7710, 4.8800, 'se_deplace', 'Auvergne-Rhône-Alpes', 'publiee'),
('Maya G.', 'Maya Créative', 'creation', 'Graphisme', 'Identité visuelle et logos pour petites marques féminines. Un branding qui te ressemble vraiment.', 'Lille', 'Vieux-Lille', null, 'https://instagram.com/mayacreative', 'https://mayacreative.design', 'https://calendly.com/mayacreative', 50.6430, 3.0640, 'sur_demande', 'À distance partout en France', 'publiee'),
('Bintou D.', 'Sucré par Bintou', 'food', 'Pâtisserie', 'Pâtisserie maison : layer cakes, cheesecakes et number cakes. Le dessert dont tout le monde reparle.', 'Cergy', 'Cergy-le-Haut', '+33 6 87 65 43 21', 'https://instagram.com/sucreparbintou', null, null, 49.0400, 2.0180, 'se_deplace', 'Val-d''Oise & Paris', 'publiee'),
('Nour H.', 'Cake Design Nour', 'food', 'Cake Design', 'Cake designer : pièces montées, wedding cakes et sculptures sucrées. Commande 3 semaines avant, promis ça vaut le coup.', 'Toulouse', 'Saint-Cyprien', '+33 6 19 28 37 46', 'https://instagram.com/cakedesignnour', 'https://cakedesignnour.fr', null, 43.5960, 1.4300, 'sur_place', null, 'publiee'),
('Aïcha B.', 'Table d''Aïcha', 'food', 'Traiteur', 'Traiteur afro-fusion pour événements de 20 à 200 couverts. Yassa, mafé, mezzés : le buffet dont on parle encore.', 'Bobigny', 'Centre', '+33 6 52 63 74 85', 'https://instagram.com/tabledaicha', null, 'https://calendly.com/tabledaicha', 48.9100, 2.4400, 'se_deplace', 'Île-de-France', 'publiee'),
('Sonia V.', 'Sonia Organise', 'autres', 'Home organising', 'Home organiser : dressings, cuisines et bureaux remis à plat. Une maison qui respire enfin.', 'Bordeaux', 'Chartrons', '+33 6 71 82 93 04', 'https://instagram.com/soniaorganise', null, null, 44.8560, -0.5720, 'se_deplace', 'Gironde', 'publiee'),
('Prisca E.', 'Prisca Coach Voix', 'autres', 'Coaching', 'Coach prise de parole et confiance en soi. Pour les filles qui ont beaucoup à dire.', 'Paris', '13e arrondissement', null, 'https://instagram.com/priscacoachvoix', 'https://priscacoach.fr', 'https://calendly.com/priscacoach', 48.8300, 2.3560, 'sur_demande', 'Visio partout dans le monde', 'publiee'),
('Doriane M.', 'Doriane Contenu', 'creation', 'Création de contenu', 'Création de contenu Instagram & TikTok pour marques beauté. Un shooting, un mois de posts.', 'Paris', '19e arrondissement', '+33 6 34 56 78 90', 'https://instagram.com/dorianecontenu', null, null, 48.8880, 2.3820, 'se_deplace', 'Paris', 'en_attente');