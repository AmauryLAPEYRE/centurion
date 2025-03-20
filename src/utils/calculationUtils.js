import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Fonction pour calculer la performance de l'investissement DCA
export const calculateDCAPerformance = (historicalData, monthlyInvestment, startDate) => {
  let totalInvested = 0;
  let totalShares = 0;
  
  // Filtrer les données en fonction de la date de début
  const filteredData = historicalData
    .filter(dataPoint => new Date(dataPoint.date) >= new Date(startDate))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return filteredData.map(dataPoint => {
    const price = dataPoint.adjustedPrice || dataPoint.price;
    const sharesThisMonth = monthlyInvestment / price;
    
    totalInvested += monthlyInvestment;
    totalShares += sharesThisMonth;
    const portfolioValue = totalShares * price;
    
    return {
      ...dataPoint,
      price,
      shares: sharesThisMonth,
      totalShares,
      invested: monthlyInvestment,
      totalInvested,
      portfolioValue,
      roi: ((portfolioValue - totalInvested) / totalInvested) * 100,
    };
  });
};

// Formatteur pour les montants
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formatteur pour les pourcentages
export const formatPercent = (percent) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent / 100);
};

// Formatteur pour les dates
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMMM yyyy', { locale: fr });
};

// Formatteur pour les nombres de parts
export const formatShares = (shares) => {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2,
  }).format(shares);
};