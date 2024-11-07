# Crypto Trading Dashboard

Ce projet est une application Angular pour visualiser et interagir avec les données de trading de cryptomonnaies. Elle permet de suivre les prix en temps réel, de gérer des alertes et de visualiser des prédictions de marché.

## Prérequis

- Node.js (version 18.x recommandée)
- npm (version 8.x recommandée)
- Angular CLI (version 15.x recommandée)

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/Icare741/crypto-trading-dashboard.git
   cd crypto-trading-dashboard
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

## Configuration

1. Assurez-vous que le fichier `src/environments/environment.ts` contient l'URL correcte de votre API NestJS :

   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000'
   };
   ```

## Démarrage

Pour démarrer l'application en mode développement :

```bash
ng serve
```

L'application sera accessible à l'adresse `http://localhost:4200`.

## Fonctionnalités

- **Tableau de bord en temps réel** : Suivi des prix des cryptomonnaies avec des graphiques interactifs.
- **Gestion des alertes** : Créez et gérez des alertes de prix personnalisées.
- **Prédictions de marché** : Visualisez les tendances prévues et recevez des suggestions de trading.

## Contribution

Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour discuter des changements que vous souhaitez apporter.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
