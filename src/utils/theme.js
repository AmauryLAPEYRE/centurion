// Couleurs et thème de l'application
export const theme = {
    primary: '#4361ee',
    secondary: '#3a0ca3',
    tertiary: '#7209b7',
    success: '#4cc9f0',
    danger: '#f72585',
    warning: '#f8961e',
    info: '#90e0ef',
    gray: '#d9d9d9',
    darkGray: '#6c757d',
    light: '#f8f9fa',
    dark: '#212529',
    background: '#f8f9fa',
    cardBackground: '#ffffff',
    text: '#212529',
    // Nouvelles dégradations pour les graphiques
    chart: {
      blue: ['#4361ee', '#3f37c9', '#3a0ca3', '#480ca8', '#560bad'],
      red: ['#f72585', '#b5179e', '#7209b7', '#560bad', '#480ca8'],
      green: ['#80ed99', '#57cc99', '#38a3a5', '#22577a', '#1a3a63'],
      orange: ['#ffb703', '#fd9e02', '#fb8500', '#f48c06', '#e85d04'],
      purple: ['#7209b7', '#6a00f4', '#5e00d9', '#5100b8', '#3a0ca3'],
    },
    // Ajout d'ombres standardisées
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    },
    // Transitions standardisées
    transitions: {
      default: 'all 0.2s ease-in-out',
      slow: 'all 0.3s ease-in-out',
      fast: 'all 0.1s ease-in-out',
    },
    // Arrondis standardisés
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      round: '50%',
    },
  };
  
  // Fonction pour générer des couleurs pour les stocks dynamiquement
  export const getStockColor = (index) => {
    const colors = [
      '#4361ee', '#f72585', '#4cc9f0', '#f8961e', '#90be6d',
      '#43aa8b', '#577590', '#14213d', '#ef476f', '#ffd166'
    ];
    
    return colors[index % colors.length];
  };
  
  // Fonction pour assigner une icône à chaque action
  export const getStockIcon = (symbol) => {
    // On peut utiliser le symbole pour déterminer l'industrie/secteur et assigner une icône appropriée
    const technologySymbols = ['AAPL', 'MSFT', 'GOOGL', 'META', 'AMZN', 'NVDA', 'INTC', 'AMD', 'CSCO', 'ADBE', 'CRM'];
    const financeSymbols = ['JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'AXP', 'V', 'MA', 'PYPL', 'SQ'];
    const healthSymbols = ['JNJ', 'PFE', 'MRK', 'ABBV', 'LLY', 'AMGN', 'UNH', 'CVS', 'MDT'];
    const energySymbols = ['XOM', 'CVX', 'COP', 'EOG', 'SLB', 'OXY', 'BP', 'SHEL'];
    const consumerSymbols = ['KO', 'PEP', 'PG', 'WMT', 'TGT', 'COST', 'MCD', 'SBUX', 'NKE'];
    const telecomSymbols = ['T', 'VZ', 'TMUS', 'CMCSA'];
    const automobileSymbols = ['TSLA', 'F', 'GM', 'TM', 'HMC', 'STLA'];
  
    if (technologySymbols.includes(symbol)) return 'tech';
    if (financeSymbols.includes(symbol)) return 'finance';
    if (healthSymbols.includes(symbol)) return 'health';
    if (energySymbols.includes(symbol)) return 'energy';
    if (consumerSymbols.includes(symbol)) return 'consumer';
    if (telecomSymbols.includes(symbol)) return 'telecom';
    if (automobileSymbols.includes(symbol)) return 'auto';
    
    // Par défaut
    return 'default';
  };