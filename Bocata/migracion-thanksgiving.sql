-- ============================================================
--  Bocatta · Archivo + packs a elegir + menú de Thanksgiving
--  (se corrió una vez en el SQL Editor de Supabase)
-- ============================================================

-- 1) Columnas nuevas
alter table public.productos add column if not exists archivado boolean not null default false; -- oculto sin borrar
alter table public.productos add column if not exists elegir jsonb not null default '[]'::jsonb;  -- [{"categoria":"Cookies","cantidad":1}], "*" = cualquier postre

-- 2) Halloween al archivo (no se borra)
update public.productos set archivado = true where archivado = false;

-- 3) Título de la temporada
update public.ajustes set temporada = 'Thanksgiving 🦃' where id = 1;

-- 4) Menú de Thanksgiving
insert into public.productos (nombre, descripcion, categoria, temporada, opciones, elegir, foto_url, ancho, orden) values
  ('Golden Cookie', 'Galleta de chispas de chocolate con hilos de caramelo y un toque de sal. Como un abrazo calientito de otoño.', 'Cookies', true,
   '[{"nombre":"Media docena","precio":330},{"nombre":"Docena","precio":600}]', '[]', 'img/golden-cookie.jpg', false, 1010),
  ('Candy Corn Turkey Cookie', 'Galleta de chocolate con un pavito de plumas de candy corn y ojitos curiosos. ¡Glu glu, qué rica!', 'Cookies', true,
   '[{"nombre":"Media docena","precio":360},{"nombre":"Docena","precio":660}]', '[]', 'img/candy-corn-cookie.jpg', false, 1020),
  ('Candy Corn Turkey Brownie', 'Brownie fudgy con un pavito de chocolate, ojitos curiosos y plumas de candy corn. ¡El invitado más tierno de la mesa!', 'Brownies', true,
   '[{"nombre":"Media docena","precio":360},{"nombre":"Docena","precio":660}]', '[]', 'img/candy-corn-brownie.jpg', false, 1030),
  ('M&M Turkey Brownie', 'Brownie fudgy con plumas de dulces de colores, ojitos y piquito rojo. ¡El pavito más colorido de la mesa!', 'Brownies', true,
   '[{"nombre":"Media docena","precio":360},{"nombre":"Docena","precio":660}]', '[]', 'img/mm-turkey-brownie.jpg', false, 1040),
  ('Golden Fudge Brownie', 'Brownie intenso con remolinos de caramelo y escamas de sal. Dulce, saladito y peligrosamente adictivo.', 'Brownies', true,
   '[{"nombre":"Media docena","precio":330},{"nombre":"Docena","precio":600}]', '[]', 'img/golden-fudge-brownie.jpg', false, 1050),
  ('Candy Corn Crispy', 'Rice crispy con un pavito de chocolate y plumas de candy corn. ¡Tierno y festivo!', 'Rice Crispy', true,
   '[{"nombre":"Media docena","precio":360},{"nombre":"Docena","precio":660}]', '[]', 'img/candy-corn-crispy.jpg', false, 1060),
  ('M&M Turkey Crispy', 'Rice crispy con plumas de M&M de colores, ojitos curiosos y piquito rojo. ¡Glu glu!', 'Rice Crispy', true,
   '[{"nombre":"Media docena","precio":360},{"nombre":"Docena","precio":660}]', '[]', 'img/mm-turkey-crispy.jpg', false, 1070),
  ('Golden Crispy', 'Rice crispy con trocitos de malvavisco y caramelo derretido. ¡Crujiente y chicloso!', 'Rice Crispy', true,
   '[{"nombre":"Media docena","precio":330},{"nombre":"Docena","precio":600}]', '[]', 'img/golden-crispy.jpg', false, 1080),
  ('Individual', 'Una pieza de cualquier postre de temporada. Tú eliges cuál.', 'Paquetes', true,
   '[{"nombre":"1 pieza","precio":60}]', '[{"categoria":"*","cantidad":1}]', 'img/individual.jpg', false, 1090),
  ('Gobble & Decorate Kit', 'Decora en casa tu galleta de pavito y de calabaza con icing naranja y blanco y chispitas de Thanksgiving. ¡Diversión para toda la familia!', 'Paquetes', true,
   '[{"nombre":"Kit de 2 galletas","precio":160},{"nombre":"Kit de 4 galletas","precio":290}]', '[]', 'img/cookie-kit.jpg', false, 1100),
  ('3 Pack', '1 galleta, 1 brownie y 1 rice crispy de temporada. Tú eliges cuáles.', 'Paquetes', true,
   '[{"nombre":"3 piezas","precio":165}]', '[{"categoria":"Cookies","cantidad":1},{"categoria":"Brownies","cantidad":1},{"categoria":"Rice Crispy","cantidad":1}]', 'img/pack-3.jpg', true, 1110),
  ('6 Pack', '2 galletas, 2 brownies y 2 rice crispy. Tú eliges cuáles.', 'Paquetes', true,
   '[{"nombre":"6 piezas","precio":360}]', '[{"categoria":"Cookies","cantidad":2},{"categoria":"Brownies","cantidad":2},{"categoria":"Rice Crispy","cantidad":2}]', 'img/pack-6.jpg', true, 1120),
  ('Thankful Box', 'Una mezcla de galletas, brownies y rice crispy. Para compartir en la mesa de Thanksgiving.', 'Paquetes', true,
   '[{"nombre":"Box Surtida (24 piezas)","precio":1250},{"nombre":"Box de 50 (50 piezas)","precio":2400}]', '[]', 'img/thankful-box.jpg', true, 1130);
