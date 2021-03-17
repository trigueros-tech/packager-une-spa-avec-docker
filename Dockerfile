# Image de "compilation" de l'application SPA.
# Tout ce qui se passe ici ne fera pas partie de l'image finale
FROM node:14.16.0 as build
WORKDIR /app
COPY app /app
RUN yarn install --frozen-lockfile && yarn run build
# Les fichiers produits sont dans le dossier /app/build de l'étape "build"


# Image d'exploitation de l'image SPA
FROM node:14.16.0-alpine3.13

EXPOSE 4000
ENV APP_MESSAGE="Message de l'image docker"

# Une bonne pratique des images docker consiste à lancer les images avec des utilisateurs aux droits limités
USER node
WORKDIR /home/node/app
COPY server /home/node/app
RUN npm ci

COPY --from=build --chown=node:node /app/build /home/node/app/static_files
RUN ls -la /home/node/app/static_files

ENTRYPOINT ["node", "index.js"]
