# RespondBCN

App de generación de respuestas para reservas y solicitudes de reseñas.

## Cómo publicarla en Vercel (gratis)

1. Sube todos estos archivos a un repositorio de GitHub.
2. Ve a vercel.com y crea una cuenta gratuita con tu cuenta de GitHub.
3. Haz clic en "Add New Project" y selecciona tu repositorio.
4. Antes de pulsar "Deploy", ve a "Environment Variables" y añade:
   - Key: ANTHROPIC_API_KEY
   - Value: tu clave de API de Anthropic (la consigues en console.anthropic.com)
5. Pulsa "Deploy".
6. En unos 60 segundos tendrás tu URL pública (algo como respondbcn-app.vercel.app).

## Cómo conectar tu dominio propio (respondbcn.com)

1. Dentro del proyecto en Vercel, ve a "Settings" → "Domains".
2. Añade tu dominio o subdominio (ej: app.respondbcn.com).
3. Vercel te dará un registro DNS para añadir en Porkbun.
4. Ve a Porkbun → tu dominio → DNS → añade el registro que indique Vercel.
5. Espera 5-30 minutos a que se propague.
