import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  AppContainer,
  Header,
  Title,
  Subtitle,
  LoadingSpinner,
  Card
} from './components/StyledComponents';
import StockSearch from './components/StockSearch';
import StockForm from './components/StockForm';
import PerformanceSummary from './components/PerformanceSummary';
import PerformanceChart from './components/PerformanceChart';
import PerformanceDetails from './components/PerformanceDetails';
import Onboarding from './components/Onboarding';
import TabNavigation from './components/TabNavigation';
import { getMonthlyStockData, preloadPopularStocks } from './services/apiService';
import { calculateDCAPerformance } from './utils/calculationUtils';
import { FaDollarSign, FaChartBar } from 'react-icons/fa';
import styled from 'styled-components';
import { theme } from './utils/theme';
import Tooltip from './components/Tooltip';

// Lazy loading des composants moins prioritaires
const Education = lazy(() => import('./components/Education'));
const ComparisonComponent = lazy(() => import('./components/Comparison'));
const Help = lazy(() => import('./components/Help'));

// Composants de style
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
`;

const LoadingText = styled.p`
  margin-top: 15px;
  font-size: 1.1rem;
  color: #6c757d;
`;

const LoadingProgress = styled.div`
  width: 300px;
  height: 5px;
  background-color: ${theme.gray};
  border-radius: 10px;
  margin-top: 15px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: ${theme.primary};
    transition: width 0.3s ease;
  }
`;

const LoadingInfo = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  color: ${theme.darkGray};
`;

const HeaderActions = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
`;

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const TipCard = styled.div`
  background: linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%);
  color: white;
  padding: 15px;
  border-radius: ${theme.radius.md};
  margin-bottom: 20px;
`;

// Grille horizontale pour les paramètres avec hauteurs égales
const TopRow = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const TopRowCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  & > * {
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  /* Pour s'assurer que le contenu des cartes occupe toute la hauteur */
  .card-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  /* Pour le composant StockForm, position du bouton en bas */
  .stock-form-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  
  /* S'assurer que la liste d'actions populaires prend toute la hauteur disponible */
  .actions-populaires {
    flex-grow: 1;
    overflow-y: auto;
    max-height: 350px;
  }
`;

const FullWidthRow = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

// Astuces à afficher
const TIPS = [
  {
    title: "Qu'est-ce que le DCA ?",
    content: "Le Dollar-Cost Averaging est une stratégie d'investissement qui consiste à investir régulièrement des sommes fixes, indépendamment des fluctuations du marché."
  },
  {
    title: "Optimisez votre simulation",
    content: "Essayez de comparer plusieurs actions sur une même période pour voir laquelle performe le mieux sur le long terme."
  },
  {
    title: "Saviez-vous ?",
    content: "Le DCA réduit l'impact de la volatilité et permet d'accumuler plus de parts lorsque les prix sont bas."
  }
];

