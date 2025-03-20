Description
Centurion est un simulateur d'investissement par Dollar-Cost Averaging (DCA) qui vous permet de visualiser comment vos investissements réguliers sur les marchés financiers auraient performé dans le temps. Découvrez l'impact des investissements mensuels sur différentes actions depuis une date spécifique jusqu'à aujourd'hui.
Fonctionnalités

🔍 Recherchez n'importe quelle action cotée en bourse
📊 Visualisez la performance d'un investissement régulier mensuel (DCA)
📅 Choisissez une date de début personnalisée pour chaque investissement
💰 Définissez votre montant d'investissement mensuel
📈 Analysez les résultats avec des graphiques et tableaux détaillés
💼 Ajoutez plusieurs actions pour comparer différentes stratégies

Technologies utilisées

React.js
styled-components pour les styles
recharts pour les visualisations de données
date-fns pour la manipulation des dates
axios pour les requêtes API
Financial Modeling Prep API pour les données financières

Installation

Clonez le dépôt :

bashCopiergit clone https://github.com/votre-utilisateur/centurion.git
cd centurion

Installez les dépendances :

bashCopiernpm install

Créez un fichier .env à la racine du projet et ajoutez votre clé API :

CopierREACT_APP_FMP_API_KEY=votre_clé_api

Lancez l'application en mode développement :

bashCopiernpm start
L'application sera disponible à l'adresse http://localhost:3000.
Configuration de l'API
Centurion utilise l'API Financial Modeling Prep pour obtenir les données historiques des actions. Pour utiliser l'application, vous devez :

Créer un compte sur Financial Modeling Prep
Obtenir une clé API gratuite (permet 250 requêtes par jour)
Configurer la clé dans le fichier .env comme indiqué ci-dessus
Alternative : modifiez directement la constante API_KEY dans src/services/apiService.js

Guide d'utilisation

Recherchez une action : Utilisez la barre de recherche pour trouver une action par son nom ou son symbole (ex : Apple, AAPL)
Sélectionnez une date de début : Choisissez quand vous auriez commencé à investir
Définissez votre investissement mensuel : Indiquez combien vous auriez investi chaque mois (par défaut 100€)
Ajoutez d'autres actions (optionnel) : Répétez les étapes 1-3 pour ajouter d'autres actions à comparer
Calculez la performance : Cliquez sur le bouton pour lancer le calcul et visualiser les résultats
Analysez les résultats : Explorez les graphiques et tableaux détaillant votre performance sur la période

Structure du projet
Copiercenturion/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Onboarding.js
│   │   ├── PerformanceChart.js
│   │   ├── PerformanceDetails.js
│   │   ├── PerformanceSummary.js
│   │   ├── PerformanceTable.js
│   │   ├── StockForm.js
│   │   ├── StockIcon.js
│   │   ├── StockSearch.js
│   │   └── StyledComponents.js
│   ├── services/
│   │   └── apiService.js
│   ├── utils/
│   │   ├── calculationUtils.js
│   │   └── theme.js
│   ├── App.js
│   └── index.js
└── package.json
Captures d'écran

Interface principale : Une interface intuitive avec guides utilisateur
Recherche d'actions : Résultats de recherche avec indication des cotations principales
Visualisation de performance : Graphiques et tableaux détaillés
Analyse comparative : Comparaison de différentes actions

Limitations

L'API gratuite de Financial Modeling Prep est limitée à 250 requêtes par jour
Les calculs ne prennent pas en compte les taxes, commissions et dividendes réinvestis
Les données historiques peuvent légèrement différer selon les sources

Développement
Pour contribuer au projet :

Créez une branche pour votre fonctionnalité (git checkout -b feature/amazing-feature)
Committez vos changements (git commit -m 'Add some amazing feature')
Poussez la branche (git push origin feature/amazing-feature)
Ouvrez une Pull Request