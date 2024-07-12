# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que correrá la aplicación
EXPOSE 310

# Define la variable de entorno para producción
ENV NODE_ENV=production

# Comando para correr la aplicación
CMD ["node", "dist/index.js"]
