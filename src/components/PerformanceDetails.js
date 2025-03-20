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

const PerformanceDetails = ({ performanceData, selectedStocks }) => {
  const [activeStockIndex, setActiveStockIndex] = useState(0);
  
  return (
    <Card>
      <CardTitle><FaTable /> Détails des investissements</CardTitle>
      <TabsContainer>
        <TabsList>
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
        </TabsList>
        
        <PerformanceTable 
          performanceData={performanceData}
          selectedStocks={selectedStocks}
          activeStockIndex={activeStockIndex}
        />
      </TabsContainer>
    </Card>
  );
};

export default PerformanceDetails;