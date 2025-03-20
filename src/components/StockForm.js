import React, { useState } from 'react';
import { 
  Card, 
  CardTitle, 
  Form, 
  InputGroup, 
  Label, 
  Input, 
  Button, 
  FlexRow,
  StockItem,
  RemoveButton,
  Badge
} from './StyledComponents';
import StockIcon from './StockIcon';
import { getStockColor } from '../utils/theme';
import { FaCalendarAlt, FaMoneyBillWave, FaPlus, FaChartLine } from 'react-icons/fa';

const StockForm = ({ onAddStock, selectedStocks, onRemoveStock, onCalculate, stockInfo }) => {
  const [startDate, setStartDate] = useState('2010-01-01');
  const [monthlyInvestment, setMonthlyInvestment] = useState(100);
  
  const handleAddStock = () => {
    if (!stockInfo) return;
    
    onAddStock({
      symbol: stockInfo.symbol,
      name: stockInfo.name || stockInfo.symbol,
      startDate,
      monthlyInvestment: parseFloat(monthlyInvestment)
    });
  };

  // Déterminer la date minimale (10 ans avant aujourd'hui)
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  const minDate = tenYearsAgo.toISOString().split('T')[0];
  
  return (
    <Card>
      <CardTitle><FaChartLine /> Paramètres d'investissement</CardTitle>
      <Form>
        {stockInfo && (
          <div>
            <Label>Action sélectionnée</Label>
            <StockItem>
              <StockIcon symbol={stockInfo.symbol} />
              <strong>{stockInfo.name || stockInfo.symbol}</strong>
              <Badge info>{stockInfo.symbol}</Badge>
            </StockItem>
          </div>
        )}
        
        <InputGroup>
          <Label><FaCalendarAlt /> Date de début</Label>
          <Input 
            id="startDate" 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            min={minDate}
          />
        </InputGroup>
        
        <InputGroup>
          <Label><FaMoneyBillWave /> Investissement mensuel (€)</Label>
          <Input 
            id="monthlyInvestment" 
            type="number" 
            min="1" 
            value={monthlyInvestment} 
            onChange={(e) => setMonthlyInvestment(e.target.value)}
          />
        </InputGroup>
        
        <Button 
          onClick={handleAddStock} 
          disabled={!stockInfo}
        >
          <FaPlus /> Ajouter à la liste
        </Button>
        
        {selectedStocks.length > 0 && (
          <>
            <Label>Actions sélectionnées</Label>
            <FlexRow>
              {selectedStocks.map((stock, index) => (
                <StockItem 
                  key={`${stock.symbol}-${index}`} 
                  color={getStockColor(index)}
                >
                  <StockIcon symbol={stock.symbol} />
                  <div>
                    <div><strong>{stock.name}</strong></div>
                    <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                      {stock.monthlyInvestment}€/mois depuis {new Date(stock.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <RemoveButton onClick={() => onRemoveStock(index)}>×</RemoveButton>
                </StockItem>
              ))}
            </FlexRow>
            
            <Button 
              onClick={onCalculate}
              secondary
            >
              <FaChartLine /> Calculer la performance
            </Button>
          </>
        )}
      </Form>
    </Card>
  );
};

export default StockForm;