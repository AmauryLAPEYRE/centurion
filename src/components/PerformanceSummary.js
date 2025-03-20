import React from 'react';
import { 
  SummaryCards, 
  SummaryCard, 
  SummaryTitle, 
  SummaryValue, 
  SummarySubValue 
} from './StyledComponents';
import { formatCurrency, formatPercent, formatShares } from '../utils/calculationUtils';
import { getStockColor } from '../utils/theme';
import { 
  FaMoneyBillWave, FaChartLine, FaArrowUp, FaArrowDown, 
  FaCoins, FaCalendarAlt, FaPercentage, FaTrophy
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

// Nouveaux composants stylisés
const SparklineContainer = styled.div`
  height: 50px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const MetricWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MiniStat = styled.div`
  font-size: 0.8rem;
  color: ${theme.darkGray};
  display: flex;
  align-items: center;
  margin-left: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 10px;
  
  svg {
    margin-right: 3px;
    font-size: 0.7rem;
  }
`;

const AnimatedValue = styled.div`
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${theme.primary}, transparent);
    animation: shimmer 2s infinite;
    opacity: ${props => props.highlight ? 1 : 0};
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const StockCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const StockRank = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.index === 0 ? '#FFD700' : props.index === 1 ? '#C0C0C0' : props.index === 2 ? '#CD7F32' : theme.light};
  color: ${props => props.index < 3 ? '#000' : theme.darkGray};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
`;

const MiniSparkline = ({ data, dataKey, color, type = 'line' }) => {
  return (
    <SparklineContainer>
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
  
  // Calculer le CAGR global (en supposant que les périodes d'investissement sont les mêmes)
  const avgYears = summaryStats.reduce((sum, stat) => sum + stat.years, 0) / summaryStats.length;
  const globalCAGR = calculateCAGR(totalInvested, totalValue, avgYears);
  
  // Créer des données de sparkline combinées
  const combinedSparklineData = [];
  if (performanceData.length > 0 && performanceData[0].length > 0) {
    performanceData[0].forEach((_, dateIndex) => {
      const dataPoint = { date: performanceData[0][dateIndex].date, value: 0 };
      performanceData.forEach(stockData => {
        if (stockData[dateIndex]) {
          dataPoint.value += stockData[dateIndex].portfolioValue;
        }
      });
      combinedSparklineData.push(dataPoint);
    });
  }
  
  return (
    <>
      <SummaryCards>
        <SummaryCard>
          <SummaryTitle>
            <FaMoneyBillWave /> Total investi
            <Tooltip term="investissement" />
          </SummaryTitle>
          <MiniSparkline 
            data={combinedSparklineData} 
            dataKey="value" 
            color={theme.primary} 
            type="area" 
          />
          <SummaryValue>
            <AnimatedValue highlight={totalValue > totalInvested}>
              {formatCurrency(totalInvested)}
            </AnimatedValue>
          </SummaryValue>
          <MetricWrapper>
            <SummarySubValue>
              {summaryStats.length > 0 && `${formatCurrency(totalInvested / summaryStats.length)} par action`}
            </SummarySubValue>
            <MiniStat>
              <FaCalendarAlt /> {avgYears.toFixed(1)} ans
            </MiniStat>
          </MetricWrapper>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryTitle>
            <FaChartLine /> Valeur actuelle
          </SummaryTitle>
          <MiniSparkline 
            data={combinedSparklineData} 
            dataKey="value" 
            color={totalROI > 0 ? 'green' : 'red'} 
            type="area" 
          />
          <SummaryValue>
            <AnimatedValue highlight={true}>
              {formatCurrency(totalValue)}
            </AnimatedValue>
          </SummaryValue>
          <SummarySubValue 
            positive={totalROI > 0} 
            negative={totalROI < 0}
          >
            {totalROI > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {totalROI > 0 ? '+' : ''}{formatPercent(totalROI)}
          </SummarySubValue>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryTitle>
            <FaCoins /> Profit/Perte
          </SummaryTitle>
          <SummaryValue>
            <AnimatedValue highlight={totalValue - totalInvested !== 0}>
              {formatCurrency(totalValue - totalInvested)}
            </AnimatedValue>
          </SummaryValue>
          <MetricWrapper>
            <SummarySubValue 
              positive={globalCAGR > 0} 
              negative={globalCAGR < 0}
            >
              <FaPercentage /> CAGR: {globalCAGR.toFixed(2)}%
              <Tooltip term="cagr" />
            </SummarySubValue>
          </MetricWrapper>
        </SummaryCard>
      </SummaryCards>
      
      <SummaryCards>
        {sortedStats.map((stat, index) => (
          <SummaryCard key={stat.symbol} color={stat.color}>
            <StockCardHeader>
              <SummaryTitle>
                <StockIcon symbol={stat.symbol} />
                {stat.name} ({stat.symbol})
              </SummaryTitle>
              <StockRank index={index}>
                {index < 3 ? <FaTrophy /> : index + 1}
              </StockRank>
            </StockCardHeader>
            
            <MiniSparkline 
              data={stat.sparklineData} 
              dataKey="value" 
              color={stat.color} 
            />
            
            <SummaryValue>
              <AnimatedValue highlight={stat.roi > 5}>
                {formatCurrency(stat.portfolioValue)}
              </AnimatedValue>
            </SummaryValue>
            
            <SummarySubValue 
              positive={stat.roi > 0} 
              negative={stat.roi < 0}
            >
              {stat.roi > 0 ? <FaArrowUp /> : <FaArrowDown />}
              {stat.roi > 0 ? '+' : ''}{formatPercent(stat.roi)}
            </SummarySubValue>
            
            <SummarySubValue>
              {formatShares(stat.totalShares)} parts à {formatCurrency(stat.currentPrice)}
            </SummarySubValue>
            
            <MetricWrapper>
              <MiniStat title="Volatilité">
                σ: {stat.volatility.toFixed(2)}%
                <Tooltip term="volatilité" />
              </MiniStat>
              
              <MiniStat title="Taux de croissance annuel composé">
                CAGR: {stat.cagr.toFixed(2)}%
              </MiniStat>
            </MetricWrapper>
          </SummaryCard>
        ))}
      </SummaryCards>
    </>
  );
};

export default PerformanceSummary;