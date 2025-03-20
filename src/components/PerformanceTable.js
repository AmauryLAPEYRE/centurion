import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TableWrapper,
  Table,
  Th,
  Td,
  TrendIcon,
  Badge,
  Button,
  LoadingSpinner
} from './StyledComponents';
import { formatCurrency, formatPercent, formatDate, formatShares } from '../utils/calculationUtils';
import { FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';
import { theme } from '../utils/theme';

// Nouveaux composants stylisés
const ResponsiveTableWrapper = styled(TableWrapper)`
  overflow-x: auto;
  width: 100%;
  margin-bottom: 20px;
  
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

const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
`;

const PageInfo = styled.div`
  font-size: 0.9rem;
  color: ${theme.darkGray};
`;

const FilterControls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? theme.primary : 'white'};
  color: ${props => props.active ? 'white' : theme.darkGray};
  border: 1px solid ${props => props.active ? theme.primary : theme.gray};
  padding: 6px 12px;
  border-radius: ${theme.radius.md};
  font-size: 0.85rem;
  cursor: pointer;
  transition: ${theme.transitions.default};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: ${props => props.active ? theme.primary : theme.light};
    transform: translateY(-1px);
  }
`;

const PerformanceTable = ({ performanceData, selectedStocks, activeStockIndex }) => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [displayMode, setDisplayMode] = useState('monthly'); // monthly, quarterly, yearly
  
  const stockData = performanceData[activeStockIndex] || [];
  const stock = selectedStocks[activeStockIndex] || { name: '', symbol: '' };
  
  // Regrouper par trimestre ou année si nécessaire
  const processedData = displayMode === 'monthly' 
    ? stockData 
    : groupDataByPeriod(stockData, displayMode);
  
  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const currentData = processedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
  function groupDataByPeriod(data, period) {
    if (period === 'quarterly') {
      // Grouper par trimestre
      const quarters = {};
      
      data.forEach(entry => {
        const date = new Date(entry.date);
        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const key = `${year}-Q${quarter}`;
        
        if (!quarters[key]) {
          quarters[key] = {
            date: `${year} T${quarter}`,
            price: entry.price,
            shares: 0,
            invested: 0,
            totalInvested: entry.totalInvested,
            portfolioValue: entry.portfolioValue,
            totalShares: entry.totalShares,
            roi: entry.roi
          };
        }
        
        quarters[key].shares += entry.shares;
        quarters[key].invested += entry.invested;
        
        // Mettre à jour avec les valeurs du dernier mois du trimestre
        const entryMonth = date.getMonth();
        const entryIsLastMonthOfQuarter = (entryMonth % 3) === 2;
        
        if (entryIsLastMonthOfQuarter) {
          quarters[key].price = entry.price;
          quarters[key].totalInvested = entry.totalInvested;
          quarters[key].portfolioValue = entry.portfolioValue;
          quarters[key].totalShares = entry.totalShares;
          quarters[key].roi = entry.roi;
        }
      });
      
      return Object.values(quarters).sort((a, b) => {
        const yearA = parseInt(a.date.split(' ')[0]);
        const yearB = parseInt(b.date.split(' ')[0]);
        if (yearA !== yearB) return yearA - yearB;
        
        const quarterA = parseInt(a.date.split('T')[1]);
        const quarterB = parseInt(b.date.split('T')[1]);
        return quarterA - quarterB;
      });
    } else if (period === 'yearly') {
      // Grouper par année
      const years = {};
      
      data.forEach(entry => {
        const date = new Date(entry.date);
        const year = date.getFullYear();
        
        if (!years[year]) {
          years[year] = {
            date: String(year),
            price: entry.price,
            shares: 0,
            invested: 0,
            totalInvested: entry.totalInvested,
            portfolioValue: entry.portfolioValue,
            totalShares: entry.totalShares,
            roi: entry.roi
          };
        }
        
        years[year].shares += entry.shares;
        years[year].invested += entry.invested;
        
        // Mettre à jour avec les valeurs du dernier mois de l'année
        const entryMonth = date.getMonth();
        const entryIsLastMonthOfYear = entryMonth === 11;
        
        if (entryIsLastMonthOfYear) {
          years[year].price = entry.price;
          years[year].totalInvested = entry.totalInvested;
          years[year].portfolioValue = entry.portfolioValue;
          years[year].totalShares = entry.totalShares;
          years[year].roi = entry.roi;
        }
      });
      
      return Object.values(years).sort((a, b) => parseInt(a.date) - parseInt(b.date));
    }
    
    return data;
  }
  
  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };
  
  if (stockData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <LoadingSpinner size="24px" />
        <p>Chargement des données...</p>
      </div>
    );
  }
  
  return (
    <>
      <FilterControls>
        <FilterButton 
          active={displayMode === 'monthly'}
          onClick={() => {
            setDisplayMode('monthly');
            setPage(1);
          }}
        >
          Mensuel
        </FilterButton>
        <FilterButton 
          active={displayMode === 'quarterly'}
          onClick={() => {
            setDisplayMode('quarterly');
            setPage(1);
          }}
        >
          Trimestriel
        </FilterButton>
        <FilterButton 
          active={displayMode === 'yearly'}
          onClick={() => {
            setDisplayMode('yearly');
            setPage(1);
          }}
        >
          Annuel
        </FilterButton>
      </FilterControls>
      
      <ResponsiveTableWrapper>
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
            {currentData.map((entry, index) => (
              <tr key={index}>
                <Td>{displayMode === 'monthly' ? formatDate(entry.date) : entry.date}</Td>
                <Td>{formatCurrency(entry.price)}</Td>
                <Td>{formatShares(entry.shares)}</Td>
                <Td>{formatShares(entry.totalShares)}</Td>
                <Td>{formatCurrency(entry.invested)}</Td>
                <Td>{formatCurrency(entry.totalInvested)}</Td>
                <Td>{formatCurrency(entry.portfolioValue)}</Td>
                <Td>
                  <Badge success={entry.roi > 0} danger={entry.roi < 0}>
                    {entry.roi > 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {formatPercent(entry.roi / 100)}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ResponsiveTableWrapper>
      
      {totalPages > 1 && (
        <PaginationControls>
          <Button 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            small
          >
            <FaChevronLeft /> Précédent
          </Button>
          
          <PageInfo>
            Page {page} sur {totalPages}
          </PageInfo>
          
          <Button 
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            small
          >
            Suivant <FaChevronRight />
          </Button>
        </PaginationControls>
      )}
    </>
  );
};

export default PerformanceTable;