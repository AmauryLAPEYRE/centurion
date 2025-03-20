import React from 'react';
import styled from 'styled-components';
import { theme } from '../utils/theme';
import { FaChartLine, FaHistory, FaBalanceScale, FaGraduationCap, FaQuestionCircle } from 'react-icons/fa';

const TabsContainer = styled.div`
  margin-bottom: 25px;
  background: ${theme.light};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  position: sticky;
  top: 10px;
  z-index: 100;
  transition: ${theme.transitions.default};
  
  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

const TabList = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100%;
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.light};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.gray};
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
`;

const Tab = styled.button`
  padding: 15px;
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
  min-width: 100px;
  justify-content: center;
  
  svg {
    margin-right: 8px;
    font-size: 1rem;
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
    transform: scaleX(${props => props.active ? 1 : 0});
    transform-origin: center;
  }
  
  &:hover {
    color: ${theme.primary};
    background-color: ${props => props.active ? 'white' : 'rgba(67, 97, 238, 0.05)'};
    
    svg {
      transform: translateY(-2px);
    }
    
    &::after {
      background-color: ${props => props.active ? theme.primary : theme.gray};
      transform: scaleX(1);
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
    min-width: auto;
    flex: 1;
    
    svg {
      margin-right: 5px;
    }
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
  animation: fadeIn 0.3s ease;
  width: 100%;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const getTabIndex = (activeTab) => {
  const tabMap = {
    'simulator': 0,
    'history': 1,
    'comparison': 2,
    'education': 3,
    'help': 4
  };
  return tabMap[activeTab] !== undefined ? tabMap[activeTab] : 0;
};

const TabNavigation = ({ activeTab, setActiveTab, children }) => {
  const tabIndex = getTabIndex(activeTab);
  
  return (
    <>
      <TabsContainer>
        <TabList>
          <Tab 
            active={activeTab === 'simulator'} 
            onClick={() => setActiveTab('simulator')}
          >
            <FaChartLine /> Simulateur
          </Tab>
          <Tab 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> Historique
          </Tab>
          <Tab 
            active={activeTab === 'comparison'} 
            onClick={() => setActiveTab('comparison')}
          >
            <FaBalanceScale /> Comparaison
          </Tab>
          <Tab 
            active={activeTab === 'education'} 
            onClick={() => setActiveTab('education')}
          >
            <FaGraduationCap /> Éducation
          </Tab>
          <Tab 
            active={activeTab === 'help'} 
            onClick={() => setActiveTab('help')}
          >
            <FaQuestionCircle /> Aide
          </Tab>
        </TabList>
      </TabsContainer>
      
      {React.Children.map(children, (child, index) => (
        <TabContent active={index === tabIndex}>
          {child}
        </TabContent>
      ))}
    </>
  );
};

export default TabNavigation;