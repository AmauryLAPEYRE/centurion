import styled, { keyframes } from 'styled-components';
import { theme } from '../utils/theme';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styles globaux
export const AppContainer = styled.div`
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: ${theme.background};
  color: ${theme.text};
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  padding: 30px 0;
  background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  color: white;
`;

export const Title = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  text-align: center;
  max-width: 80%;
`;

export const Card = styled.div`
  background-color: ${theme.cardBackground};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  padding: 25px;
  margin-bottom: 25px;
  transition: ${theme.transitions.default};
  animation: ${fadeIn} 0.3s ease-out;
  
  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-3px);
  }
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
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  
  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }
`;

export const Select = styled.select`
  padding: 12px;
  border: 1px solid ${theme.gray};
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  transition: ${theme.transitions.default};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }
`;

export const Button = styled.button`
  background-color: ${props => props.secondary ? theme.secondary : theme.primary};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: ${props => props.iconOnly ? '0' : '8px'};
  }
  
  &:hover {
    background-color: ${props => props.secondary ? '#2a0c7c' : '#2945c6'};
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
`;

export const FlexRow = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

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
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
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
`;

export const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const SummaryCard = styled.div`
  background-color: white;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  padding: 20px;
  border-top: 4px solid ${props => props.color || theme.primary};
  transition: ${theme.transitions.default};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.lg};
  }
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
  
  svg {
    margin-right: 8px;
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
    
    &::after {
      background-color: ${props => props.active ? theme.primary : theme.gray};
    }
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
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
`;

export const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid ${theme.gray};
  transition: ${theme.transitions.fast};
  
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
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${theme.primary};
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${theme.gray};
  margin: 20px 0;
`;