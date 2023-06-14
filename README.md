<center>

![Logo de l'application Groupomania](/src//assets//img/brand/icon-left-font-cropped.png)

</center>

# Contexte

Projet réalisé en 2023 dans le cadre de la formation "Développeur web" d'OpenClassrooms.

# Résumé

**Groupomania** est un réseau social d'entreprise avec forum et chat en temps réel.

Le projet consistait à créer le back-end et le front-end de l'application, en utilisant une **base de données**, un **framework JavaScript** et un **state manager**.

# Dépôts

Ce dépôt contient uniquement le **front-end** de l'application.

Le back-end : [https://github.com/TomDvpmt/groupomania-backend](https://github.com/TomDvpmt/groupomania-backend)

# Technologies utilisées

-   ReactJS
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

![Page forum de Groupomania](/src/assets/img/captures/groupomania-forum.webp)

</center>

<center>

![Page chat de Groupomania](/src/assets/img/captures/groupomania-chat.webp)

</center>

# Installation

-   Dans le répertoire racine, exécuter la commande :

`npm install`

# Lancement de l'application

-   Dans le répertoire racine, exécuter la commande :

`npm start`

# Configuration

Pour changer le nombre maximum de messages affichés dans le chat :

-   dans le fichier `/src/services/features/chat.js`, changer la valeur de `initialState.limit`
