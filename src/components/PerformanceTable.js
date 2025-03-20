import React from 'react';
import { 
  TableWrapper, 
  Table,
  Th,
  Td,
  TrendIcon,
  Badge
} from './StyledComponents';
import { formatCurrency, formatPercent, formatDate, formatShares } from '../utils/calculationUtils';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const PerformanceTable = ({ performanceData, selectedStocks, activeStockIndex }) => {
  const stockData = performanceData[activeStockIndex] || [];
  const stock = selectedStocks[activeStockIndex] || { name: '', symbol: '' };
  
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Prix</Th>
            <Th>Parts achetées</Th>
            <Th>Total parts</Th>
            <Th>Investi ce mois</Th>
            <Th>Total investi</Th>
            <Th>Valeur</Th>
            <Th>Performance</Th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((entry, index) => (
            <tr key={index}>
              <Td>{formatDate(entry.date)}</Td>
              <Td>{formatCurrency(entry.price)}</Td>
              <Td>{formatShares(entry.shares)}</Td>
              <Td>{formatShares(entry.totalShares)}</Td>
              <Td>{formatCurrency(entry.invested)}</Td>
              <Td>{formatCurrency(entry.totalInvested)}</Td>
              <Td>{formatCurrency(entry.portfolioValue)}</Td>
              <Td>
                <Badge success={entry.roi > 0} danger={entry.roi < 0}>
                  {entry.roi > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {formatPercent(entry.roi)}
                </Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default PerformanceTable;