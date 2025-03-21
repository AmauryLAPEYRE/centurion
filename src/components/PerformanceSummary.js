import React from 'react';
import { 
  Card,
  SummaryValue, 
  SummarySubValue,
} from './StyledComponents';
import { formatCurrency, formatPercent, formatShares } from '../utils/calculationUtils';
import { getStockColor } from '../utils/theme';
import { 
  FaMoneyBillWave, FaChartLine, FaArrowUp, FaArrowDown, 
  FaCoins, FaCalendarAlt, FaPercentage
} from 'react-icons/fa';
import StockIcon from './StockIcon';
import Tooltip from './Tooltip';
import styled from 'styled-components';
import { theme } from '../utils/theme';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';

// Styles améliorés
const SummaryContainer = styled.div`
  width: 100%;
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

const SummaryCard = styled(Card)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
  border-top: 4px solid ${props => props.color || theme.primary};
  margin-bottom: 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: ${theme.secondary};
  margin: 60px 0 20px 0;  /* Augmentation significative de la marge supérieure */
  padding-bottom: 8px;
  border-bottom: 1px solid ${theme.gray};
  width: 100%;
`;

const CardTitle = styled.div`
  font-size: 1rem;
  color: ${theme.darkGray};
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  
  svg {
    color: ${props => props.iconColor || theme.primary};
  }
`;

const SparklineContainer = styled.div`
  height: 60px;
  margin-bottom: 15px;
  position: relative;
`;

const SparklineLabel = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.75rem;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 2px 6px;
  border-radius: 3px;
  color: ${theme.darkGray};
  z-index: 2;
`;

const SparklineInfo = styled.div`
  font-size: 0.75rem;
  color: ${theme.darkGray};
  text-align: center;
  margin-top: 0;
  margin-bottom: 15px;
`;

const ValueWrapper = styled.div`
  margin: 10px 0;
`;

const CustomValue = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${theme.dark};
  margin-bottom: 5px;
`;

const MetricInfo = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 10px;
`;

const MetricBadge = styled.div`
  font-size: 0.8rem;
  color: ${theme.darkGray};
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 10px;
  
  svg {
    margin-right: 4px;
    font-size: 0.75rem;
  }
`;

const RankBadge = styled.div`
  background-color: ${props => props.index === 0 ? '#FFD70050' : props.index === 1 ? '#C0C0C050' : '#CD7F3250'};
  color: ${props => props.index === 0 ? '#856200' : props.index === 1 ? '#757575' : '#8B4513'};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

// Ligne proportionnelle unique
const ProportionLine = styled.div`
  height: 3px;
  background-color: ${props => props.color || theme.primary};
  width: ${props => props.width || '100%'};
  border-radius: 1.5px;
  margin-bottom: 10px;
  
  &::after {
    content: '${props => props.label || ''}';
    position: absolute;
    right: 20px;
    margin-top: 5px;
    font-size: 0.7rem;
    color: ${theme.darkGray};
  }
`;

// MiniSparkline amélioré avec label
const MiniSparkline = ({ data, dataKey, color, type = 'line', label = null }) => {
  if (!data || data.length === 0) return null;
  
  return (
    <>
      <SparklineContainer>
        {label && <SparklineLabel>{label}</SparklineLabel>}
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <Area 
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fill={`${color}30`}
                isAnimationActive={false}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <Line 
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </SparklineContainer>
      {label && (
        <SparklineInfo>
          {label === 'Évolution' ? 'Valeur du portefeuille sur la période' : 
          label === 'Investissement' ? 'Montant investi cumulé' : 
          label === 'Performance' ? 'Évolution de la valeur' : ''}
        </SparklineInfo>
      )}
    </>
  );
};

