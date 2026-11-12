# Bocatta: conectar el panel de Ana

Mientras `config.js` esté vacío, el menú usa `menu.js` y el panel funciona en **modo prueba** (no guarda).
Para que Ana pueda cambiar el menú de verdad hay que crear un proyecto **nuevo** en Supabase (no el de Regalártelo:
ahí cualquier usuario con sesión puede editar todo, y se mezclarían las dos tiendas).

## 1. Crear el proyecto
https://supabase.com/dashboard/new
- Name: `bocatta` · Region: **East US (North Virginia)** · Password: *Generate a password* (guárdala).
- El plan gratis permite 2 proyectos activos.

## 2. Preparar la base de datos
SQL Editor → New query → pega **todo** `supabase-setup.sql` → **Run**.
Crea las tablas, la seguridad, la carpeta de fotos y carga el menú de Halloween que ya está en la página.

## 3. Cerrar el registro
Authentication → Sign In / Providers: apaga **Allow new users to sign up** (y que *anonymous sign-ins* esté apagado).

## 4. Crear el usuario de Ana
Authentication → Users → **Add user → Create new user** → su correo y una contraseña → **Auto Confirm User** → Create.

## 5. Copiar las llaves a `config.js`
Project Settings → API: copia el **Project URL** y la **Publishable key** (o *anon key*).
```js
URL: "https://xxxx.supabase.co",
KEY: "sb_publishable_xxxx",
```
Nunca pongas la *secret / service_role*.

## Links
| Para quién | Link |
|---|---|
| Clientes | https://bocattahn.github.io |
| Ana (panel) | https://bocattahn.github.io/Bocata/admin.html |

En su cel: abrir el panel → menú del navegador → **Agregar a pantalla de inicio**.

## Cómo lo usa Ana
- **➕ Agregar producto**: foto, nombre, categoría, tamaños con precio (ej. Media docena / Docena), y si es de temporada.
- **✏️** editar · **🗑️** borrar · **⬆️⬇️** cambiar el orden.
- Se agotó: editar → apagar **¿Está disponible?** (sale "Agotado" y no se puede pedir).
- **Nombre de la temporada**: cambia el título (Halloween 🎃 → Navidad 🎄).

Supabase gratis se pausa tras ~1 semana sin visitas: entrar al dashboard y tocar **Restore project**.
