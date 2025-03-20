import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Card, CardTitle, Button, Badge, Table, 
  Th, Td, TableWrapper, FlexRow 
} from './StyledComponents';
import { theme } from '../utils/theme';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { formatCurrency, formatPercent } from '../utils/calculationUtils';
import { FaBalanceScale, FaChartBar, FaChartLine, FaDotCircle, FaRegClock, FaStar, FaTimes } from 'react-icons/fa';
import StockIcon from './StockIcon';
import Sparkline from './Sparkline';

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: 300px 1fr;
  }
`;

const AssetSelector = styled.div`
  background-color: white;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
`;

const AssetSelectorHeader = styled.div`
  padding: 15px;
  background-color: ${theme.light};
  border-bottom: 1px solid ${theme.gray};
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: ${theme.darkGray};
  }
`;

const AssetList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.light};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.gray};
    border-radius: 10px;
  }
`;

const AssetItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid ${theme.gray};
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.selected ? theme.light : 'white'};
  
  &:hover {
    background-color: ${theme.light};
  }
`;

const AssetIcon = styled.div`
  margin-right: 10px;
  flex-shrink: 0;
`;

const AssetInfo = styled.div`
  flex: 1;
  
  .name {
    font-weight: ${props => props.selected ? 600 : 400};
    color: ${props => props.selected ? theme.primary : theme.dark};
  }
  
  .symbol {
    font-size: 0.8rem;
    color: ${theme.darkGray};
  }
`;

const SelectButton = styled.button`
  background-color: ${props => props.selected ? theme.primary : 'transparent'};
  color: ${props => props.selected ? 'white' : theme.darkGray};
  border: 1px solid ${props => props.selected ? theme.primary : theme.gray};
  border-radius: ${theme.radius.sm};
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? theme.primary : theme.light};
  }
`;

const ComparisonContent = styled.div``;

const ChartTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.gray};
  margin-bottom: 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.light};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.gray};
    border-radius: 10px;
  }
`;

const ChartTab = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.active ? theme.light : 'transparent'};
  border: none;
  cursor: pointer;
  font-weight: ${props => props.active ? 600 : 400};
  color: ${props => props.active ? theme.primary : theme.darkGray};
  display: flex;
  align-items: center;
  white-space: nowrap;
  position: relative;
  
  svg {
    margin-right: 8px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.active ? theme.primary : 'transparent'};
    transition: all 0.2s ease;
  }
  
  &:hover {
    color: ${theme.primary};
    
    &::after {
      background-color: ${theme.gray};
    }
  }
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: 30px;
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px;
  color: ${theme.darkGray};
  
  svg {
    font-size: 3rem;
    margin-bottom: 15px;
    opacity: 0.3;
  }
  
  h3 {
    margin: 0 0 10px 0;
  }
  
  p {
    margin: 0;
    max-width: 400px;
  }
`;

const ComparisonTableSection = styled.div`
  margin-top: 30px;
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const TimeframeButton = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.active ? theme.primary : 'white'};
  color: ${props => props.active ? 'white' : theme.darkGray};
  border: 1px solid ${props => props.active ? theme.primary : theme.gray};
  border-radius: ${theme.radius.md};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? theme.primary : theme.light};
  }
`;

const MetricBox = styled.div`
  background-color: white;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.sm};
  padding: 15px;
  text-align: center;
  
  h4 {
    margin: 0 0 5px 0;
    color: ${theme.darkGray};
    font-size: 0.9rem;
    font-weight: 400;
  }
  
  .value {
    font-size: 1.4rem;
    font-weight: 600;
    color: ${props => props.highlight ? theme.primary : theme.dark};
  }
  
  .label {
    font-size: 0.8rem;
    color: ${theme.darkGray};
    margin-top: 5px;
  }
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const AssetTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 5px 8px;
  background-color: ${props => `${props.color}20` || theme.light};
  border: 1px solid ${props => `${props.color}50` || theme.gray};
  border-radius: ${theme.radius.sm};
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  .symbol {
    margin-left: 5px;
    font-weight: 600;
    color: ${props => props.color || theme.primary};
  }
  
  button {
    background: none;
    border: none;
    padding: 0;
    margin-left: 5px;
    color: ${theme.darkGray};
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    
    &:hover {
      color: ${theme.danger};
    }
  }
