FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# NEXT_PUBLIC_API_URL must be provided by Render
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
