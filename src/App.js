import React, { useState, useEffect } from 'react';
import {
  AppContainer,
  Header,
  Title,
  Subtitle,
  ResultsContainer,
  Card,
  CardTitle,
  LoadingSpinner
} from './components/StyledComponents';
import StockSearch from './components/StockSearch';
import StockForm from './components/StockForm';
import PerformanceChart from './components/PerformanceChart';
import PerformanceSummary from './components/PerformanceSummary';
import PerformanceDetails from './components/PerformanceDetails';
import Onboarding from './components/Onboarding';
import { getMonthlyStockData } from './services/apiService';
import { calculateDCAPerformance } from './utils/calculationUtils';
import { FaDollarSign, FaSpinner } from 'react-icons/fa';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  text-align: center;
`;

const LoadingText = styled.p`
  margin-top: 15px;
  font-size: 1.1rem;
  color: #6c757d;
`;

function App() {
  const [stockInfo, setStockInfo] = useState(null);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [stocksData, setStocksData] = useState({});
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
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
  
  const fetchStockData = async (symbol) => {
    try {
      // Vérifier si nous avons déjà les données
      if (stocksData[symbol]) {
        return stocksData[symbol];
      }
      
      // Sinon, les récupérer via l'API
      const data = await getMonthlyStockData(symbol);
      
      // Mettre en cache les données
      setStocksData(prevState => ({
        ...prevState,
        [symbol]: data
      }));
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des données pour ${symbol}:`, error);
      throw error;
    }
  };
  
  const handleCalculate = async () => {
    if (selectedStocks.length === 0) return;
    
    setIsLoading(true);
    setShowResults(false);
    setCurrentStep(4); // Passer à l'étape d'analyse
    
    try {
      const newPerformanceData = [];
      
      for (const stock of selectedStocks) {
        // Récupérer les données de l'action
        const stockData = await fetchStockData(stock.symbol);
        
        // Calculer la performance DCA
        const performance = calculateDCAPerformance(
          stockData,
          stock.monthlyInvestment,
          stock.startDate
        );
        
        newPerformanceData.push(performance);
      }
      
      setPerformanceData(newPerformanceData);
      setShowResults(true);
    } catch (error) {
      console.error('Erreur lors du calcul des performances:', error);
      alert('Une erreur est survenue lors du calcul. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AppContainer>
      <Header>
        <Title>Centurion <FaDollarSign /></Title>
        <Subtitle>Simulateur d'investissement régulier (DCA) sur les marchés financiers</Subtitle>
      </Header>
      
      {/* Ajout du composant d'onboarding */}
      <Onboarding currentStep={currentStep} />
      
      <StockSearch onSelectStock={handleSelectStock} />
      
      <StockForm
        stockInfo={stockInfo}
        onAddStock={handleAddStock}
        selectedStocks={selectedStocks}
        onRemoveStock={handleRemoveStock}
        onCalculate={handleCalculate}
      />
      
      {isLoading && (
        <LoadingContainer>
          <FaSpinner style={{ fontSize: '2rem', color: '#4361ee', animation: 'spin 1s linear infinite' }} />
          <LoadingText>Chargement des données et calcul des performances...</LoadingText>
        </LoadingContainer>
      )}
      
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
    </AppContainer>
  );
}

export default App;