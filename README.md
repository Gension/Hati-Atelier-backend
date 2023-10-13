# Editions Machettes API

L'API des Editions Machettes permet de gérer une bibliothèque de livres avec une sécurité renforcée et des utilisateurs ayant différents rôles.

## Installation

Installez les dépendances :
```bash
npm install
```

## Configuration

Pour configurer l'API, vous devez créer un fichier `.env` à la racine du projet. Ce fichier doit contenir les variables d'environnement suivantes :
```bash
PORT=3000
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
JWT_EXPIRY=1d
```

## Execution : 
```bash
npm start
```

Votre API devrait maintenant être en cours d'exécution sur `http://localhost:3000`.

## Documentation des Endpoints

### Utilisateurs

- **Enregistrer un nouvel utilisateur** :
  - Endpoint : `POST /auth/register`
  - Corps de la requête : 
    ```json
    {
      "username": "votre_nom_d'utilisateur",
      "password": "votre_mot_de_passe",
    }
    ```

- **Connecter un utilisateur** :
  - Endpoint : `POST /auth/login`
  - Corps de la requête :
    ```json
    {
      "username": "votre_nom_d'utilisateur",
      "password": "votre_mot_de_passe"
    }
    ```

### Livres

- **Ajouter un nouveau livre (admin seulement)** :
  - Endpoint : `POST /books`
  - Corps de la requête :
    ```json
    {
      "title": "titre_du_livre",
      "author": "auteur",
      "pages": 123,
      "genre": "genre",
      "published": true/false,
      "userId": "id_de_l'utilisateur"
    }
    ```

- **Récupérer tous les livres (utilisateurs authentifiés)** :
  - Endpoint : `GET /books`

- **Récupérer un livre spécifique (utilisateurs authentifiés)** :
  - Endpoint : `GET /books/:id`

- **Supprimer un livre (admin seulement)** :
  - Endpoint : `DELETE /books/:id`

## Bonus

Un front-end simple est également disponible pour exploiter l'API. Veuillez consulter la documentation associée pour plus d'informations.
