-- ============================================================
--  Bocatta · Preparar la base de datos
--  Copia TODO este texto, pégalo en el SQL Editor de Supabase
--  y presiona "Run". Solo se hace una vez.
-- ============================================================

-- 1) Productos del menú
create table if not exists public.productos (
  id          bigint generated always as identity primary key,
  nombre      text not null,
  descripcion text not null default '',
  categoria   text not null default '',          -- Ej: Cookies, Brownies
  temporada   boolean not null default false,     -- true = sale bajo "De temporada"
  opciones    jsonb not null default '[]'::jsonb, -- [{"nombre":"Media docena","precio":300}, ...]
  foto_url    text,
  foto_path   text,                               -- ruta en el almacenamiento (null si es foto de la página)
  ancho       boolean not null default false,     -- foto horizontal (tarjeta ancha)
  disponible  boolean not null default true,
  orden       integer not null default 0,
  archivado   boolean not null default false,     -- true = oculto del menú sin borrarlo
  elegir      jsonb not null default '[]'::jsonb, -- packs: [{"categoria":"Cookies","cantidad":1}], "*" = cualquiera
  creado      timestamptz not null default now()
);

-- 2) Ajustes generales (una sola fila)
create table if not exists public.ajustes (
  id         integer primary key default 1 check (id = 1),
  temporada  text not null default 'Halloween 🎃'  -- título de la sección de temporada
);
insert into public.ajustes (id) values (1) on conflict (id) do nothing;

-- 3) Seguridad: cualquiera puede VER, solo Ana (con sesión) puede CAMBIAR
alter table public.productos enable row level security;
alter table public.ajustes enable row level security;

grant select on public.productos, public.ajustes to anon, authenticated;
grant insert, update, delete on public.productos to authenticated;
grant update on public.ajustes to authenticated;

drop policy if exists "Todos ven productos" on public.productos;
create policy "Todos ven productos" on public.productos for select using (true);
drop policy if exists "Ana agrega" on public.productos;
create policy "Ana agrega" on public.productos for insert to authenticated with check (true);
drop policy if exists "Ana edita" on public.productos;
create policy "Ana edita" on public.productos for update to authenticated using (true) with check (true);
drop policy if exists "Ana borra" on public.productos;
create policy "Ana borra" on public.productos for delete to authenticated using (true);

drop policy if exists "Todos ven ajustes" on public.ajustes;
create policy "Todos ven ajustes" on public.ajustes for select using (true);
drop policy if exists "Ana edita ajustes" on public.ajustes;
create policy "Ana edita ajustes" on public.ajustes for update to authenticated using (true) with check (true);

-- 4) Carpeta para las fotos (pública para que los clientes las vean)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true;

drop policy if exists "Ana sube fotos" on storage.objects;
create policy "Ana sube fotos" on storage.objects for insert to authenticated with check (bucket_id = 'fotos');
drop policy if exists "Ana cambia fotos" on storage.objects;
create policy "Ana cambia fotos" on storage.objects for update to authenticated using (bucket_id = 'fotos');
drop policy if exists "Ana borra fotos" on storage.objects;
create policy "Ana borra fotos" on storage.objects for delete to authenticated using (bucket_id = 'fotos');

-- 5) El menú de Halloween que ya está en la página (solo si la tabla está vacía)
insert into public.productos (nombre, descripcion, categoria, temporada, opciones, foto_url, ancho, orden)
select * from (values
  ('Cookie Monster', 'Azul, cargada y fuera de control: trozos de galleta, chispas de chocolate y galleta triturada. ¡Una galleta que come galletas!', 'Cookies', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":550}]'::jsonb, 'img/cookie-monster.jpg', false, 10),
  ('Red Web', 'Roja, dulce y atrapada en una telaraña, con un ojito tenebroso que te observa. Lo spooky nunca supo tan rico.', 'Cookies', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":550}]'::jsonb, 'img/red-web.jpg', false, 20),
  ('Boo Cookie', 'Una galleta suavecita embrujada por un fantasmita de malvavisco y su telaraña. Advertencia: es terroríficamente deliciosa.', 'Cookies', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":550}]'::jsonb, 'img/boo-cookie.jpg', false, 30),
  ('Mummy Cookie', 'Una galleta suavecita envuelta en vendas dulces y con dos ojitos curiosos. ¡Esta momia no asusta, enamora!', 'Cookies', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":550}]'::jsonb, 'img/mummy-cookie.jpg', false, 40),
  ('Frankie', 'Verde, dulce y cosida con mucho amor. Este pequeño monstruo está vivo… ¡y listo para que te lo comas!', 'Cookies', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":550}]'::jsonb, 'img/frankie-cookie.jpg', false, 50),
  ('Midnight S''more', 'Galleta con chispas de chocolate, malvaviscos tostados y un cuadrito de chocolate, bañada en drizzle blanco. ¡El antojo de medianoche!', 'Cookies', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":550}]'::jsonb, 'img/midnight-smore.jpg', false, 60),
  ('Mummy Brownie', 'Un brownie bien fudgy envuelto en vendas dulces y cremosas. ¡Desenvuélvelo bajo tu propio riesgo!', 'Brownies', true, '[{"nombre":"Media docena","precio":290},{"nombre":"Docena","precio":580}]'::jsonb, 'img/mummy-brownie.jpg', false, 70),
  ('Mallow Monster Brownie', 'Malvavisco derretido, brownie intenso y demasiados ojos. Tranquilo, solo te miran mientras comes.', 'Brownies', true, '[{"nombre":"Media docena","precio":290},{"nombre":"Docena","precio":580}]'::jsonb, 'img/mallow-monster-brownie.jpg', false, 80),
  ('Three-Eyed Crispy', 'Rice crispy con drizzle naranja, confeti de Halloween y tres ojos que no te pierden de vista. ¡Crujiente y travieso!', 'Rice Crispy', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":600}]'::jsonb, 'img/three-eyed-crispy.jpg', false, 90),
  ('Mummy Crispy', 'Crujiente, suavecito y bien envuelto para Halloween. ¡Momia pequeña, crunch gigante!', 'Rice Crispy', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":600}]'::jsonb, 'img/mummy-crispy.jpg', false, 100),
  ('Zombie Sprinkles', 'Un rice crispy zombie cubierto de chispitas moradas, naranjas y negras. ¡Revive de la tumba con todo el sabor!', 'Rice Crispy', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":600}]'::jsonb, 'img/zombie-crispy.jpg', false, 110),
  ('Frankie Crispy', 'El primo crujiente de Frankie: verde, con pelito de chispitas negras y una sonrisa monstruosa.', 'Rice Crispy', true, '[{"nombre":"Media docena","precio":300},{"nombre":"Docena","precio":600}]'::jsonb, 'img/franki-crispy.jpg', false, 120),
  ('Boxes', 'Una mezcla de galletas, brownies y rice crispy. Para compartir… o para ti solito.', 'Boxes', true, '[{"nombre":"Box Surtida (25 piezas)","precio":1100},{"nombre":"Box de 50 (50 piezas)","precio":2150}]'::jsonb, 'img/boxes-v2.jpg', true, 130)
) as v(nombre, descripcion, categoria, temporada, opciones, foto_url, ancho, orden)
where not exists (select 1 from public.productos);

-- ¡Listo! Debe salir "Success. No rows returned" ✅
