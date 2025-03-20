import axios from 'axios';

// Clé API et URL de base
const API_KEY = 'MPEW7hGM8nvkoQuECqeswW80Wu34sCt9';
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Constantes pour le stockage local
const CACHE_PREFIX = 'centurion_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
const POPULAR_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM'];

// Configuration du client axios avec intercepteurs
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY
  }
});

// Intercepteur pour la gestion des erreurs
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    // Tenter de récupérer les données du cache en cas d'échec
    if (error.config && error.config.url) {
      const cachedData = getCachedData(error.config.url);
      if (cachedData) {
        console.log('Récupération des données du cache après erreur API');
        return Promise.resolve({ data: cachedData, fromCache: true });
      }
    }
    
    return Promise.reject(error);
  }
);

// Fonctions de gestion du cache
const cacheKey = (url, params) => {
  const queryString = params ? JSON.stringify(params) : '';
  return `${CACHE_PREFIX}${url}_${queryString}`;
};

const setCachedData = (key, data) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + CACHE_EXPIRY
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('Erreur lors de la mise en cache:', error);
    // En cas d'erreur (localStorage plein), on peut nettoyer les entrées les plus anciennes
    clearOldCache();
  }
};

const getCachedData = (url, params) => {
  const key = cacheKey(url, params);
  try {
    const cacheEntry = localStorage.getItem(key);
    if (cacheEntry) {
      const { data, expiry } = JSON.parse(cacheEntry);
      if (Date.now() < expiry) {
        return data;
      } else {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.warn('Erreur lors de la récupération du cache:', error);
  }
  return null;
};

const clearOldCache = () => {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(CACHE_PREFIX)) {
        keys.push(key);
      }
    }
    
    // Trier par ancienneté
    const sortedKeys = keys.sort((a, b) => {
      const itemA = JSON.parse(localStorage.getItem(a));
      const itemB = JSON.parse(localStorage.getItem(b));
      return itemA.timestamp - itemB.timestamp;
    });
    
    // Supprimer les 30% les plus anciens
    const toRemove = Math.ceil(sortedKeys.length * 0.3);
    sortedKeys.slice(0, toRemove).forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Erreur lors du nettoyage du cache:', error);
  }
};

// Préchargement des données populaires
export const preloadPopularStocks = async () => {
  console.log('Préchargement des actions populaires...');
  try {
    // Préchargement des données de cours
    await Promise.all(POPULAR_SYMBOLS.map(symbol => {
      return getMonthlyStockData(symbol, true);
    }));
    
    // Préchargement des détails
    await getPopularStocks(true);
    
    console.log('Préchargement terminé');
  } catch (error) {
    console.warn('Erreur lors du préchargement:', error);
  }
};

