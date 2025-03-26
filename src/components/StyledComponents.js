import styled, { keyframes, css } from 'styled-components';
import { theme } from '../utils/theme';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Mixins de media queries
const mediaQueries = {
  mobile: (...args) => css`
    @media (max-width: 767px) {
      ${css(...args)}
    }
  `,
  tablet: (...args) => css`
    @media (min-width: 768px) and (max-width: 1023px) {
      ${css(...args)}
    }
  `,
  desktop: (...args) => css`
    @media (min-width: 1024px) {
      ${css(...args)}
    }
  `
};

// Styles globaux
export const AppContainer = styled.div`
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: ${theme.background};
  color: ${theme.text};
  
  ${mediaQueries.desktop`
    padding: 30px;
  `}
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 30px 0;
  background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
  
  /* Suppression de l'effet de zoom au survol */
  
  ${mediaQueries.mobile`
    padding: 20px 0;
  `}
`;

export const Title = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  
  svg {
    margin-left: 8px;
    animation: ${float} 3s ease-in-out infinite;
  }
  
  ${mediaQueries.mobile`
    font-size: 2.2rem;
  `}
`;

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  text-align: center;
  max-width: 80%;
  
  ${mediaQueries.mobile`
    font-size: 1rem;
    max-width: 90%;
  `}
`;

export const Card = styled.div`
  background-color: ${theme.cardBackground};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  padding: 25px;
  margin-bottom: 25px;
  transition: ${theme.transitions.default};
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
  overflow: hidden;
  
  /* Suppression des effets de hover inutiles */
  /* Conserver l'effet d'ombrage mais supprimer le déplacement vertical pour réduire les distractions */
  &:hover {
    box-shadow: ${theme.shadows.md};
  }
  
  ${props => props.interactive && css`
    &:hover {
      box-shadow: ${theme.shadows.lg};
      transform: translateY(-3px);
    }
  `}
  
  ${props => props.compact && css`
    padding: 20px;
    
    ${CardTitle} {
      margin-bottom: 15px;
      font-size: 1.2rem;
    }
  `}
  
  ${mediaQueries.mobile`
    padding: 15px;
    margin-bottom: 15px;
  `}
  
  ${mediaQueries.desktop`
    &.column-layout {
      display: flex;
      flex-direction: column;
    }
    
    &.row-layout {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 20px;
    }
  `}
`;

export const CardTitle = styled.h2`
  color: ${theme.secondary};
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${theme.gray};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    color: ${theme.primary};
  }
  
  ${mediaQueries.mobile`
    font-size: 1.3rem;
    margin-bottom: 15px;
  `}
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  ${mediaQueries.desktop`
    &.side-by-side {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
    }
  `}
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  ${props => props.horizontal && css`
    flex-direction: row;
    align-items: center;
    
    ${Label} {
      margin-right: 10px;
      min-width: 150px;
    }
  `}
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${theme.dark};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: ${theme.primary};
  }
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid ${theme.gray};
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  transition: ${theme.transitions.default};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }
  
  &:hover:not(:disabled) {
    border-color: ${theme.primary};
  }
  
  &:disabled {
    background-color: ${theme.light};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

export const Select = styled.select`
  padding: 12px;
  border: 1px solid ${theme.gray};
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  transition: ${theme.transitions.default};
  appearance: none;
  background-color: white;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }
  
  &:hover:not(:disabled) {
    border-color: ${theme.primary};
  }
  
  &:disabled {
    background-color: ${theme.light};
    cursor: not-allowed;
  }
