import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  AppContainer,
  Header,
  Title,
  Subtitle,
  ResultsContainer,
  LoadingSpinner,
  ContentContainer,
  Grid,
  GridItem,
  ProgressiveContainer,
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
import { FaDollarSign, FaSpinner, FaLightbulb, FaBook, FaChartBar } from 'react-icons/fa';
import styled from 'styled-components';
import { theme } from './utils/theme';
import Tooltip from './components/Tooltip';

// Lazy loading des composants moins prioritaires
const Education = lazy(() => import('./components/Education'));
const ComparisonComponent = lazy(() => import('./components/Comparison'));
const Help = lazy(() => import('./components/Help'));

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  animation: fadeIn 0.3s ease;
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
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const TipCard = styled.div`
  background: linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%);
  color: white;
  padding: 15px;
  border-radius: ${theme.radius.md};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: ${theme.shadows.md};
  animation: fadeIn 0.5s ease;
  
  svg {
    font-size: 2rem;
    min-width: 2rem;
  }
`;

const TipText = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 5px 0;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const TipButton = styled.button`
  background-color: rgba(255, 255, 255, 0.25);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: ${theme.radius.sm};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }
`;

// Astuces à afficher
const TIPS = [
  {
    title: "Qu'est-ce que le DCA ?",
    content: "Le Dollar-Cost Averaging est une stratégie d'investissement qui consiste à investir régulièrement des sommes fixes, indépendamment des fluctuations du marché.",
    button: "En savoir plus",
    icon: <FaBook />
  },
  {
    title: "Optimisez votre simulation",
    content: "Essayez de comparer plusieurs actions sur une même période pour voir laquelle performe le mieux sur le long terme.",
    button: "Voir un exemple",
    icon: <FaChartBar />
  },
  {
    title: "Saviez-vous ?",
    content: "Le DCA réduit l'impact de la volatilité et permet d'accumuler plus de parts lorsque les prix sont bas.",
    button: "Découvrir",
    icon: <FaLightbulb />
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
        // Continuer même en cas d'erreur
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
    setCurrentStep(2); // Passer à l'étape de configuration après la sélection d'une action
  };
  
  const handleAddStock = (stock) => {
    if (selectedStocks.some(s => s.symbol === stock.symbol)) {
      alert(`L'action ${stock.symbol} est déjà dans votre liste.`);
      return;
    }
    
    setSelectedStocks([...selectedStocks, stock]);
    setStockInfo(null);
    setCurrentStep(3); // Passer à l'étape d'investissement mensuel
  };
  
  const handleRemoveStock = (index) => {
    const newStocks = [...selectedStocks];
    newStocks.splice(index, 1);
    setSelectedStocks(newStocks);
    
    // Si on a déjà calculé des performances, les mettre à jour
    if (performanceData.length > 0) {
      const newPerformance = [...performanceData];
      newPerformance.splice(index, 1);
      setPerformanceData(newPerformance);
    }
  };
  
  const fetchStockData = async (symbol, progressIndex, totalStocks) => {
    try {
      // Vérifier si nous avons déjà les données
      if (stocksData[symbol]) {
        updateLoadingProgress(progressIndex, totalStocks, `Données en cache pour ${symbol}`);
        return stocksData[symbol];
      }
      
      // Sinon, les récupérer via l'API
      setLoadingMessage(`Récupération des données pour ${symbol}...`);
      const data = await getMonthlyStockData(symbol);
      
      // Mettre en cache les données
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
    setCurrentStep(4); // Passer à l'étape d'analyse
    setLoadingProgress(0);
    setLoadingMessage('Initialisation du calcul...');
    
    try {
      const newPerformanceData = [];
      
      for (let i = 0; i < selectedStocks.length; i++) {
        const stock = selectedStocks[i];
        
        // Récupérer les données de l'action
        const stockData = await fetchStockData(stock.symbol, i, selectedStocks.length);
        
        // Calculer la performance DCA
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
      
      // Petit délai pour afficher la progression à 95%
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
      {/* Astuce du jour */}
      <TipCard>
        {TIPS[currentTip].icon}
        <TipText>
          <h4>{TIPS[currentTip].title}</h4>
          <p>{TIPS[currentTip].content}</p>
        </TipText>
        <TipButton>{TIPS[currentTip].button}</TipButton>
      </TipCard>
    
      {/* Ajout du composant d'onboarding */}
      <Onboarding currentStep={currentStep} />
      
      <Grid columns={12}>
        <GridItem span={12}>
          <StockSearch onSelectStock={handleSelectStock} />
        </GridItem>
      </Grid>
      
      <ContentContainer direction="column" desktopDirection="row">
        <GridItem span={4}>
          <StockForm
            stockInfo={stockInfo}
            onAddStock={handleAddStock}
            selectedStocks={selectedStocks}
            onRemoveStock={handleRemoveStock}
            onCalculate={handleCalculate}
          />
        </GridItem>
        
        {selectedStocks.length > 0 && (
          <GridItem span={8}>
            <Card style={{height: '100%'}}>
              <ProgressiveContainer loaded={dataLoaded}>
                {isLoading ? (
                  <LoadingContainer>
                    <LoadingSpinner size="40px" />
                    <LoadingText>Chargement des données et calcul des performances...</LoadingText>
                    <LoadingProgress progress={loadingProgress} />
                    <LoadingInfo>{loadingMessage}</LoadingInfo>
                  </LoadingContainer>
                ) : showResults && performanceData.length > 0 ? (
                  <PerformanceChart 
                    performanceData={performanceData.slice(0, 1)} 
                    selectedStocks={selectedStocks.slice(0, 1)} 
                  />
                ) : (
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
                )}
              </ProgressiveContainer>
            </Card>
          </GridItem>
        )}
      </ContentContainer>
      
      {showResults && performanceData.length > 0 && (
        <ResultsContainer>
          <PerformanceSummary 
            performanceData={performanceData} 
            selectedStocks={selectedStocks} 
          />
          
          <PerformanceChart 
            performanceData={performanceData} 
            selectedStocks={selectedStocks} 
          />
          
          <PerformanceDetails 
            performanceData={performanceData} 
            selectedStocks={selectedStocks} 
          />
        </ResultsContainer>
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
        {/* Onglet Simulateur */}
        {renderSimulator()}
        
        {/* Onglet Historique */}
        <Suspense fallback={<LoadingContainer><LoadingSpinner size="40px" /></LoadingContainer>}>
          <Card>
            <h2>Historique des simulations</h2>
            <p>Cette fonctionnalité sera bientôt disponible.</p>
          </Card>
        </Suspense>
        
        {/* Onglet Comparaison */}
        <Suspense fallback={<LoadingContainer><LoadingSpinner size="40px" /></LoadingContainer>}>
          <ComparisonComponent />
        </Suspense>
        
        {/* Onglet Éducation */}
        <Suspense fallback={<LoadingContainer><LoadingSpinner size="40px" /></LoadingContainer>}>
          <Education />
        </Suspense>
        
        {/* Onglet Aide */}
        <Suspense fallback={<LoadingContainer><LoadingSpinner size="40px" /></LoadingContainer>}>
          <Help />
        </Suspense>
      </TabNavigation>
    </AppContainer>
  );
}

export default App;