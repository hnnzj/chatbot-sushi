### Instalación

1. Clona el repositorio: `git clone <URL>`
2. Instala dependencias:
   -2.1- Instalar depedencias en servidor:
   `cd .\server\`^
   `npm i`
   -2.2- Instalar depedencias en servidor:
   `cd .\app\`^
   `npm i`
3. Crea un archivo `.env` basado en `.env.example` en el servidor.
4. Correr entornos de prueba:
   -4.1- Correr servidor: `node --watch index.js`
   -4.2- Correr app: `npm run dev`

Ejemplos de mensajes:

- "Ver menu"
- "Ver pedidos"
- "Quiero comprar/pedir/ordenar"
- "Horarios de atención"

### Endpoints

- `GET /api/product` - Mostrar todos los productos del menu
- `POST /api/product` - Cargar productos. Estructura: [{"name": "nombre producto","price":"precio producto,"category":"categoria producto"}]
- `GET /api/register` - Crear usuario.
- `GET /api/login` - Ingresar con un usuario.
- `GET /api/verifyToken` - Verificar caducidad del token.
- `GET /api/orders` - Ver todos las ordenes.

### Datos de ejemplo:

Los datos de ejemplo estan dentro del archivo datos.json
