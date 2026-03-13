# 🛒 Backend - Tienda de Productos

API REST construida con **Node.js + Express + TypeScript + PostgreSQL + Sequelize**.

---

## 🧰 Stack

| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor HTTP |
| TypeScript | Tipado estático |
| PostgreSQL | Base de datos relacional |
| Sequelize | ORM |
| JWT | Autenticación |
| Multer | Subida de imágenes |
| Docker | Contenedores |

---

## 📁 Estructura del proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Conexión a PostgreSQL
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── user.controller.ts
│   │   ├── brand.controller.ts
│   │   └── category.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # verifyToken, isAdmin
│   │   └── upload.middleware.ts # Multer
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Brand.ts
│   │   └── Category.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── user.routes.ts
│   │   ├── brand.routes.ts
│   │   └── category.routes.ts
│   └── app.ts
├── uploads/
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## ⚙️ Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=productos_db
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto_seguro
JWT_EXPIRES_IN=24h
```

### 3. Crear base de datos

```sql
CREATE DATABASE productos_db;
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Sequelize crea y sincroniza las tablas automáticamente al iniciar (`sync({ alter: true })`).

---

## 🗄️ Modelo de base de datos

```
users
├── id, email, password, role (admin|cliente), createdAt, updatedAt

brands
├── id, name, createdAt, updatedAt

categories
├── id, name, createdAt, updatedAt

products
├── id, name, description, price, stock
├── image_url, size, color
├── brand_id (FK → brands)
├── category_id (FK → categories)
├── createdAt, updatedAt
```

### Insertar datos iniciales

```sql
-- Marcas
INSERT INTO brands (name, "createdAt", "updatedAt") VALUES
  ('Nike',         NOW(), NOW()),
  ('Adidas',       NOW(), NOW()),
  ('Puma',         NOW(), NOW()),
  ('Reebok',       NOW(), NOW()),
  ('New Balance',  NOW(), NOW());

-- Categorías
INSERT INTO categories (name, "createdAt", "updatedAt") VALUES
  ('Zapatilla', NOW(), NOW()),
  ('Short',     NOW(), NOW()),
  ('Camisa',    NOW(), NOW()),
  ('Pantalón',  NOW(), NOW()),
  ('Polo',      NOW(), NOW());
```

---

## 🔐 Autenticación

JWT Bearer Token. Incluir en el header de las rutas protegidas:

```
Authorization: Bearer <token>
```

### Crear usuario admin inicial

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456","role":"admin"}'
```

---

## 📡 Endpoints

### Auth

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registrar usuario |
| POST | `/api/auth/login` | Público | Login → retorna JWT |

### Productos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/products` | Público | Listar con paginación y filtros |
| GET | `/api/products/:id` | Público | Obtener producto por ID |
| POST | `/api/products` | Admin | Crear producto (multipart/form-data) |
| PUT | `/api/products/:id` | Admin | Actualizar producto |
| DELETE | `/api/products/:id` | Admin | Eliminar producto |

#### Query params en GET `/api/products`

| Param | Tipo | Descripción |
|---|---|---|
| `page` | number | Página (default: 1) |
| `limit` | number | Items por página (default: 10) |
| `search` | string | Buscar por nombre |
| `brand_id` | number | Filtrar por marca |
| `category_id` | number | Filtrar por categoría |
| `stock_max` | number | Stock crítico (≤ N unidades) |

**Ejemplo:**
```
GET /api/products?page=1&limit=9&brand_id=1&category_id=2&stock_max=5
```

### Marcas

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/brands` | Público | Listar marcas |
| POST | `/api/brands` | Admin | Crear marca |
| DELETE | `/api/brands/:id` | Admin | Eliminar marca |

### Categorías

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/categories` | Público | Listar categorías |
| POST | `/api/categories` | Admin | Crear categoría |
| DELETE | `/api/categories/:id` | Admin | Eliminar categoría |

### Usuarios

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/users` | Admin | Listar usuarios |
| DELETE | `/api/users/:id` | Admin | Eliminar usuario |

---

## 🐳 Docker

```bash
# Desde la raíz del proyecto
docker-compose up --build
```

Las imágenes subidas persisten en el volumen `uploads_data`.

---

## 📦 Scripts

```bash
npm run dev      # Desarrollo con ts-node-dev
npm run build    # Compilar TypeScript
npm start        # Ejecutar build compilado
```