`;

// Données factices pour simuler des actifs et des performances
const mockAssets = [
  { id: 1, name: 'Apple Inc.', symbol: 'AAPL', category: 'Technology' },
  { id: 2, name: 'Microsoft Corporation', symbol: 'MSFT', category: 'Technology' },
  { id: 3, name: 'Amazon.com Inc.', symbol: 'AMZN', category: 'Consumer Cyclical' },
  { id: 4, name: 'Tesla, Inc.', symbol: 'TSLA', category: 'Automotive' },
  { id: 5, name: 'Alphabet Inc.', symbol: 'GOOGL', category: 'Technology' },
  { id: 6, name: 'Meta Platforms, Inc.', symbol: 'META', category: 'Technology' },
  { id: 7, name: 'NVIDIA Corporation', symbol: 'NVDA', category: 'Technology' },
  { id: 8, name: 'JPMorgan Chase & Co.', symbol: 'JPM', category: 'Financial Services' },
  { id: 9, name: 'Visa Inc.', symbol: 'V', category: 'Financial Services' },
  { id: 10, name: 'Johnson & Johnson', symbol: 'JNJ', category: 'Healthcare' }
];

const mockPerformanceData = {
  '1y': [
    { asset: 'AAPL', totalReturn: 32.5, cagr: 32.5, maxDrawdown: -15.2, volatility: 22.4, sharpeRatio: 1.45 },
    { asset: 'MSFT', totalReturn: 28.7, cagr: 28.7, maxDrawdown: -12.8, volatility: 20.1, sharpeRatio: 1.43 },
    { asset: 'AMZN', totalReturn: 16.2, cagr: 16.2, maxDrawdown: -24.6, volatility: 30.5, sharpeRatio: 0.53 },
    { asset: 'TSLA', totalReturn: -5.8, cagr: -5.8, maxDrawdown: -40.1, volatility: 45.2, sharpeRatio: -0.13 },
    { asset: 'GOOGL', totalReturn: 22.4, cagr: 22.4, maxDrawdown: -18.7, volatility: 25.3, sharpeRatio: 0.89 }
  ],
  '3y': [
    { asset: 'AAPL', totalReturn: 85.2, cagr: 22.8, maxDrawdown: -28.4, volatility: 24.8, sharpeRatio: 0.92 },
    { asset: 'MSFT', totalReturn: 92.1, cagr: 24.3, maxDrawdown: -25.1, volatility: 22.5, sharpeRatio: 1.08 },
    { asset: 'AMZN', totalReturn: 12.5, cagr: 4.0, maxDrawdown: -45.2, volatility: 32.1, sharpeRatio: 0.12 },
    { asset: 'TSLA', totalReturn: 101.4, cagr: 26.2, maxDrawdown: -65.3, volatility: 57.8, sharpeRatio: 0.45 },
    { asset: 'GOOGL', totalReturn: 45.3, cagr: 13.2, maxDrawdown: -32.1, volatility: 26.7, sharpeRatio: 0.49 }
  ],
  '5y': [
    { asset: 'AAPL', totalReturn: 325.4, cagr: 33.2, maxDrawdown: -35.1, volatility: 26.3, sharpeRatio: 1.26 },
    { asset: 'MSFT', totalReturn: 357.8, cagr: 35.5, maxDrawdown: -30.2, volatility: 23.8, sharpeRatio: 1.49 },
    { asset: 'AMZN', totalReturn: 145.6, cagr: 19.6, maxDrawdown: -45.2, volatility: 31.4, sharpeRatio: 0.62 },
    { asset: 'TSLA', totalReturn: 896.2, cagr: 60.5, maxDrawdown: -65.3, volatility: 62.1, sharpeRatio: 0.97 },
    { asset: 'GOOGL', totalReturn: 178.2, cagr: 22.8, maxDrawdown: -32.1, volatility: 27.4, sharpeRatio: 0.83 }
  ]
};

// Données fictives pour les graphiques
const generateChartData = (assets, period) => {
  const metrics = ['totalReturn', 'cagr', 'volatility', 'sharpeRatio', 'maxDrawdown'];
  const result = {};
  
  // Données pour les graphiques à barres et lignes
  metrics.forEach(metric => {
    result[metric] = assets.map(asset => {
      const assetData = mockPerformanceData[period].find(d => d.asset === asset.symbol);
      return {
        name: asset.symbol,
        value: assetData ? assetData[metric] : 0,
        color: getAssetColor(asset.symbol)
      };
    });
  });
  
  // Données pour le graphique radar
  result.radar = assets.map(asset => {
    const assetData = mockPerformanceData[period].find(d => d.asset === asset.symbol);
    if (!assetData) return null;
    
    return {
      name: asset.symbol,
      totalReturn: assetData.totalReturn,
      cagr: assetData.cagr,
      volatility: Math.max(70 - assetData.volatility, 0), // Inverser pour que moins de volatilité = meilleur
      sharpeRatio: assetData.sharpeRatio * 20, // Mettre à l'échelle
      recoverySpeed: 100 - Math.abs(assetData.maxDrawdown) // Valeur fictive
    };
  }).filter(Boolean);
  
  return result;
};

const getAssetColor = (symbol) => {
  const colors = {
    'AAPL': '#2a9d8f',
    'MSFT': '#e9c46a',
    'AMZN': '#f4a261',
    'TSLA': '#e76f51',
    'GOOGL': '#264653',
    'META': '#023e8a',
    'NVDA': '#6a994e',
    'JPM': '#bc6c25',
    'V': '#7209b7',
    'JNJ': '#4cc9f0'
  };
  
  return colors[symbol] || theme.primary;
};

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
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={`value-${index}`} style={{ 
            color: entry.color || entry.fill, 
            margin: '5px 0',
            display: 'flex',
            alignItems: 'center' 
          }}>
            <span style={{ 
              display: 'inline-block', 
              width: '10px', 
              height: '10px', 
              backgroundColor: entry.color || entry.fill,
              marginRight: '5px',
              borderRadius: '50%'
            }}></span>
            <span style={{ fontWeight: 'bold' }}>{entry.name}: </span>
            <span style={{ marginLeft: '5px' }}>
              {entry.dataKey === 'totalReturn' || entry.dataKey === 'cagr' 
                ? `${entry.value.toFixed(2)}%` 
                : entry.dataKey === 'maxDrawdown' 
                  ? entry.value.toFixed(2) + '%'
                  : entry.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
};

// Données fictives pour les charts de performance
const generatePerformanceData = () => {
  const data = [];
  const startDate = new Date(2019, 0, 1);
  const assets = ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'GOOGL'];
  let values = {
    'AAPL': 100,
    'MSFT': 100,
    'AMZN': 100,
    'TSLA': 100,
    'GOOGL': 100
  };
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    const dataPoint = {
      date: date.toISOString().slice(0, 7) // Format YYYY-MM
    };
    
    assets.forEach(asset => {
      // Simuler une performance avec une variation aléatoire
      const change = (Math.random() * 10) - 3; // Entre -3% et +7%
      values[asset] *= (1 + change / 100);
      dataPoint[asset] = values[asset];
    });
    
    data.push(dataPoint);
  }
  
  return data;
};

const Comparison = () => {
  const [selectedAssets, setSelectedAssets] = useState([
    mockAssets[0],
    mockAssets[1],
    mockAssets[2]
  ]);
  const [activeChartType, setActiveChartType] = useState('performance');
  const [timeframe, setTimeframe] = useState('3y');
  
  const handleToggleAsset = (asset) => {
    if (selectedAssets.some(a => a.id === asset.id)) {
      setSelectedAssets(selectedAssets.filter(a => a.id !== asset.id));
    } else {
      if (selectedAssets.length < 5) {
        setSelectedAssets([...selectedAssets, asset]);
      } else {
        alert('Vous ne pouvez pas comparer plus de 5 actifs à la fois.');
      }
    }
  };
  
  const handleRemoveAsset = (assetId) => {
    setSelectedAssets(selectedAssets.filter(asset => asset.id !== assetId));
  };
  
  const chartData = generateChartData(selectedAssets, timeframe);
  const performanceData = generatePerformanceData();
  
  const renderChartContent = () => {
    if (selectedAssets.length === 0) {
      return (
        <NoDataMessage>
          <FaBalanceScale />
          <h3>Sélectionnez des actifs à comparer</h3>
          <p>Veuillez choisir au moins un actif dans la liste à gauche pour visualiser les données comparatives.</p>
        </NoDataMessage>
      );
    }
    
    switch (activeChartType) {
      case 'performance':
        return (
          <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => value.slice(5, 7) === '01' ? value.slice(0, 4) : ''}
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedAssets.map(asset => (
              <Line 
                key={asset.id}
                type="monotone"
                dataKey={asset.symbol}
                name={asset.name}
                stroke={getAssetColor(asset.symbol)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        );
        
      case 'returns':
        return (
          <BarChart data={chartData.totalReturn} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Rendement total" 
              fill={theme.primary} 
              radius={[4, 4, 0, 0]}
              barSize={30}
            >
              {chartData.totalReturn.map((entry, index) => (
                <rect 
                  key={`rect-${index}`} 
                  fill={entry.color} 
                />
              ))}
            </Bar>
          </BarChart>
        );
        
      case 'cagr':
        return (
          <BarChart data={chartData.cagr} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="value" 
              name="CAGR" 
              fill={theme.primary} 
              radius={[4, 4, 0, 0]}
              barSize={30}
            >
              {chartData.cagr.map((entry, index) => (
                <rect 
                  key={`rect-${index}`} 
                  fill={entry.color} 
                />
              ))}
            </Bar>
          </BarChart>
        );
        
      case 'volatility':
        return (
          <BarChart data={chartData.volatility} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Volatilité" 
              fill={theme.primary} 
              radius={[4, 4, 0, 0]}
              barSize={30}
            >
              {chartData.volatility.map((entry, index) => (
                <rect 
                  key={`rect-${index}`} 
                  fill={entry.color} 
                />
              ))}
            </Bar>
          </BarChart>
        );
        
      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData.radar}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            {selectedAssets.map(asset => {
              const assetData = chartData.radar.find(d => d.name === asset.symbol);
              if (!assetData) return null;
              
              return (
                <Radar 
                  key={asset.id}
                  name={asset.name}
                  dataKey="value"
                  stroke={getAssetColor(asset.symbol)}
                  fill={getAssetColor(asset.symbol)}
                  fillOpacity={0.3}
                />
              );
            })}
            <Tooltip />
            <Legend />
          </RadarChart>
        );
        
      default:
        return null;
    }
  };
  
  const getMetricHighlight = (metric) => {
    if (selectedAssets.length === 0) return null;
    
    const data = mockPerformanceData[timeframe].filter(d => 
      selectedAssets.some(asset => asset.symbol === d.asset)
    );
    
    if (data.length === 0) return null;
    
    if (metric === 'maxDrawdown') {
      // Pour maxDrawdown, la plus petite valeur absolue est la meilleure
      return data.reduce((prev, curr) => 
        Math.abs(prev.maxDrawdown) < Math.abs(curr.maxDrawdown) ? prev : curr
      ).asset;
    } else {
      // Pour les autres métriques, la plus grande valeur est la meilleure
      return data.reduce((prev, curr) => 
        prev[metric] > curr[metric] ? prev : curr
      ).asset;
    }
  };
  
  return (
    <Card>
      <CardTitle><FaBalanceScale /> Comparaison d'actifs</CardTitle>
      
      <FlexRow>
        {selectedAssets.map(asset => (
          <AssetTag key={asset.id} color={getAssetColor(asset.symbol)}>
            <StockIcon symbol={asset.symbol} />
            <span className="symbol">{asset.symbol}</span>
            <button onClick={() => handleRemoveAsset(asset.id)}>
              <FaTimes />
            </button>
          </AssetTag>
        ))}
      </FlexRow>
      
      <TimeframeSelector>
        <TimeframeButton 
          active={timeframe === '1y'}
          onClick={() => setTimeframe('1y')}
        >
          1 an
        </TimeframeButton>
        <TimeframeButton 
          active={timeframe === '3y'}
          onClick={() => setTimeframe('3y')}
        >
          3 ans
        </TimeframeButton>
        <TimeframeButton 
          active={timeframe === '5y'}
          onClick={() => setTimeframe('5y')}
        >
          5 ans
        </TimeframeButton>
      </TimeframeSelector>
      
      <ComparisonGrid>
        <AssetSelector>
          <AssetSelectorHeader>
            <h3>Choisissez jusqu'à 5 actifs</h3>
          </AssetSelectorHeader>
          
          <AssetList>
            {mockAssets.map(asset => {
              const isSelected = selectedAssets.some(a => a.id === asset.id);
              
              return (
                <AssetItem 
                  key={asset.id}
                  selected={isSelected}
                >
                  <AssetIcon>
                    <StockIcon symbol={asset.symbol} />
                  </AssetIcon>
                  
                  <AssetInfo selected={isSelected}>
                    <div className="name">{asset.name}</div>
                    <div className="symbol">{asset.symbol}</div>
                  </AssetInfo>
                  
                  <SelectButton 
                    selected={isSelected}
                    onClick={() => handleToggleAsset(asset)}
                  >
                    {isSelected ? 'Sélectionné' : 'Ajouter'}
                  </SelectButton>
                </AssetItem>
              );
            })}
          </AssetList>
        </AssetSelector>
        
        <ComparisonContent>
          <ChartTabs>
            <ChartTab 
              active={activeChartType === 'performance'}
              onClick={() => setActiveChartType('performance')}
            >
              <FaChartLine /> Performance
            </ChartTab>
            <ChartTab 
              active={activeChartType === 'returns'}
              onClick={() => setActiveChartType('returns')}
            >
              <FaChartBar /> Rendement total
            </ChartTab>
            <ChartTab 
              active={activeChartType === 'cagr'}
              onClick={() => setActiveChartType('cagr')}
            >
              <FaRegClock /> CAGR
            </ChartTab>
            <ChartTab 
              active={activeChartType === 'volatility'}
              onClick={() => setActiveChartType('volatility')}
            >
              <FaDotCircle /> Volatilité
            </ChartTab>
            <ChartTab 
              active={activeChartType === 'radar'}
              onClick={() => setActiveChartType('radar')}
            >
              <FaStar /> Radar
            </ChartTab>
          </ChartTabs>
          
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              {renderChartContent()}
            </ResponsiveContainer>
          </ChartContainer>
          
          {/* Métriques clés */}
          {selectedAssets.length > 0 && (
            <MetricGrid>
              <MetricBox highlight={getMetricHighlight('totalReturn') !== null}>
                <h4>Rendement total</h4>
                <div className="value">
                  {timeframe === '1y' 
                    ? `+32.5%` 
                    : timeframe === '3y' 
                      ? `+92.1%` 
                      : `+357.8%`}
                </div>
                <div className="label">
                  Meilleur: {getMetricHighlight('totalReturn')}
                </div>
              </MetricBox>
              
              <MetricBox highlight={getMetricHighlight('cagr') !== null}>
                <h4>CAGR</h4>
                <div className="value">
                  {timeframe === '1y' 
                    ? `+32.5%` 
                    : timeframe === '3y' 
                      ? `+24.3%` 
                      : `+35.5%`}
                </div>
                <div className="label">
                  Meilleur: {getMetricHighlight('cagr')}
                </div>
              </MetricBox>
              
              <MetricBox highlight={getMetricHighlight('maxDrawdown') !== null}>
                <h4>Drawdown max</h4>
                <div className="value">
                  {timeframe === '1y' 
                    ? `-12.8%` 
                    : timeframe === '3y' 
                      ? `-25.1%` 
                      : `-30.2%`}
                </div>
                <div className="label">
                  Meilleur: {getMetricHighlight('maxDrawdown')}
                </div>
              </MetricBox>
              
              <MetricBox highlight={getMetricHighlight('sharpeRatio') !== null}>
                <h4>Ratio de Sharpe</h4>
                <div className="value">
                  {timeframe === '1y' 
                    ? `1.45` 
                    : timeframe === '3y' 
                      ? `1.08` 
                      : `1.49`}
                </div>
                <div className="label">
                  Meilleur: {getMetricHighlight('sharpeRatio')}
                </div>
              </MetricBox>
            </MetricGrid>
          )}
          
          {/* Tableau comparatif */}
          <ComparisonTableSection>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Actif</Th>
                    <Th>Rendement total</Th>
                    <Th>CAGR</Th>
                    <Th>Drawdown max</Th>
                    <Th>Volatilité</Th>
                    <Th>Ratio de Sharpe</Th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAssets.map(asset => {
                    const data = mockPerformanceData[timeframe].find(d => d.asset === asset.symbol);
                    if (!data) return null;
                    
                    return (
                      <tr key={asset.id}>
                        <Td>
                          <FlexRow>
                            <StockIcon symbol={asset.symbol} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{asset.symbol}</div>
                              <div style={{ fontSize: '0.85rem', color: theme.darkGray }}>{asset.name}</div>
                            </div>
                          </FlexRow>
                        </Td>
                        <Td>
                          <Badge success={data.totalReturn > 0} danger={data.totalReturn < 0}>
                            {formatPercent(data.totalReturn / 100)}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge success={data.cagr > 0} danger={data.cagr < 0}>
                            {formatPercent(data.cagr / 100)}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge danger>{formatPercent(data.maxDrawdown / 100)}</Badge>
                        </Td>
                        <Td>{data.volatility.toFixed(1)}%</Td>
                        <Td>
                          <Badge 
                            success={data.sharpeRatio > 1} 
                            warning={data.sharpeRatio > 0 && data.sharpeRatio <= 1}
                            danger={data.sharpeRatio <= 0}
                          >
                            {data.sharpeRatio.toFixed(2)}
                          </Badge>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableWrapper>
          </ComparisonTableSection>
        </ComparisonContent>
      </ComparisonGrid>
    </Card>
  );
};

export default Comparison;