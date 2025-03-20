import React, { useState } from 'react';
import { 
  Card, 
  CardTitle, 
  TabsContainer,
  TabsList,
  Tab
} from './StyledComponents';
import PerformanceTable from './PerformanceTable';
import { FaTable } from 'react-icons/fa';
import StockIcon from './StockIcon';
import styled from 'styled-components';
import { theme } from '../utils/theme';

const FullWidthCard = styled(Card)`
  width: 100%;
  overflow: visible;
`;

const DetailsTabs = styled(TabsList)`
  overflow-x: auto;
  flex-wrap: nowrap;
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

const ScrollableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const PerformanceDetails = ({ performanceData, selectedStocks }) => {
  const [activeStockIndex, setActiveStockIndex] = useState(0);
  
  return (
    <FullWidthCard>
      <CardTitle><FaTable /> Détails des investissements</CardTitle>
      <TabsContainer>
        <DetailsTabs>
          {selectedStocks.map((stock, index) => (
            <Tab 
              key={index}
              active={index === activeStockIndex}
              onClick={() => setActiveStockIndex(index)}
            >
              <StockIcon 
                symbol={stock.symbol} 
                size="18px" 
                color={index === activeStockIndex ? '#4361ee' : '#6c757d'}
              />
              {stock.symbol}
            </Tab>
          ))}
        </DetailsTabs>
        
        <ScrollableContainer>
          <PerformanceTable 
            performanceData={performanceData}
            selectedStocks={selectedStocks}
            activeStockIndex={activeStockIndex}
          />
        </ScrollableContainer>
      </TabsContainer>
    </FullWidthCard>
  );
};

export default PerformanceDetails;