`;

// Conserver les effets de hover sur les éléments interactifs comme les boutons
export const Button = styled.button`
  background-color: ${props => 
    props.secondary ? theme.secondary :
    props.success ? theme.success :
    props.danger ? theme.danger :
    props.warning ? theme.warning :
    theme.primary
  };
  color: white;
  padding: ${props => props.small ? '8px 16px' : '12px 20px'};
  border: none;
  border-radius: ${theme.radius.md};
  font-size: ${props => props.small ? '0.9rem' : '1rem'};
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  svg {
    margin-right: ${props => props.iconOnly ? '0' : '8px'};
  }
  
  &:hover {
    background-color: ${props => 
      props.secondary ? '#2a0c7c' :
      props.success ? '#3bacb6' :
      props.danger ? '#d91a6d' :
      props.warning ? '#e27b06' :
      '#2945c6'
    };
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.sm};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: ${theme.gray};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    left: -100%;
    top: 0;
    transform: skewX(-20deg);
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    left: 100%;
  }
  
  ${props => props.active && css`
    background-color: ${
      props.secondary ? '#2a0c7c' :
      props.success ? '#3bacb6' :
      props.danger ? '#d91a6d' :
      props.warning ? '#e27b06' :
      '#2945c6'
    };
    box-shadow: ${theme.shadows.sm};
  `}
`;

export const FlexRow = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: ${props => props.alignItems || 'center'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  
  ${mediaQueries.mobile`
    gap: 10px;
  `}
`;

// Modifier l'effet de hover pour les éléments de la liste des stocks
export const StockItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background-color: ${theme.light};
  border-radius: ${theme.radius.md};
  border-left: 3px solid ${props => props.color || theme.primary};
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.sm};
  animation: ${fadeInLeft} 0.3s ease;
  
  /* Conserver l'effet de hover mais le rendre plus subtil */
  &:hover {
    background-color: rgba(248, 249, 250, 0.8);
  }
`;

export const RemoveButton = styled.button`
  background-color: transparent;
  color: ${theme.danger};
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: rgba(247, 37, 133, 0.1);
    transform: scale(1.1);
  }
`;

export const ResultsContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
  
  & > * {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    margin-top: 20px;
    gap: 15px;
  }
`;

export const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  ${mediaQueries.mobile`
    grid-template-columns: 1fr;
    gap: 15px;
  `}
  
  ${mediaQueries.desktop`
    &.compact {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
  `}
`;

// Modifier le comportement des cartes de résumé
export const SummaryCard = styled.div`
  background-color: white;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  padding: 20px;
  border-top: 4px solid ${props => props.color || theme.primary};
  transition: ${theme.transitions.default};
  animation: ${fadeInRight} 0.3s ease;
  animation-delay: ${props => props.index * 0.1}s;
  animation-fill-mode: both;
  
  /* Suppression de l'effet de déplacement au survol */
  &:hover {
    box-shadow: ${theme.shadows.md};
  }
  
  ${props => props.highlighted && css`
    &::after {
      content: '★';
      position: absolute;
      top: 10px;
      right: 10px;
      color: ${theme.warning};
      font-size: 1.5rem;
    }
  `}
`;

export const SummaryTitle = styled.h3`
  color: ${theme.darkGray};
  font-size: 1rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: ${props => props.iconColor || theme.primary};
  }
`;

export const SummaryValue = styled.p`
  color: ${theme.dark};
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  
  /* Comportement de hover conservé pour une meilleure lisibilité des valeurs */
  &:hover {
    color: ${theme.primary};
  }
`;

export const SummarySubValue = styled.p`
  color: ${props => props.positive ? 'green' : props.negative ? 'red' : theme.darkGray};
  font-size: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`;

export const TabsContainer = styled.div`
  margin-top: 25px;
`;

export const TabsList = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.gray};
  margin-bottom: 25px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.light};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.gray};
    border-radius: 10px;
  }
`;

