<center>

![Logo de l'application Groupomania](/frontend//src//assets//img/brand/icon-left-font-cropped.png)

</center>

# Contexte

Projet réalisé en 2023 dans le cadre de la formation "Développeur web" d'OpenClassrooms.

# Résumé

**Groupomania** est un réseau social d'entreprise avec forum et chat en temps réel.

Le projet consistait à créer le back-end et le front-end de l'application, en utilisant une **base de données**, un **framework JavaScript** et un **state manager**.

# Technologies utilisées

-   MySQL (sans ORM)
-   JavaScript
-   Node.js
-   Express
-   Bcrypt
-   JWT
-   Multer
-   React
-   React Router 6
-   Redux
-   Redux Toolkit
-   PropTypes
-   Material UI
-   Socket.io

# Fonctionnalités

-   forum avec posts et commentaires
-   possibilité de poster des images (Multer)
-   système de likes
-   chat en temps réel (Socket.io)

# Captures

<center>

![Page forum de Groupomania](/frontend/src/assets/img/captures/groupomania-forum.webp)

</center>

<center>

![Page chat de Groupomania](/frontend/src/assets/img/captures/groupomania-chat.webp)

</center>

# Installation

## Back-end

-   Installer MySQL en suivant [ces instructions](https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql).

-   Dans le répertoire `backend`, créer un fichier `.env` contenant les instructions suivantes, avec les noms d'utilisateur et mot de passe à remplacer par les données relatives à votre installation de MySQL (supprimer les balises `<>`), et la phrase de création du token à remplacer par une phrase de votre choix :

```
PORT=3000
DB_HOST=localhost
DB_NAME=groupomania
DB_USER=<nom d'utilisateur>
DB_PASSWORD=<mot de passe>
TOKEN_CREATION_PHRASE=<choisir une phrase complexe>
CHAT_POSTS_LIMIT=100
```

-   Toujours dans le répertoire `backend`, exécuter la commande :

`npm install`

## Front-end

-   Dans le répertoire `frontend`, exécuter la commande :

`npm install`

# Lancement de l'application

-   Dans le répertoire `backend`, exécuter la commande :

`node server`

-   Dans le répertoire `frontend`, exécuter la commande :

`npm start`