// Fonction pour calculer le CAGR (taux de croissance annuel composé)
const calculateCAGR = (startValue, endValue, years) => {
  if (years === 0 || startValue === 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
};

// Fonction pour calculer la volatilité
const calculateVolatility = (returns) => {
  if (returns.length <= 1) return 0;
  
  // Calculer la moyenne des rendements
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  
  // Calculer la variance
  const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (returns.length - 1);
  
  // Écart-type (volatilité)
  return Math.sqrt(variance);
};

const PerformanceSummary = ({ performanceData, selectedStocks }) => {
  // Vérifier si nous avons des données
  if (!performanceData || performanceData.length === 0 || !selectedStocks || selectedStocks.length === 0) {
    return <div>Aucune donnée de performance disponible.</div>;
  }
  
  // Calculer les statistiques de performances
  const summaryStats = performanceData.map((stockData, index) => {
    const lastEntry = stockData[stockData.length - 1];
    const firstEntry = stockData[0];
    const stock = selectedStocks[index];
    
    // Calculer les rendements mensuels pour la volatilité
    const monthlyReturns = [];
    for (let i = 1; i < stockData.length; i++) {
      const currentValue = stockData[i].portfolioValue;
      const previousValue = stockData[i-1].portfolioValue;
      if (previousValue > 0) {
        monthlyReturns.push((currentValue - previousValue) / previousValue * 100);
      }
    }
    
    // Calculer la volatilité
    const volatility = calculateVolatility(monthlyReturns);
    
    // Calculer le CAGR
    const startDate = new Date(firstEntry.date);
    const endDate = new Date(lastEntry.date);
    const years = (endDate - startDate) / (365 * 24 * 60 * 60 * 1000);
    
    const cagr = calculateCAGR(
      firstEntry.totalInvested,
      lastEntry.portfolioValue,
      years
    );
    
    // Extraire les données pour le sparkline
    const sparklineData = stockData.map(entry => ({
      date: entry.date,
      value: entry.portfolioValue
    }));
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      color: getStockColor(index),
      totalInvested: lastEntry.totalInvested,
      portfolioValue: lastEntry.portfolioValue,
      roi: lastEntry.roi,
      totalShares: lastEntry.totalShares,
      currentPrice: lastEntry.price,
      volatility,
      cagr,
      sparklineData,
      years
    };
  });
  
  // Trier les stats par ROI pour le classement
  const sortedStats = [...summaryStats].sort((a, b) => b.roi - a.roi);
  
  // Calculer les statistiques globales
  const totalInvested = summaryStats.reduce((sum, stat) => sum + stat.totalInvested, 0);
  const totalValue = summaryStats.reduce((sum, stat) => sum + stat.portfolioValue, 0);
  const totalROI = ((totalValue - totalInvested) / totalInvested) * 100;
  
  // Calculer le CAGR global
  const avgYears = summaryStats.reduce((sum, stat) => sum + stat.years, 0) / summaryStats.length;
  const globalCAGR = calculateCAGR(totalInvested, totalValue, avgYears);
  
  // Créer les données de sparkline pour l'investissement total et la valeur totale
  const combinedData = {};
  
  // Initialiser la structure
  if (performanceData.length > 0 && performanceData[0].length > 0) {
    performanceData[0].forEach(dataPoint => {
      combinedData[dataPoint.date] = {
        date: dataPoint.date,
        portfolioValue: 0,
        totalInvested: 0
      };
    });
    
    // Remplir avec les données de chaque stock
    performanceData.forEach(stockData => {
      stockData.forEach(dataPoint => {
        if (combinedData[dataPoint.date]) {
          combinedData[dataPoint.date].portfolioValue += dataPoint.portfolioValue;
          combinedData[dataPoint.date].totalInvested += dataPoint.totalInvested;
        }
      });
    });
  }
  
  // Convertir en tableaux pour les sparklines
  const combinedSparklineData = Object.values(combinedData).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  // Extraire les données d'investissement et de valeur pour les sparklines
  const valueData = combinedSparklineData.map(d => ({
    date: d.date,
    value: d.portfolioValue
  }));
  
  const investmentData = combinedSparklineData.map(d => ({
    date: d.date,
    value: d.totalInvested
  }));
  
  // Données pour le profit réalisé
  const profitData = combinedSparklineData.map(d => ({
    date: d.date,
    value: d.portfolioValue - d.totalInvested
  }));
  
  return (
    <SummaryContainer>
      {/* Résumé global */}
      <SummaryRow>
        <SummaryCard color={theme.primary}>
          <CardTitle iconColor={theme.primary}>
            <FaMoneyBillWave /> Total investi
            <Tooltip term="investissement" />
          </CardTitle>
          
          <MiniSparkline 
            data={investmentData} 
            dataKey="value" 
            color={theme.primary} 
            type="area" 
            label="Investissement"
          />
          
          <ValueWrapper>
            <CustomValue>{formatCurrency(totalInvested)}</CustomValue>
            <ProportionLine 
              color={theme.primary} 
              label="Montant investi cumulé"
            />
          </ValueWrapper>
          
          <MetricInfo>
            <SummarySubValue>
              {summaryStats.length > 0 && `${formatCurrency(totalInvested / summaryStats.length)} par action`}
            </SummarySubValue>
            <MetricBadge>
              <FaCalendarAlt /> {avgYears.toFixed(1)} ans
            </MetricBadge>
          </MetricInfo>
        </SummaryCard>
        
        <SummaryCard color={theme.secondary}>
          <CardTitle iconColor={theme.secondary}>
            <FaChartLine /> Valeur actuelle
          </CardTitle>
          
          <MiniSparkline 
            data={valueData} 
            dataKey="value" 
            color={totalROI > 0 ? 'green' : 'red'} 
            type="area" 
            label="Évolution"
          />
          
          <ValueWrapper>
            <CustomValue>{formatCurrency(totalValue)}</CustomValue>
            <ProportionLine 
              color={totalROI > 0 ? 'green' : 'red'}
              label="Valeur du portefeuille"
            />
          </ValueWrapper>
          
          <SummarySubValue 
            positive={totalROI > 0} 
            negative={totalROI < 0}
          >
            {totalROI > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {totalROI > 0 ? '+' : ''}{formatPercent(totalROI)}
          </SummarySubValue>
        </SummaryCard>
        
        <SummaryCard color={theme.tertiary}>
          <CardTitle iconColor={theme.tertiary}>
            <FaCoins /> Profit/Perte
          </CardTitle>
          
          <ValueWrapper style={{ marginTop: '75px' }}>
            <CustomValue>{formatCurrency(totalValue - totalInvested)}</CustomValue>
            <ProportionLine 
              color={totalValue > totalInvested ? 'green' : 'red'} 
              label="Profit réalisé"
            />
          </ValueWrapper>
          
          <MetricInfo>
            <SummarySubValue 
              positive={globalCAGR > 0} 
              negative={globalCAGR < 0}
            >
              <FaPercentage /> CAGR: {globalCAGR.toFixed(2)}%
              <Tooltip term="cagr" />
            </SummarySubValue>
          </MetricInfo>
        </SummaryCard>
      </SummaryRow>
      
      {/* Section Performance par action avec espacement augmenté */}
      <SectionTitle>Performance par action</SectionTitle>
      
      {sortedStats.map((stat, index) => (
        <SummaryCard 
          key={stat.symbol}
          color={stat.color}
          style={{ marginBottom: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StockIcon symbol={stat.symbol} />
              <span style={{ fontWeight: '600' }}>{stat.name} ({stat.symbol})</span>
            </div>
            
            {index < 3 && (
              <RankBadge index={index}>
                {index === 0 ? '🏆 1er' : index === 1 ? '🥈 2ème' : '🥉 3ème'}
              </RankBadge>
            )}
          </div>
          
          <SparklineContainer style={{ height: '80px' }}>
            <SparklineLabel>Performance</SparklineLabel>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={stat.sparklineData} 
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <Line 
                  type="monotone"
                  dataKey="value"
                  stroke={stat.color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </SparklineContainer>
          <SparklineInfo>Évolution de la valeur</SparklineInfo>
          
          <ValueWrapper>
            <CustomValue>{formatCurrency(stat.portfolioValue)}</CustomValue>
            <ProportionLine 
              color={stat.color}
              label="Évolution de la valeur"
            />
          </ValueWrapper>
          
          <SummarySubValue 
            positive={stat.roi > 0} 
            negative={stat.roi < 0}
          >
            {stat.roi > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {stat.roi > 0 ? '+' : ''}{formatPercent(stat.roi)}
          </SummarySubValue>
          
          <SummarySubValue style={{ marginTop: '5px' }}>
            {formatShares(stat.totalShares)} parts à {formatCurrency(stat.currentPrice)}
          </SummarySubValue>
          
          <MetricInfo>
            <MetricBadge title="Volatilité">
              σ: {stat.volatility.toFixed(2)}%
              <Tooltip term="volatilité" />
            </MetricBadge>
            
            <MetricBadge title="Taux de croissance annuel composé">
              CAGR: {stat.cagr.toFixed(2)}%
            </MetricBadge>
          </MetricInfo>
        </SummaryCard>
      ))}
    </SummaryContainer>
  );
};

export default PerformanceSummary;