# Installation

- Install [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). 

- Install all dependencies by running this command in both /frontend and /backend directories :
```terminal
npm install
```
- Install MySql by following these steps : [https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql](https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql)


# Launching the app

- From the /backend directory, run :
```terminal
node server
```

- From the /frontend directory, run :
```terminal
npm start
```

# Settings

## Back-end URI

The back-end URI can be set up by changing the BACKEND_URI value in the frontend/.env file :
```
BACKEND_URI=http://localhost:4000
```