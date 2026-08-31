ALTER TABLE public.prestataires
  ADD COLUMN IF NOT EXISTS prenom text,
  ADD COLUMN IF NOT EXISTS type_offre text NOT NULL DEFAULT 'service';

ALTER TABLE public.prestataires DROP CONSTRAINT IF EXISTS prestataires_type_offre_check;
ALTER TABLE public.prestataires ADD CONSTRAINT prestataires_type_offre_check CHECK (type_offre IN ('service','produit'));

DELETE FROM public.avis;
DELETE FROM public.prestataires;

INSERT INTO public.prestataires
  (nom, prenom, activite, type_offre, categorie_slug, sous_categorie, description, ville, zone_deplacement, deplacement, instagram, site_web, latitude, longitude, statut)
VALUES
('Everyday Contents','Godwith','Reels maker & créatrice de contenus','service','creation','Création de contenu','Création de reels et de contenus pour les marques et les entrepreneuses.','Paris','Paris','se_deplace','https://www.instagram.com/everyday.contents',NULL,48.8566,2.3522,'publiee'),
('Nehyir House','Sarah','Onglerie','service','beaute','Nails','Prestations d''onglerie soignées, sur rendez-vous.','Bonneuil-sur-Marne','Val-de-Marne','sur_place','https://www.instagram.com/nyr.house',NULL,48.7700,2.4800,'publiee'),
('N''s Braids','Annie','Coiffure & tresses','service','beaute','Coiffure','Tresses et coiffures protectrices en Île-de-France.','Île-de-France','Île-de-France','se_deplace','https://www.tiktok.com/@ns.braids',NULL,48.8600,2.4200,'publiee'),
('KC''s Touch','Cecilia','Coiffure','service','beaute','Coiffure','Coiffure femme à Paris et en Île-de-France.','Paris','Paris, IDF','se_deplace','https://www.instagram.com/kc._touch',NULL,48.8650,2.3400,'publiee'),
('Anjee','Ange','Coiffure & création de contenu','service','beaute','Coiffure','Coiffure et contenus créatifs, basée à Malakoff.','Malakoff','Île-de-France','se_deplace','https://www.instagram.com/by.anjee',NULL,48.8194,2.2996,'publiee'),
('Excellence Education','Keitchyna','Coaching & éducation financière','service','autres','Coaching','Accompagnement et ressources en éducation financière, 100 % en ligne.','En ligne','En ligne uniquement','sur_demande','https://www.instagram.com/excellence_education_','https://payhip.com/ExcellenceEducation',48.8566,2.3480,'publiee'),
('Coiffure par Denise','Denise','Coiffure','service','beaute','Coiffure','Coiffure sur rendez-vous en Seine-Saint-Denis et Seine-et-Marne.','Seine-Saint-Denis','93 et 77','se_deplace',NULL,NULL,48.9100,2.4400,'publiee'),
('LU Locks','Luriane','Coiffure spécialisée locks','service','beaute','Coiffure','Création et entretien de locks, réservation en ligne.','Créteil','Créteil (94)','sur_place','https://www.instagram.com/lu_looocks','https://lulocks.setmore.com/',48.7904,2.4556,'publiee'),
('LTF Hair','Latifa','Coiffure','service','beaute','Coiffure','Coiffure et poses de perruques à Meaux.','Meaux','Meaux (77)','sur_place','https://www.instagram.com/ltf_hair',NULL,48.9603,2.8783,'publiee'),
('_hair.m','Manuella','Coiffure','service','beaute','Coiffure','Coiffure femme à Épinay-sur-Seine.','Épinay-sur-Seine','Épinay-sur-Seine (93)','sur_place','https://www.instagram.com/_hair.m',NULL,48.9540,2.3150,'publiee'),
('Touchbyjnd','Jessica','Onglerie','service','beaute','Nails','Poses d''ongles et nail art à Champigny-sur-Marne.','Champigny-sur-Marne','Île-de-France','sur_place','https://www.instagram.com/touchbyjnd',NULL,48.8172,2.5153,'publiee'),
('Tsha Cake','Teysha','Pâtisserie & cake design','produit','food','Cake Design','Gâteaux personnalisés, livraison possible en Île-de-France.','Corbeil-Essonnes','Livraison Île-de-France','se_deplace','https://www.instagram.com/tsha_cake',NULL,48.6136,2.4820,'publiee'),
('Bryll.lashes','Francess','Extensions de cils','service','beaute','Lash Tech','Poses d''extensions de cils, volume russe et classique.','Seine-Saint-Denis','IDF (93)','sur_place','https://www.instagram.com/bryll.lashes',NULL,48.9200,2.4000,'publiee'),
('DC Déco','Divine','Décoration événementielle','service','evenementiel','Décoration','Décoration et mise en scène d''événements à Paris et en IDF.','Paris','Paris, IDF','se_deplace','https://www.instagram.com/dc_deco_93',NULL,48.8720,2.3600,'publiee'),
('Crochet.hog','Ruth','Sacs et pochettes en crochet','produit','creation','Création','Sacs et pochettes en crochet faits main, sur commande.','En ligne','En ligne','sur_demande','https://www.instagram.com/crochet.hog',NULL,48.8500,2.3600,'publiee'),
('Thélicieux','Morgane','Agroalimentaire — thés et infusions','produit','food','Agroalimentaire','Thés et douceurs à commander en ligne, retrait dans le 91 et le 77.','En ligne','En ligne et 91/77','se_deplace','https://www.instagram.com/monthelicieux','https://monthelicieux.fr',48.6800,2.3800,'publiee'),
('Eydena Paris','Joyce','Coiffure','service','beaute','Coiffure','Coiffure et soins capillaires en Île-de-France.','Île-de-France','Île-de-France','se_deplace','https://www.instagram.com/eydena.paris',NULL,48.8400,2.3800,'publiee'),
('SlayByIsa','Noemia Isabel','Coiffure','service','beaute','Coiffure','Coiffures et perruques à Ris-Orangis.','Ris-Orangis','Ris-Orangis (91)','sur_place','https://www.instagram.com/slaybyisa',NULL,48.6540,2.4130,'publiee'),
('Dieulda Makeup','Dieulda','Maquillage','service','beaute','MUA','Maquillage événementiel et mariées à Noisy-le-Grand.','Noisy-le-Grand','Noisy-le-Grand (93)','sur_place','https://www.instagram.com/dieulda.makeup_',NULL,48.8486,2.5528,'publiee'),
('NaeemLashes','Alycia Eunice','Extensions de cils','service','beaute','Lash Tech','Extensions de cils à Sartrouville.','Sartrouville','Sartrouville (78)','sur_place','https://www.instagram.com/naeemlashes',NULL,48.9400,2.1600,'publiee'),
('Bkl.Touch','Sephora','Coiffure & maquillage','service','beaute','Coiffure','Coiffure et maquillage, déplacements en IDF et au-delà.','Île-de-France','IDF et autres','se_deplace','https://www.instagram.com/bkltouch',NULL,48.8300,2.3300,'publiee'),
('Originaal Cakes','Jade','Cake design — layer cakes & cupcakes','produit','food','Cake Design','Layer cakes et cupcakes sur mesure, basée à Lieusaint.','Lieusaint','Lieusaint (77)','se_deplace','https://www.instagram.com/originaalcakes',NULL,48.6270,2.5540,'publiee'),
('Blue Iris Film','Thamar','Création de contenu & audiovisuel','service','creation','Vidéo','Captation vidéo et création de contenu en Île-de-France.','Île-de-France','Île-de-France','se_deplace','https://www.instagram.com/blueirisfilm',NULL,48.8800,2.3900,'publiee'),
('Sumner Creative','Esther','Création de sites web','service','creation','Graphisme','Conception de sites web pour entrepreneuses et associations.','Île-de-France','IDF / en ligne','sur_demande','https://www.instagram.com/sumner_creative',NULL,48.8900,2.3200,'publiee'),
('Daily Rolls','Raïnath','Pâtisserie','produit','food','Pâtisserie','Rolls et douceurs pâtissières, commandes en Île-de-France.','Île-de-France','IDF — sous réserve','se_deplace','https://www.instagram.com/dailyrollsss',NULL,48.8450,2.4100,'publiee'),
('Marica','Léa','Bonnets en soie & vêtements','produit','creation','Création','Bonnets en soie et pièces de vêtements pour prendre soin de ses cheveux.','Paris','Paris / IDF','se_deplace','https://www.instagram.com/marileaa_',NULL,48.8620,2.3300,'publiee'),
('Ri_twist','Mauricia','Coiffure','service','beaute','Coiffure','Twists et coiffures protectrices à Paris et en IDF.','Paris','Paris et IDF','se_deplace','https://www.instagram.com/ri_twist',NULL,48.8480,2.3700,'publiee'),
('Daane Home Spa','Emelda','Spa à domicile — soins et bains de pieds','service','beaute','Esthétique','Soins et bains de pieds à domicile, sur rendez-vous.','Paris','Paris IDF','se_deplace','https://www.instagram.com/daanehomespaa',NULL,48.8380,2.3450,'publiee');