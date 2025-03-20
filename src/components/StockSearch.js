import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardTitle, 
  Form, 
  InputGroup, 
  Label, 
  Input, 
  Button,
  FlexRow,
  Badge,
  LoadingSpinner
} from './StyledComponents';
import { searchSymbols, getPopularStocks } from '../services/apiService';
import styled from 'styled-components';
import { theme } from '../utils/theme';
import { FaSearch, FaChartLine, FaFire } from 'react-icons/fa';
import StockIcon from './StockIcon';

const SearchResults = styled.div`
  margin-top: 10px;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid ${theme.gray};
  border-radius: ${theme.radius.md};
  
  &::-webkit-scrollbar {
    width: 6px;
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

const SearchItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid ${theme.gray};
  display: flex;
  align-items: center;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${theme.light};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const PopularStocksContainer = styled.div`
  margin-top: 25px;
`;

const PopularStockItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-radius: ${theme.radius.md};
  background-color: ${theme.light};
  margin-bottom: 10px;
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    background-color: rgba(67, 97, 238, 0.05);
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

const StockChange = styled.span`
  color: ${props => props.positive ? 'green' : 'red'};
  display: flex;
  align-items: center;
  font-weight: 600;
  
  svg {
    margin-right: 4px;
  }
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
`;

const SearchHint = styled.div`
  margin-top: 5px;
  font-size: 0.85rem;
  color: #6c757d;
  font-style: italic;
`;

const MainListingBadge = styled.span`
  background-color: #4cc9f0;
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 0.7rem;
  margin-left: 5px;
  font-weight: 600;
`;

const StockSearch = ({ onSelectStock }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularStocks, setPopularStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Charger les actions populaires au démarrage
    const loadPopularStocks = async () => {
      try {
        setIsLoading(true);
        const stocks = await getPopularStocks();
        setPopularStocks(stocks);
      } catch (error) {
        console.error('Erreur lors du chargement des actions populaires:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPopularStocks();
  }, []);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const results = await searchSymbols(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  
  const handleSelectResult = (stock) => {
    onSelectStock(stock);
    setSearchResults([]);
    setSearchQuery('');
  };
  
  return (
    <Card>
      <CardTitle><FaSearch /> Rechercher une action</CardTitle>
      <Form>
        <InputGroup>
          <Label>Nom ou symbole de l'action</Label>
          <FlexRow>
            <Input 
              id="searchQuery" 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: Apple, AAPL, Tesla..."
              style={{ flex: 1 }}
            />
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery.trim() || isLoading}
            >
              {isLoading ? <LoadingSpinner /> : <FaSearch />} Rechercher
            </Button>
          </FlexRow>
          <SearchHint>
            Exemples : Tesla (TSLA), Apple (AAPL), Microsoft (MSFT), Amazon (AMZN)
          </SearchHint>
        </InputGroup>
        
        {searchResults.length > 0 && (
          <SearchResults>
            {searchResults.map((result, index) => (
              <SearchItem 
                key={`${result.symbol}-${index}`}
                onClick={() => handleSelectResult(result)}
              >
                <StockIcon symbol={result.symbol} />
                <div style={{ flex: 1 }}>
                  <strong>{result.name || result.symbol}</strong>
                  <div style={{ fontSize: '0.85rem', color: theme.darkGray }}>
                    {result.region}
                    {result.isMainListing && <MainListingBadge>Principal</MainListingBadge>}
                  </div>
                </div>
                <Badge info>{result.symbol}</Badge>
              </SearchItem>
            ))}
          </SearchResults>
        )}
        
        {popularStocks.length > 0 && (
          <PopularStocksContainer>
            <Label><FaFire /> Actions populaires</Label>
            {popularStocks.map((stock) => (
              <PopularStockItem 
                key={stock.symbol}
                onClick={() => handleSelectResult({ symbol: stock.symbol, name: stock.symbol })}
              >
                <StockInfo>
                  <StockIcon symbol={stock.symbol} />
                  <div>
                    <strong>{stock.symbol}</strong>
                  </div>
                </StockInfo>
                <div>
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(stock.price)}
                  {' '}
                  <StockChange positive={stock.change >= 0}>
                    {stock.change >= 0 ? '↑' : '↓'} {stock.changePercent}
                  </StockChange>
                </div>
              </PopularStockItem>
            ))}
          </PopularStocksContainer>
        )}
      </Form>
    </Card>
  );
};

export default StockSearch;