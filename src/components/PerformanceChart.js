import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Card, CardTitle, FlexRow } from './StyledComponents';
import { formatCurrency, formatDate, formatPercent } from '../utils/calculationUtils';
import { getStockColor } from '../utils/theme';
import { FaChartArea, FaChartLine, FaBell } from 'react-icons/fa';
import StockIcon from './StockIcon';
import styled from 'styled-components';
import { theme } from '../utils/theme';
import InfoTooltip from './Tooltip';

// Styles spécifiques
const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  transition: height 0.3s ease;
`;

const EventMarker = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${theme.primary};
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
  cursor: pointer;
  
  /* Animation de pulsation pour attirer l'attention */
  animation: pulse 2s infinite;
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const EventTooltip = styled.div`
  position: absolute;
  top: ${props => props.top - 70}px;
  left: ${props => props.left}px;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  z-index: 100;
  max-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ChartTypeButton = styled.button`
  padding: 8px 16px;
  font-size: 0.9rem;
  background-color: ${props => props.active ? theme.primary : 'white'};
  color: ${props => props.active ? 'white' : theme.darkGray};
  border: 1px solid ${props => props.active ? theme.primary : theme.gray};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? theme.primary : theme.light};
    transform: translateY(-2px);
  }
`;

const formatYAxisTick = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k €`;
  } else {
    return `${value} €`;
  }
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
        
        {/* Afficher l'événement s'il existe */}
        {payload[0].payload.event && (
          <div style={{ 
            marginTop: '10px',
            padding: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px'
          }}>
            <span style={{ fontWeight: 'bold', color: theme.primary }}>
              📊 {payload[0].payload.event}
            </span>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

const marketCrashes = [
  { date: '2008-09-15', name: 'Crise financière de 2008', description: 'Faillite de Lehman Brothers', severity: 'major' },
  { date: '2010-05-06', name: 'Flash Crash', description: 'Chute soudaine et reprise des marchés', severity: 'medium' },
  { date: '2011-08-05', name: 'Dégradation de la note de crédit US', description: 'Standard & Poor\'s dégrade la note des États-Unis', severity: 'medium' },
  { date: '2015-08-24', name: 'Lundi noir chinois', description: 'Forte baisse des marchés suite au ralentissement chinois', severity: 'medium' },
  { date: '2016-06-24', name: 'Brexit', description: 'Résultat du référendum britannique sur la sortie de l\'UE', severity: 'medium' },
  { date: '2018-12-24', name: 'Correction du marché', description: 'Forte baisse des marchés fin 2018', severity: 'medium' },
  { date: '2020-03-16', name: 'Krach lié au COVID-19', description: 'Chute brutale des marchés suite aux mesures de confinement', severity: 'major' },
  { date: '2022-01-24', name: 'Correction de 2022', description: 'Forte correction des marchés liée à l\'inflation et aux tensions géopolitiques', severity: 'medium' }
];

const PerformanceChart = ({ performanceData, selectedStocks }) => {
  const [chartType, setChartType] = useState('area');
  const [displayDividends, setDisplayDividends] = useState(false);
  const [showEvents, setShowEvents] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const chartRef = React.useRef(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const [eventPositions, setEventPositions] = useState([]);
  
  // Transformer les données pour le graphique
  const chartData = performanceData.length > 0 ? performanceData[0].map((item, index) => {
    const dataPoint = { date: item.date };
    
    performanceData.forEach((stockData, stockIndex) => {
      if (stockData[index]) {
        const stockSymbol = selectedStocks[stockIndex].symbol;
        dataPoint[stockSymbol] = stockData[index].portfolioValue;
        
        // Ajouter les dividendes si activés
        if (displayDividends && stockData[index].dividend > 0) {
          dataPoint[`${stockSymbol}_dividend`] = stockData[index].dividend;
        }
        
        // Ajouter les événements s'ils existent
        if (stockData[index].event) {
          dataPoint.event = stockData[index].event;
          dataPoint.eventSeverity = stockData[index].eventSeverity;
        }
      }
    });
    
    return dataPoint;
  }) : [];
  
  // Déterminer les dimensions du graphique après montage
  useEffect(() => {
    if (chartRef.current) {
      const updateDimensions = () => {
        const chartElem = chartRef.current;
        if (chartElem) {
          const { width, height } = chartElem.getBoundingClientRect();
          setChartDimensions({ width, height });
        }
      };
      
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [chartRef.current, performanceData]);
  
  // Calculer les positions des événements une fois que nous avons les dimensions
  useEffect(() => {
    if (chartDimensions.width > 0 && chartDimensions.height > 0 && chartData.length > 0) {
      calculateEventPositions();
    }
  }, [chartDimensions, chartData, showEvents]);
  
  // Fonction pour calculer les positions des événements
  const calculateEventPositions = () => {
    if (!chartRef.current || chartData.length === 0) return;
    
    const { width, height } = chartDimensions;
    const chartStart = new Date(chartData[0].date);
    const chartEnd = new Date(chartData[chartData.length - 1].date);
    const timeRange = chartEnd.getTime() - chartStart.getTime();
    
    // Calculer la position verticale en fonction de la valeur du portefeuille
    const yValues = chartData.map(dataPoint => {
      let maxValue = 0;
      selectedStocks.forEach(stock => {
        if (dataPoint[stock.symbol] > maxValue) {
          maxValue = dataPoint[stock.symbol];
        }
      });
      return maxValue;
    });
    
    const maxYValue = Math.max(...yValues);
    
    // Calculer les positions pour les événements du marché
    const positions = marketCrashes
      .filter(crash => {
        const crashDate = new Date(crash.date);
        return crashDate >= chartStart && crashDate <= chartEnd;
      })
      .map(crash => {
        const crashDate = new Date(crash.date);
        const timePosition = (crashDate.getTime() - chartStart.getTime()) / timeRange;
        let xPos = Math.max(10, Math.min(width - 10, timePosition * width));
        
        // Trouver la date la plus proche dans les données
        let closestIndex = 0;
        let smallestDiff = Number.MAX_VALUE;
        
        chartData.forEach((dataPoint, index) => {
          const dataDate = new Date(dataPoint.date);
          const diff = Math.abs(dataDate.getTime() - crashDate.getTime());
          if (diff < smallestDiff) {
            smallestDiff = diff;
            closestIndex = index;
          }
        });
        
        // Obtenir la valeur Y à cette date
        let yValue = 0;
        if (closestIndex >= 0 && closestIndex < chartData.length) {
          selectedStocks.forEach(stock => {
            if (chartData[closestIndex][stock.symbol] > yValue) {
              yValue = chartData[closestIndex][stock.symbol];
            }
          });
        }
        
        // Calculer la position Y proportionnelle, en gardant une marge
        const yPosition = Math.max(20, Math.min(height - 20, (1 - yValue / maxYValue) * height));
        
        return {
          ...crash,
          x: xPos,
          y: yPosition,
          value: yValue
        };
      });
    
    setEventPositions(positions);
  };
  
  // Déterminer le domaine Y pour un meilleur affichage
  const getYDomain = () => {
    if (chartData.length === 0) return [0, 'auto'];
    
    let maxValue = 0;
    chartData.forEach(dataPoint => {
      selectedStocks.forEach(stock => {
        if (dataPoint[stock.symbol] > maxValue) {
          maxValue = dataPoint[stock.symbol];
        }
      });
    });
    
    // Ajouter 10% au dessus pour l'espace visuel
    return [0, maxValue * 1.1];
  };
  
  return (
    <Card>
      <CardTitle><FaChartArea /> Évolution de la valeur du portefeuille</CardTitle>
      
      <ControlsContainer>
        <ControlGroup>
          <ChartTypeButton 
            onClick={() => setChartType('area')}
            active={chartType === 'area'}
          >
            <FaChartArea /> Aire
          </ChartTypeButton>
          <ChartTypeButton 
            onClick={() => setChartType('line')}
            active={chartType === 'line'}
          >
            <FaChartLine /> Ligne
          </ChartTypeButton>
          <ChartTypeButton 
            onClick={() => setDisplayDividends(!displayDividends)}
            active={displayDividends}
          >
            Dividendes
          </ChartTypeButton>
          <ChartTypeButton 
            onClick={() => setShowEvents(!showEvents)}
            active={showEvents}
          >
            <FaBell /> Événements
          </ChartTypeButton>
        </ControlGroup>
      </ControlsContainer>
      
      <ChartContainer ref={chartRef}>
        <ResponsiveContainer>
          {chartType === 'area' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
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
                tickFormatter={formatYAxisTick}
                stroke="#6c757d"
                domain={getYDomain()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value, entry) => {
                  // Ne pas afficher les entrées de dividendes dans la légende
                  if (value.includes('_dividend')) return null;
                  
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
          ) : (
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
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
                tickFormatter={formatYAxisTick}
                stroke="#6c757d"
                domain={getYDomain()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value, entry) => {
                  // Ne pas afficher les entrées de dividendes dans la légende
                  if (value.includes('_dividend')) return null;
                  
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
                <Line 
                  key={stock.symbol}
                  type="monotone"
                  dataKey={stock.symbol}
                  name={stock.name}
                  stroke={getStockColor(index)}
                  dot={{ r: 0 }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
        
        {/* Marqueurs d'événements interactifs */}
        {showEvents && eventPositions.map((eventData, index) => (
          <React.Fragment key={`event-${index}`}>
            <EventMarker 
              left={eventData.x}
              top={eventData.y} 
              onMouseEnter={() => setHoveredEvent(eventData)}
              onMouseLeave={() => setHoveredEvent(null)}
            />
            
            {hoveredEvent && hoveredEvent.date === eventData.date && (
              <EventTooltip
                show={true}
                left={eventData.x}
                top={eventData.y}
              >
                <strong>{eventData.name}</strong>
                <div>{formatDate(eventData.date)}</div>
                {eventData.description && (
                  <div style={{ marginTop: 5, fontSize: '0.8rem', opacity: 0.9 }}>
                    {eventData.description}
                  </div>
                )}
              </EventTooltip>
            )}
          </React.Fragment>
        ))}
      </ChartContainer>
    </Card>
  );
};

export default PerformanceChart;