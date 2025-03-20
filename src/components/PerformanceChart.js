import React, { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, ReferenceArea, Brush
} from 'recharts';
import { Card, CardTitle, Button, FlexRow } from './StyledComponents';
import { formatCurrency, formatDate, formatPercent } from '../utils/calculationUtils';
import { getStockColor } from '../utils/theme';
import { FaChartArea, FaChartLine, FaSearch, FaCalendarAlt, FaPlus, FaMinus } from 'react-icons/fa';
import StockIcon from './StockIcon';
import styled from 'styled-components';
import { theme } from '../utils/theme';
import InfoTooltip from './Tooltip';

// Styles spécifiques
const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.expanded ? '500px' : '400px'};
  transition: height 0.3s ease;
`;

const EventMarker = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => 
    props.severity === 'major' ? theme.danger : 
    props.severity === 'medium' ? theme.warning : 
    theme.info};
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
  cursor: pointer;
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
`;

const ChartTypeButton = styled(Button)`
  padding: 8px 12px;
  font-size: 0.9rem;
`;

const ZoomControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 5;
`;

const ZoomButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${theme.gray};
  color: ${theme.darkGray};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${theme.shadows.sm};
  transition: ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.light};
    transform: scale(1.1);
  }
`;

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
            <span style={{ fontWeight: 'bold', color: 
              payload[0].payload.eventSeverity === 'major' ? theme.danger : 
              payload[0].payload.eventSeverity === 'medium' ? theme.warning : 
              theme.primary 
            }}>
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
  { date: '2008-09-15', name: 'Crise financière de 2008', description: 'Faillite de Lehman Brothers' },
  { date: '2020-03-16', name: 'Krach lié au COVID-19', description: 'Chute brutale des marchés suite aux mesures de confinement' },
  { date: '2022-01-24', name: 'Correction de 2022', description: 'Forte correction des marchés liée à l\'inflation et aux tensions géopolitiques' }
];

const PerformanceChart = ({ performanceData, selectedStocks }) => {
  const [chartType, setChartType] = useState('area');
  const [displayDividends, setDisplayDividends] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [zoomDomain, setZoomDomain] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  
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
  
  // Fonction pour zoomer sur une période
  const handleZoom = (type) => {
    if (chartData.length === 0) return;
    
    const lastDate = new Date(chartData[chartData.length - 1].date);
    let startDate;
    
    switch (type) {
      case 'all':
        setZoomDomain(null);
        break;
      case '1y':
        startDate = new Date(lastDate);
        startDate.setFullYear(lastDate.getFullYear() - 1);
        setZoomDomain([startDate.toISOString().split('T')[0], lastDate.toISOString().split('T')[0]]);
        break;
      case '3y':
        startDate = new Date(lastDate);
        startDate.setFullYear(lastDate.getFullYear() - 3);
        setZoomDomain([startDate.toISOString().split('T')[0], lastDate.toISOString().split('T')[0]]);
        break;
      case '5y':
        startDate = new Date(lastDate);
        startDate.setFullYear(lastDate.getFullYear() - 5);
        setZoomDomain([startDate.toISOString().split('T')[0], lastDate.toISOString().split('T')[0]]);
        break;
      default:
        setZoomDomain(null);
    }
  };
  
  // Fonction pour trouver les coordonnées des événements sur le graphique
  const getEventCoordinates = () => {
    if (!chartData.length) return [];
    
    const events = [];
    chartData.forEach((dataPoint, index) => {
      if (dataPoint.event) {
        // Estimer la position sur le graphique (cette logique devrait être ajustée selon la taille du graphique)
        const xPos = (index / (chartData.length - 1)) * 100; // En pourcentage de la largeur
        events.push({
          date: dataPoint.date,
          event: dataPoint.event,
          severity: dataPoint.eventSeverity,
          x: xPos,
          y: 50, // Position verticale arbitraire
          dataPoint
        });
      }
    });
    
    return events;
  };
  
  const eventCoordinates = getEventCoordinates();
  
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
        </ControlGroup>
        
        <ControlGroup>
          <ChartTypeButton onClick={() => handleZoom('all')}>Tout</ChartTypeButton>
          <ChartTypeButton onClick={() => handleZoom('5y')}>5 ans</ChartTypeButton>
          <ChartTypeButton onClick={() => handleZoom('3y')}>3 ans</ChartTypeButton>
          <ChartTypeButton onClick={() => handleZoom('1y')}>1 an</ChartTypeButton>
          <ChartTypeButton onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Réduire' : 'Agrandir'}
          </ChartTypeButton>
        </ControlGroup>
      </ControlsContainer>
      
      <ChartContainer expanded={expanded}>
        <ResponsiveContainer>
          {chartType === 'area' ? (
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
                domain={zoomDomain || ['dataMin', 'dataMax']}
              />
              <YAxis 
                tickFormatter={value => formatCurrency(value)}
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
              
              {/* Ajouter des repères pour les événements majeurs */}
              {marketCrashes.map((crash, index) => (
                <ReferenceLine 
                  key={index}
                  x={crash.date}
                  stroke={theme.danger}
                  strokeDasharray="3 3"
                  label={{
                    value: crash.name,
                    position: 'insideTopRight',
                    fill: theme.danger,
                    fontSize: 12
                  }}
                />
              ))}
              
              {/* Brosse pour le zoom interactif */}
              {expanded && (
                <Brush 
                  dataKey="date" 
                  height={30} 
                  stroke={theme.primary}
                  tickFormatter={value => {
                    const date = new Date(value);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  }}
                />
              )}
            </AreaChart>
          ) : (
            <LineChart
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
                domain={zoomDomain || ['dataMin', 'dataMax']}
              />
              <YAxis 
                tickFormatter={value => formatCurrency(value)}
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
              
              {/* Ajouter des repères pour les événements majeurs */}
              {marketCrashes.map((crash, index) => (
                <ReferenceLine 
                  key={index}
                  x={crash.date}
                  stroke={theme.danger}
                  strokeDasharray="3 3"
                  label={{
                    value: crash.name,
                    position: 'insideTopRight',
                    fill: theme.danger,
                    fontSize: 12
                  }}
                />
              ))}
              
              {/* Brosse pour le zoom interactif */}
              {expanded && (
                <Brush 
                  dataKey="date" 
                  height={30} 
                  stroke={theme.primary}
                  tickFormatter={value => {
                    const date = new Date(value);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  }}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
        
        {/* Marqueurs d'événements */}
        {eventCoordinates.map((eventData, index) => (
          <React.Fragment key={`event-${index}`}>
            <EventMarker 
              left={`${eventData.x}%`}
              top={eventData.y}
              severity={eventData.severity}
              onMouseEnter={() => setHoveredEvent(eventData)}
              onMouseLeave={() => setHoveredEvent(null)}
            />
            
            {hoveredEvent && hoveredEvent.date === eventData.date && (
              <EventTooltip
                show={true}
                left={`${eventData.x}%`}
                top={eventData.y}
              >
                <strong>{eventData.event}</strong>
                <div>{formatDate(eventData.date)}</div>
              </EventTooltip>
            )}
          </React.Fragment>
        ))}
        
        {/* Contrôles de zoom */}
        <ZoomControls>
          <ZoomButton onClick={() => setExpanded(true)}>
            <FaSearch />
          </ZoomButton>
          <ZoomButton onClick={() => setZoomDomain(null)}>
            <FaCalendarAlt />
          </ZoomButton>
          <ZoomButton onClick={() => handleZoom('1y')}>
            1Y
          </ZoomButton>
        </ZoomControls>
      </ChartContainer>
    </Card>
  );
};

export default PerformanceChart;