// Conserver les effets de hover sur les onglets qui sont interactifs
export const Tab = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? theme.primary : theme.darkGray};
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: ${theme.transitions.default};
  
  svg {
    margin-right: 8px;
    transition: transform 0.2s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.active ? theme.primary : 'transparent'};
    transition: ${theme.transitions.default};
  }
  
  &:hover {
    color: ${theme.primary};
    
    svg {
      transform: translateY(-2px);
    }
    
    &::after {
      background-color: ${props => props.active ? theme.primary : theme.gray};
    }
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.light};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.gray};
    border-radius: 10px;
    
    &:hover {
      background-color: ${theme.darkGray};
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
`;

export const Th = styled.th`
  padding: 15px;
  text-align: left;
  background-color: ${theme.light};
  border-bottom: 2px solid ${theme.gray};
  color: ${theme.darkGray};
  position: sticky;
  top: 0;
  font-weight: 600;
  transition: ${theme.transitions.fast};
  
  /* Effet de hover subtil pour indiquer la possibilité de tri */
  &:hover {
    background-color: rgba(67, 97, 238, 0.05);
  }
`;

export const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid ${theme.gray};
  transition: ${theme.transitions.fast};
  
  /* Effet de hover sur la ligne conservé pour une meilleure lisibilité */
  tr:hover & {
    background-color: ${theme.light};
  }
`;

export const TrendIcon = styled.span`
  color: ${props => props.positive ? 'green' : 'red'};
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: ${theme.radius.sm};
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => {
    if (props.success) return 'rgba(76, 201, 240, 0.2)';
    if (props.danger) return 'rgba(247, 37, 133, 0.2)';
    if (props.warning) return 'rgba(248, 150, 30, 0.2)';
    if (props.info) return 'rgba(67, 97, 238, 0.2)';
    return 'rgba(108, 117, 125, 0.2)';
  }};
  color: ${props => {
    if (props.success) return theme.success;
    if (props.danger) return theme.danger;
    if (props.warning) return theme.warning;
    if (props.info) return theme.primary;
    return theme.darkGray;
  }};
  
  svg {
    margin-right: 4px;
  }
  
  &:hover {
    filter: brightness(0.95);
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${props => props.color || theme.primary};
  animation: ${spin} 1s ease-in-out infinite;
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${theme.gray};
  margin: 20px 0;
`;

// Nouveaux composants

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 12}, 1fr);
  gap: ${props => props.gap || '20px'};
  margin-bottom: ${props => props.marginBottom || '0'};
  
  ${mediaQueries.mobile`
    grid-template-columns: 1fr;
  `}
  
  ${mediaQueries.tablet`
    grid-template-columns: repeat(${props => Math.min(props.columns || 12, 6)}, 1fr);
  `}
`;

export const GridItem = styled.div`
  grid-column: span ${props => props.span || 1};
  
  ${mediaQueries.mobile`
    grid-column: span 1;
  `}
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  gap: ${props => props.gap || '20px'};
  
  ${mediaQueries.desktop`
    flex-direction: ${props => props.desktopDirection || props.direction || 'row'};
    
    & > * {
      flex: ${props => props.equalWidth ? 1 : 'auto'};
    }
  `}
`;

export const Skeleton = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  min-height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.marginBottom || '0'};
  border-radius: ${theme.radius.sm};
  animation: ${shimmer} 2s infinite linear;
`;

export const ProgressiveContainer = styled.div`
  opacity: ${props => props.loaded ? 1 : 0.3};
  filter: blur(${props => props.loaded ? 0 : '2px'});
  transition: opacity 0.3s ease, filter 0.3s ease;
`;

export const StaggerContainer = styled.div`
  & > * {
    animation: ${fadeIn} 0.5s ease backwards;
  }
  
  ${Array.from({ length: 20 }).map((_, i) => css`
    & > *:nth-child(${i + 1}) {
      animation-delay: ${i * 0.05}s;
    }
  `)}
`;

export const AnimatedNumber = styled.span`
  display: inline-block;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${theme.primary}, transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

export const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  
  &:hover::before {
    content: "${props => props.text}";
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 1000;
  }
  
  &:hover::after {
    content: '';
    position: absolute;
    bottom: calc(100% - 5px);
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
  }
`;