function App() {
  const [stockInfo, setStockInfo] = useState(null);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [stocksData, setStocksData] = useState({});
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('simulator');
  const [currentTip, setCurrentTip] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Précharger les données populaires au démarrage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await preloadPopularStocks();
        setDataLoaded(true);
      } catch (error) {
        console.error('Erreur lors du préchargement des données', error);
        setDataLoaded(true);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Changer d'astuce périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSelectStock = (stock) => {
    setStockInfo(stock);
    setCurrentStep(2);
  };
  
  const handleAddStock = (stock) => {
    if (selectedStocks.some(s => s.symbol === stock.symbol)) {
      alert(`L'action ${stock.symbol} est déjà dans votre liste.`);
      return;
    }
    
    setSelectedStocks([...selectedStocks, stock]);
    setStockInfo(null);
    setCurrentStep(3);
  };
  
  const handleRemoveStock = (index) => {
    const newStocks = [...selectedStocks];
    newStocks.splice(index, 1);
    setSelectedStocks(newStocks);
    
    if (performanceData.length > 0) {
      const newPerformance = [...performanceData];
      newPerformance.splice(index, 1);
      setPerformanceData(newPerformance);
    }
  };
  
  const fetchStockData = async (symbol, progressIndex, totalStocks) => {
    try {
      if (stocksData[symbol]) {
        updateLoadingProgress(progressIndex, totalStocks, `Données en cache pour ${symbol}`);
        return stocksData[symbol];
      }
      
      setLoadingMessage(`Récupération des données pour ${symbol}...`);
      const data = await getMonthlyStockData(symbol);
      
      setStocksData(prevState => ({
        ...prevState,
        [symbol]: data
      }));
      
      updateLoadingProgress(progressIndex, totalStocks, `Données récupérées pour ${symbol}`);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des données pour ${symbol}:`, error);
      updateLoadingProgress(progressIndex, totalStocks, `Erreur pour ${symbol}`);
      throw error;
    }
  };
  
  const updateLoadingProgress = (current, total, message) => {
    const progress = Math.min(90, Math.round((current / total) * 100));
    setLoadingProgress(progress);
    setLoadingMessage(message);
  };
  
  const handleCalculate = async () => {
    if (selectedStocks.length === 0) return;
    
    setIsLoading(true);
    setShowResults(false);
    setCurrentStep(4);
    setLoadingProgress(0);
    setLoadingMessage('Initialisation du calcul...');
    
    try {
      const newPerformanceData = [];
      
      for (let i = 0; i < selectedStocks.length; i++) {
        const stock = selectedStocks[i];
        
        const stockData = await fetchStockData(stock.symbol, i, selectedStocks.length);
        
        setLoadingMessage(`Calcul des performances pour ${stock.symbol}...`);
        const performance = calculateDCAPerformance(
          stockData,
          stock.monthlyInvestment,
          stock.startDate
        );
        
        newPerformanceData.push(performance);
        updateLoadingProgress(i + 0.5, selectedStocks.length, `Analyse terminée pour ${stock.symbol}`);
      }
      
      setLoadingMessage('Finalisation des résultats...');
      setLoadingProgress(95);
      
      setTimeout(() => {
        setPerformanceData(newPerformanceData);
        setShowResults(true);
        setLoadingProgress(100);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors du calcul des performances:', error);
      alert('Une erreur est survenue lors du calcul. Veuillez réessayer.');
      setIsLoading(false);
    }
  };
  
  const renderSimulator = () => (
    <>
      <TipCard>
        <h4>{TIPS[currentTip].title}</h4>
        <p>{TIPS[currentTip].content}</p>
      </TipCard>
    
      <Onboarding currentStep={currentStep} />
      
      {/* Paramètres sur la même ligne horizontale avec hauteurs égales */}
      <TopRow>
        <TopRowCard>
          <StockSearch 
            onSelectStock={handleSelectStock}
            style={{ height: '100%' }}
          />
        </TopRowCard>
        
        <TopRowCard>
          <StockForm
            stockInfo={stockInfo}
            onAddStock={handleAddStock}
            selectedStocks={selectedStocks}
            onRemoveStock={handleRemoveStock}
            onCalculate={handleCalculate}
            style={{ height: '100%' }}
          />
        </TopRowCard>
      </TopRow>
      
      {/* Évolution du portefeuille en pleine largeur */}
      <FullWidthRow>
        {isLoading ? (
          <Card>
            <LoadingContainer>
              <LoadingSpinner size="40px" />
              <LoadingText>Chargement des données et calcul des performances...</LoadingText>
              <LoadingProgress progress={loadingProgress} />
              <LoadingInfo>{loadingMessage}</LoadingInfo>
            </LoadingContainer>
          </Card>
        ) : showResults && performanceData.length > 0 ? (
          <PerformanceChart 
            performanceData={performanceData} 
            selectedStocks={selectedStocks} 
          />
        ) : (
          <Card>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              textAlign: 'center',
              padding: '20px'
            }}>
              <FaChartBar size={50} color={theme.gray} />
              <h3>Prêt à analyser votre investissement ?</h3>
              <p>Cliquez sur "Calculer la performance" pour visualiser les résultats.</p>
            </div>
          </Card>
        )}
      </FullWidthRow>
      
      {/* Résultats détaillés */}
      {showResults && performanceData.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <PerformanceSummary 
            performanceData={performanceData} 
            selectedStocks={selectedStocks} 
          />
          
          <PerformanceDetails 
            performanceData={performanceData} 
            selectedStocks={selectedStocks} 
          />
        </div>
      )}
    </>
  );
  
  return (
    <AppContainer>
      <Header>
        <Title>Centurion <FaDollarSign /></Title>
        <Subtitle>
          Simulateur d'investissement régulier (DCA) sur les marchés financiers
          <Tooltip term="dca" />
        </Subtitle>
        <HeaderActions>
          <ThemeToggle title="Changer de thème">
            <span role="img" aria-label="Thème">🌓</span>
          </ThemeToggle>
        </HeaderActions>
      </Header>
      
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderSimulator()}
        
        <Suspense fallback={<LoadingContainer><LoadingSpinner size="40px" /></LoadingContainer>}>
          <Card>
            <h2>Historique des simulations</h2>
            <p>Cette fonctionnalité sera bientôt disponible.</p>
          </Card>
        </Suspense>
        
        <Suspense fallback={<LoadingContainer><LoadingSpinner size="40px" /></LoadingContainer>}>
          <ComparisonComponent />
        </Suspense>
        
        <Suspense fallback={<LoadingContainer><LoadingSpinner size="40px" /></LoadingContainer>}>
          <Education />
        </Suspense>
        
        <Suspense fallback={<LoadingContainer><LoadingSpinner size="40px" /></LoadingContainer>}>
          <Help />
        </Suspense>
      </TabNavigation>
    </AppContainer>
  );
}

export default App;