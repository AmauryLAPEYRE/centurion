import axios from 'axios';

const API_KEY = 'MPEW7hGM8nvkoQuECqeswW80Wu34sCt9'; // Remplacez par votre clé API Financial Modeling Prep
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Recherche de symboles d'actions
export const searchSymbols = async (keywords) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        query: keywords,
        limit: 20, // Augmenter la limite pour avoir plus de résultats à filtrer
        apikey: API_KEY
      }
    });
    
    if (response.data) {
      // Filtrer et organiser les résultats pour privilégier les actions principales
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
        isMainListing: true // Indique que c'est la cotation principale
      }));
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche de symboles:', error);
    throw error;
  }
};

// Récupération des données mensuelles d'une action
export const getMonthlyStockData = async (symbol) => {
  try {
    // On récupère les données historiques complètes
    const response = await axios.get(`${BASE_URL}/historical-price-full/${symbol}`, {
      params: {
        apikey: API_KEY,
        from: '2000-01-01' // Assez loin pour avoir un historique complet
      }
    });
    
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
            dividend: 0 // Nous le calculons séparément
          });
        }
      });
      
      // Récupération des dividendes (si nécessaire)
      try {
        const dividendResponse = await axios.get(`${BASE_URL}/historical-price-full/stock_dividend/${symbol}`, {
          params: { apikey: API_KEY }
        });
        
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
      
      return monthlyData;
    }
    return [];
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${symbol}:`, error);
    throw error;
  }
};

// Liste des actions populaires
export const getPopularStocks = async () => {
  const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM'];
  
  try {
    // Option 1: Récupérer chaque symbole individuellement
    const results = [];
    
    for (const symbol of popularSymbols) {
      try {
        const response = await axios.get(`${BASE_URL}/quote/${symbol}`, {
          params: { apikey: API_KEY }
        });
        
        if (response.data && response.data[0]) {
          const data = response.data[0];
          results.push({
            symbol: data.symbol,
            price: data.price,
            change: data.change,
            changePercent: `${data.changesPercentage}%`
          });
        }
      } catch (err) {
        console.error(`Erreur pour ${symbol}:`, err);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des actions populaires:', error);
    throw error;
  }
};