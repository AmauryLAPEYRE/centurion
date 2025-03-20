import React from 'react';
import styled from 'styled-components';
import { 
  FaApple, FaMicrosoft, FaGoogle, FaAmazon, FaFacebookF,
  FaCarAlt, FaMoneyBillWave, FaChartLine, FaIndustry,
  FaHeartbeat, FaShoppingCart, FaOilCan, FaPhone, FaGlobe,
  FaMicrochip, FaLaptop, FaCreditCard, FaTruck, FaUserMd,
  FaBuilding, FaCoffee, FaCar
} from 'react-icons/fa';
import { theme } from '../utils/theme';

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  border-radius: 50%;
  background-color: ${props => props.backgroundColor || 'rgba(0,0,0,0.1)'};
  color: ${props => props.color || 'inherit'};
  margin-right: ${props => props.marginRight || '8px'};
`;

const StockIcon = ({ symbol, size, color, backgroundColor, marginRight }) => {
  const renderIcon = () => {
    // Icônes spécifiques pour les symboles d'actions connus
    switch (symbol) {
      case 'AAPL':
        return <FaApple />;
      case 'MSFT':
        return <FaMicrosoft />;
      case 'GOOGL':
      case 'GOOG':
        return <FaGoogle />;
      case 'AMZN':
        return <FaAmazon />;
      case 'META':
      case 'FB':
        return <FaFacebookF />;
      case 'TSLA':
        return <FaCar />;
      case 'NVDA':
      case 'AMD':
      case 'INTC':
        return <FaMicrochip />;
      case 'JPM':
      case 'V':
      case 'MA':
        return <FaCreditCard />;
      default:
        // Déterminer le type d'industrie par le symbole
        const tech = ['CSCO', 'ADBE', 'CRM', 'NFLX', 'TWTR'];
        const finance = ['BAC', 'WFC', 'C', 'GS', 'MS', 'AXP', 'PYPL'];
        const health = ['JNJ', 'PFE', 'MRK', 'ABBV', 'LLY', 'AMGN', 'UNH', 'CVS', 'MDT'];
        const energy = ['XOM', 'CVX', 'COP', 'EOG', 'SLB', 'OXY', 'BP'];
        const consumer = ['KO', 'PEP', 'PG', 'WMT', 'TGT', 'COST', 'MCD', 'SBUX', 'NKE'];
        const telecom = ['T', 'VZ', 'TMUS', 'CMCSA'];
        const auto = ['F', 'GM', 'TM', 'HMC', 'STLA'];
        
        if (tech.includes(symbol)) return <FaLaptop />;
        if (finance.includes(symbol)) return <FaMoneyBillWave />;
        if (health.includes(symbol)) return <FaHeartbeat />;
        if (energy.includes(symbol)) return <FaOilCan />;
        if (consumer.includes(symbol)) return <FaShoppingCart />;
        if (telecom.includes(symbol)) return <FaPhone />;
        if (auto.includes(symbol)) return <FaCarAlt />;
        
        // Par défaut
        return <FaChartLine />;
    }
  };

  return (
    <IconWrapper 
      size={size} 
      color={color} 
      backgroundColor={backgroundColor}
      marginRight={marginRight}
    >
      {renderIcon()}
    </IconWrapper>
  );
};

export default StockIcon;