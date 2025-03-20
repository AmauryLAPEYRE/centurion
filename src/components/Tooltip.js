import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../utils/theme';
import { FaInfoCircle } from 'react-icons/fa';

const TooltipContainer = styled.div`
  display: inline-flex;
  position: relative;
  margin-left: 5px;
  vertical-align: middle;
`;

const TooltipIcon = styled.span`
  color: ${props => props.color || theme.darkGray};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-size: ${props => props.size || '0.9em'};
  opacity: 0.7;
  transition: ${theme.transitions.fast};
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: calc(100% + 5px);
  left: 50%;
  transform: translateX(-50%) scale(${props => props.show ? 1 : 0.95});
  background-color: ${props => props.secondary ? theme.secondary : '#333'};
  color: white;
  padding: 8px 12px;
  border-radius: ${theme.radius.md};
  font-size: 0.85rem;
  max-width: 250px;
  min-width: 150px;
  z-index: 1000;
  box-shadow: ${theme.shadows.md};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  opacity: ${props => props.show ? 1 : 0};
  transition: all 0.2s ease-in-out;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: ${props => props.secondary ? theme.secondary : '#333'} transparent transparent transparent;
  }
`;

const TooltipTitle = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 3px;
`;

const TooltipDescription = styled.div`
  font-weight: 400;
  font-size: 0.8rem;
  line-height: 1.4;
`;

// Dictionnaire de termes financiers avec explications
const FINANCIAL_TERMS = {
  "dca": {
    title: "Dollar-Cost Averaging (DCA)",
    description: "Stratégie d'investissement qui consiste à investir régulièrement des sommes fixes, indépendamment du prix du marché."
  },
  "roi": {
    title: "Return On Investment (ROI)",
    description: "Mesure de la rentabilité d'un investissement, exprimée en pourcentage du capital initial investi."
  },
  "volatilité": {
    title: "Volatilité",
    description: "Mesure de la variation du prix d'un actif financier sur une période donnée. Une volatilité élevée indique des fluctuations importantes."
  },
  "dividende": {
    title: "Dividende",
    description: "Distribution d'une partie des bénéfices d'une entreprise à ses actionnaires, généralement sous forme de paiement en espèces."
  },
  "cagr": {
    title: "CAGR (Taux de Croissance Annuel Composé)",
    description: "Taux de rendement annualisé lissé sur une période donnée, qui tient compte de l'effet de capitalisation."
  },
  "performance": {
    title: "Performance",
    description: "Mesure des résultats d'un investissement par rapport à son objectif ou à un indice de référence."
  },
  "investissement": {
    title: "Investissement mensuel",
    description: "Montant fixe investi chaque mois dans le cadre d'une stratégie d'investissement régulier."
  },
};

// Composant principal
const Tooltip = ({ term, children, position, color, size, secondary }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const termInfo = FINANCIAL_TERMS[term.toLowerCase()] || { 
    title: term, 
    description: "Terme financier" 
  };
  
  // Gestionnaire pour fermer le tooltip en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);
  
  return (
    <TooltipContainer ref={tooltipRef}>
      {children || (
        <TooltipIcon 
          onClick={() => setIsVisible(!isVisible)}
          color={color}
          size={size}
        >
          <FaInfoCircle />
        </TooltipIcon>
      )}
      
      <TooltipContent show={isVisible} secondary={secondary}>
        <TooltipTitle>{termInfo.title}</TooltipTitle>
        <TooltipDescription>{termInfo.description}</TooltipDescription>
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;