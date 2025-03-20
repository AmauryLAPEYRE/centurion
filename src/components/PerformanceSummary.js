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
import { FaMoneyBillWave, FaChartLine, FaArrowUp, FaArrowDown, FaCoins } from 'react-icons/fa';
import StockIcon from './StockIcon';

const PerformanceSummary = ({ performanceData, selectedStocks }) => {
  // Calculer les statistiques de performances
  const summaryStats = performanceData.map((stockData, index) => {
    const lastEntry = stockData[stockData.length - 1];
    const stock = selectedStocks[index];
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      color: getStockColor(index),
      totalInvested: lastEntry.totalInvested,
      portfolioValue: lastEntry.portfolioValue,
      roi: lastEntry.roi,
      totalShares: lastEntry.totalShares,
      currentPrice: lastEntry.price
    };
  });
  
  // Calculer les statistiques globales
  const totalInvested = summaryStats.reduce((sum, stat) => sum + stat.totalInvested, 0);
  const totalValue = summaryStats.reduce((sum, stat) => sum + stat.portfolioValue, 0);
  const totalROI = ((totalValue - totalInvested) / totalInvested) * 100;
  
  return (
    <>
      <SummaryCards>
        <SummaryCard>
          <SummaryTitle><FaMoneyBillWave /> Total investi</SummaryTitle>
          <SummaryValue>{formatCurrency(totalInvested)}</SummaryValue>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryTitle><FaChartLine /> Valeur actuelle</SummaryTitle>
          <SummaryValue>{formatCurrency(totalValue)}</SummaryValue>
          <SummarySubValue 
            positive={totalROI > 0} 
            negative={totalROI < 0}
          >
            {totalROI > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {totalROI > 0 ? '+' : ''}{formatPercent(totalROI)}
          </SummarySubValue>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryTitle><FaCoins /> Profit/Perte</SummaryTitle>
          <SummaryValue>{formatCurrency(totalValue - totalInvested)}</SummaryValue>
        </SummaryCard>
      </SummaryCards>
      
      <SummaryCards>
        {summaryStats.map((stat) => (
          <SummaryCard key={stat.symbol} color={stat.color}>
            <SummaryTitle>
              <StockIcon symbol={stat.symbol} />
              {stat.name} ({stat.symbol})
            </SummaryTitle>
            <SummaryValue>{formatCurrency(stat.portfolioValue)}</SummaryValue>
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
          </SummaryCard>
        ))}
      </SummaryCards>
    </>
  );
};

export default PerformanceSummary;