// Fonction d'API avec gestion de cache
const fetchWithCache = async (url, params = {}, forceRefresh = false) => {
  const key = cacheKey(url, params);
  
  // Vérifier le cache si on ne force pas le rafraîchissement
  if (!forceRefresh) {
    const cachedData = getCachedData(url, params);
    if (cachedData) {
      console.log(`Utilisation des données en cache pour ${url}`);
      return { data: cachedData, fromCache: true };
    }
  }
  
  try {
    console.log(`Récupération des données depuis l'API pour ${url}`);
    const response = await apiClient.get(url, { params });
    
    // Mise en cache des données
    setCachedData(key, response.data);
    
    return response;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${url}:`, error);
    throw error;
  }
};

// Recherche de symboles d'actions
export const searchSymbols = async (keywords) => {
  try {
    const response = await fetchWithCache('search', {
      query: keywords,
      limit: 20
    });
    
    if (response.data) {
      // Filtrer et organiser les résultats
      const results = response.data;
      
      // Créer un groupe par nom d'entreprise
      const groupedByName = {};
      
      results.forEach(match => {
        if (!groupedByName[match.name]) {
          groupedByName[match.name] = [];
        }
        groupedByName[match.name].push(match);
      });
      
      // Pour chaque groupe, déterminer l'action principale
      const mainStocks = [];
      
      Object.values(groupedByName).forEach(group => {
        // Prioriser les actions américaines (NASDAQ, NYSE, etc.)
        const usStock = group.find(stock => 
          stock.exchangeShortName === 'NASDAQ' || 
          stock.exchangeShortName === 'NYSE' ||
          stock.exchange === 'NASDAQ' || 
          stock.exchange === 'NYSE'
        );
        
        // Filtrer pour exclure les ETF et autres produits dérivés
        const nonDerivative = group.find(stock => 
          !stock.symbol.includes('.') && 
          !stock.symbol.endsWith('F') && 
          !stock.symbol.includes('-') &&
          stock.symbol.length <= 5
        );
        
        // Ajouter prioritairement l'action US, sinon la non-dérivée, sinon la première du groupe
        if (usStock) {
          mainStocks.push(usStock);
        } else if (nonDerivative) {
          mainStocks.push(nonDerivative);
        } else if (group.length > 0) {
          mainStocks.push(group[0]);
        }
      });
      
      // Transformer au format attendu
      return mainStocks.map(match => ({
        symbol: match.symbol,
        name: match.name,
        type: match.exchangeShortName || match.exchange || 'Action',
        region: match.exchange || 'US',
        isMainListing: true
      }));
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche de symboles:', error);
    throw error;
  }
};

// Récupération des données mensuelles d'une action
export const getMonthlyStockData = async (symbol, forceRefresh = false) => {
  try {
    // On récupère les données historiques complètes
    const response = await fetchWithCache(`historical-price-full/${symbol}`, {
      from: '2000-01-01'
    }, forceRefresh);
    
    if (response.data && response.data.historical) {
      // Convertir les données en format mensuel
      const monthlyData = [];
      const allData = response.data.historical.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      
      let currentMonth = '';
      
      allData.forEach(item => {
        const date = new Date(item.date);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (month !== currentMonth) {
          currentMonth = month;
          monthlyData.push({
            date: item.date,
            price: item.close,
            adjustedPrice: item.adjClose || item.close,
            volume: item.volume,
            dividend: 0
          });
        }
      });
      
      // Récupération des dividendes (si nécessaire)
      try {
        const dividendResponse = await fetchWithCache(`historical-price-full/stock_dividend/${symbol}`, {}, forceRefresh);
        
        if (dividendResponse.data && dividendResponse.data.historical) {
          dividendResponse.data.historical.forEach(div => {
            const divDate = new Date(div.date);
            // Trouver le mois correspondant et ajouter le dividende
            monthlyData.forEach(monthData => {
              const monthDate = new Date(monthData.date);
              if (monthDate.getFullYear() === divDate.getFullYear() && 
                  monthDate.getMonth() === divDate.getMonth()) {
                monthData.dividend = div.dividend;
              }
            });
          });
        }
      } catch (err) {
        console.warn('Impossible de récupérer les dividendes, utilisation sans dividendes');
      }
      
      // Ajouter des annotations pour les événements majeurs
      addMarketEvents(monthlyData);
      
      return monthlyData;
    }
    return [];
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${symbol}:`, error);
    throw error;
  }
};

// Fonction pour ajouter des annotations d'événements majeurs
const addMarketEvents = (dataArray) => {
  const events = [
    { date: '2008-09-15', event: 'Faillite de Lehman Brothers', severity: 'major' },
    { date: '2010-05-06', event: 'Flash Crash', severity: 'medium' },
    { date: '2011-08-05', event: 'Dégradation de la note de crédit US', severity: 'medium' },
    { date: '2015-08-24', event: 'Lundi noir chinois', severity: 'medium' },
    { date: '2016-06-24', event: 'Brexit', severity: 'medium' },
    { date: '2018-12-24', event: 'Chute du marché', severity: 'medium' },
    { date: '2020-03-16', event: 'Krach lié au COVID-19', severity: 'major' },
    { date: '2022-01-24', event: 'Correction du marché', severity: 'medium' }
  ];

  // Ajouter des annotations pour les événements significatifs
  dataArray.forEach(dataPoint => {
    const matchingEvent = events.find(event => {
      const eventDate = new Date(event.date);
      const dataDate = new Date(dataPoint.date);
      
      // Vérifier si les dates correspondent au mois près
      return eventDate.getFullYear() === dataDate.getFullYear() &&
             eventDate.getMonth() === dataDate.getMonth();
    });
    
    if (matchingEvent) {
      dataPoint.event = matchingEvent.event;
      dataPoint.eventSeverity = matchingEvent.severity;
    }
  });
};

// Liste des actions populaires
export const getPopularStocks = async (forceRefresh = false) => {
  try {
    // Récupérer chaque symbole individuellement
    const results = [];
    
    const promises = POPULAR_SYMBOLS.map(symbol => {
      return fetchWithCache(`quote/${symbol}`, {}, forceRefresh)
        .then(response => {
          if (response.data && response.data[0]) {
            const data = response.data[0];
            results.push({
              symbol: data.symbol,
              price: data.price,
              change: data.change,
              changePercent: `${data.changesPercentage}%`
            });
          }
        })
        .catch(err => {
          console.error(`Erreur pour ${symbol}:`, err);
        });
    });
    
    await Promise.all(promises);
    
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des actions populaires:', error);
    throw error;
  }
};

// Déclencher le préchargement au chargement du service
setTimeout(() => {
  preloadPopularStocks();
}, 1000); // Délai de 1 seconde pour ne pas bloquer le chargement initial

export default {
  searchSymbols,
  getMonthlyStockData,
  getPopularStocks,
  preloadPopularStocks
};