import React from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { theme } from '../utils/theme';
import { formatCurrency } from '../utils/calculationUtils';

const SparklineWrapper = styled.div`
  height: ${props => props.height || '50px'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '5px 0'};
  position: relative;
`;

const SparkValue = styled.div`
  position: absolute;
  top: 50%;
  ${props => props.position === 'left' ? 'left: 5px;' : 'right: 5px;'}
  transform: translateY(-50%);
  font-size: ${props => props.fontSize || '0.8rem'};
  font-weight: ${props => props.fontWeight || '600'};
  color: ${props => props.color || theme.darkGray};
  background-color: rgba(255, 255, 255, 0.7);
  padding: 2px 4px;
  border-radius: 3px;
  z-index: 2;
`;

const StartValue = styled.div`
  position: absolute;
  bottom: 2px;
  left: 0;
  font-size: 0.7rem;
  color: ${theme.darkGray};
  opacity: 0.7;
`;

const EndValue = styled.div`
  position: absolute;
  bottom: 2px;
  right: 0;
  font-size: 0.7rem;
  color: ${theme.darkGray};
  opacity: 0.7;
`;

const PercentChange = styled.div`
  position: absolute;
  top: 2px;
  right: 0;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${props => props.positive ? 'green' : 'red'};
  background-color: ${props => props.positive ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  padding: 1px 4px;
  border-radius: 3px;
`;

const DataPoint = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props => props.color || theme.primary};
  transform: translate(-50%, -50%);
  z-index: 1;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.color || theme.primary};
    opacity: 0.3;
  }
  
  &:hover {
    &::after {
      width: 16px;
      height: 16px;
    }
  }
`;

const DataPointTooltip = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  white-space: nowrap;
  z-index: 3;
  display: ${props => props.show ? 'block' : 'none'};
`;

const ReferenceLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: ${props => props.color || theme.gray};
  opacity: 0.5;
  top: ${props => props.position}%;
`;

/**
 * Composant Sparkline pour afficher des mini graphiques
 * @param {Object} props
 * @param {Array} props.data - Données du graphique
 * @param {string} props.dataKey - Clé à utiliser dans les données
 * @param {string} props.type - Type de graphique ('line' ou 'area')
 * @param {string} props.color - Couleur principale du graphique
 * @param {number} props.height - Hauteur du sparkline
 * @param {boolean} props.showValues - Afficher les valeurs de début/fin
 * @param {boolean} props.showChange - Afficher le % de changement
 * @param {boolean} props.showLabels - Afficher les étiquettes
 * @param {boolean} props.fillBelow - Remplir la zone sous la ligne
 * @param {array} props.highlights - Points à mettre en évidence [{ index, color, label }]
 * @param {object} props.reference - Ligne de référence { value, color }
 */
const Sparkline = ({
  data = [],
  dataKey = 'value',
  type = 'line',
  color = theme.primary,
  height = '50px',
  showValues = false,
  showChange = false,
  showLabels = false,
  fillBelow = true,
  highlights = [],
  reference = null,
  formatter = formatCurrency
}) => {
  if (!data || data.length === 0) return null;
  
  const firstValue = data[0][dataKey];
  const lastValue = data[data.length - 1][dataKey];
  const percentChange = ((lastValue - firstValue) / firstValue) * 100;
  const isPositive = percentChange >= 0;
  
  const getHighlightPosition = (index) => {
    const position = (index / (data.length - 1)) * 100;
    return position;
  };
  
  const getReferenceLinePosition = () => {
    if (!reference || !reference.value) return 50;
    
    // Trouver les valeurs min et max
    let minValue = data[0][dataKey];
    let maxValue = data[0][dataKey];
    
    data.forEach(item => {
      if (item[dataKey] < minValue) minValue = item[dataKey];
      if (item[dataKey] > maxValue) maxValue = item[dataKey];
    });
    
    // Calculer la position en pourcentage
    const range = maxValue - minValue;
    const position = ((maxValue - reference.value) / range) * 100;
    
    return Math.max(0, Math.min(100, position));
  };
  
  return (
    <SparklineWrapper height={height}>
      {reference && (
        <ReferenceLine
          position={getReferenceLinePosition()}
          color={reference.color || theme.gray}
        />
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={fillBelow ? `${color}20` : 'transparent'}
              isAnimationActive={false}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
      
      {showValues && (
        <>
          <StartValue>{formatter(firstValue)}</StartValue>
          <EndValue>{formatter(lastValue)}</EndValue>
        </>
      )}
      
      {showChange && (
        <PercentChange positive={isPositive}>
          {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
        </PercentChange>
      )}
      
      {highlights.map((highlight, index) => (
        <React.Fragment key={index}>
          <DataPoint
            left={getHighlightPosition(highlight.index)}
            top={25} // Centre approximatif, à ajuster si nécessaire
            color={highlight.color || color}
          >
            <DataPointTooltip show={highlight.label}>
              {highlight.label}
            </DataPointTooltip>
          </DataPoint>
        </React.Fragment>
      ))}
    </SparklineWrapper>
  );
};

export default Sparkline;