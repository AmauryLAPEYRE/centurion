import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardTitle } from './StyledComponents';
import { formatCurrency, formatDate } from '../utils/calculationUtils';
import { getStockColor } from '../utils/theme';
import { FaChartArea } from 'react-icons/fa';
import StockIcon from './StockIcon';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: 'white', 
        padding: '12px', 
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{formatDate(label)}</p>
        {payload.map((entry, index) => (
          <div key={`value-${index}`} style={{ 
            color: entry.color, 
            margin: '5px 0',
            display: 'flex',
            alignItems: 'center' 
          }}>
            <StockIcon 
              symbol={entry.dataKey}
              size="16px"
              backgroundColor="transparent"
              color={entry.color}
              marginRight="5px"
            />
            <span style={{ fontWeight: 'bold' }}>{entry.name}: </span>
            <span style={{ marginLeft: '5px' }}>{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
};

const PerformanceChart = ({ performanceData, selectedStocks }) => {
  // Transformer les données pour le graphique
  const chartData = performanceData.length > 0 ? performanceData[0].map((item, index) => {
    const dataPoint = { date: item.date };
    
    performanceData.forEach((stockData, stockIndex) => {
      if (stockData[index]) {
        const stockSymbol = selectedStocks[stockIndex].symbol;
        dataPoint[stockSymbol] = stockData[index].portfolioValue;
      }
    });
    
    return dataPoint;
  }) : [];
  
  return (
    <Card>
      <CardTitle><FaChartArea /> Évolution de la valeur du portefeuille</CardTitle>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={value => {
                const date = new Date(value);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              }}
              stroke="#6c757d"
            />
            <YAxis 
              tickFormatter={value => formatCurrency(value)}
              stroke="#6c757d"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value, entry) => {
                return (
                  <span style={{ color: entry.color, display: 'flex', alignItems: 'center' }}>
                    <StockIcon 
                      symbol={value}
                      size="16px"
                      backgroundColor="transparent"
                      color={entry.color}
                      marginRight="5px"
                    />
                    {selectedStocks.find(stock => stock.symbol === value)?.name || value}
                  </span>
                );
              }}
            />
            
            {selectedStocks.map((stock, index) => (
              <Area 
                key={stock.symbol}
                type="monotone"
                dataKey={stock.symbol}
                name={stock.name}
                stroke={getStockColor(index)}
                fill={`${getStockColor(index)}30`}
                activeDot={{ r: 8, strokeWidth: 0 }}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;