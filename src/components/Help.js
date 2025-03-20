import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardTitle, Badge, Button } from './StyledComponents';
import { theme } from '../utils/theme';
import { 
  FaQuestionCircle, FaSearch, FaChevronDown, FaChevronUp, 
  FaChartLine, FaGithub, FaTwitter, FaEnvelope, FaUser
} from 'react-icons/fa';

const HelpContainer = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HelpSidebar = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const HelpContent = styled.div`
  padding-bottom: 30px;
`;

const SearchBar = styled.div`
  margin-bottom: 20px;
  position: relative;
  
  input {
    width: 100%;
    padding: 12px 15px 12px 40px;
    border: 1px solid ${theme.gray};
    border-radius: ${theme.radius.md};
    font-size: 1rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${theme.primary};
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
    }
  }
  
  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.darkGray};
  }
`;

const CategoryMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const CategoryItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: ${theme.radius.md};
  border: none;
  background-color: ${props => props.active ? theme.light : 'transparent'};
  color: ${props => props.active ? theme.primary : theme.dark};
  text-align: left;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    color: ${props => props.active ? theme.primary : theme.darkGray};
  }
  
  &:hover {
    background-color: ${theme.light};
  }
`;

const HelpSection = styled.section`
  margin-bottom: 30px;
  scroll-margin-top: 20px;
  
  h2 {
    color: ${theme.secondary};
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${theme.gray};
  }
  
  h3 {
    margin: 20px 0 10px 0;
    color: ${theme.dark};
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  ul, ol {
    margin-bottom: 15px;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      line-height: 1.5;
    }
  }
`;

const FaqItem = styled.div`
  margin-bottom: 15px;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.gray};
  overflow: hidden;
`;

const FaqQuestion = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  background-color: ${props => props.active ? theme.light : 'white'};
  border: none;
  text-align: left;
  cursor: pointer;
  font-weight: ${props => props.active ? 600 : 400};
  color: ${props => props.active ? theme.primary : theme.dark};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.light};
  }
  
  svg {
    color: ${theme.darkGray};
    transition: transform 0.2s ease;
    transform: ${props => props.active ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const FaqAnswer = styled.div`
  padding: ${props => props.active ? '15px' : '0 15px'};
  max-height: ${props => props.active ? '500px' : '0'};
  opacity: ${props => props.active ? 1 : 0};
  overflow: hidden;
  transition: all 0.3s ease;
  line-height: 1.6;
  
  a {
    color: ${theme.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContactCard = styled.div`
  background-color: ${theme.light};
  border-radius: ${theme.radius.md};
  padding: 20px;
  margin-top: 20px;
  
  h3 {
    margin-top: 0 !important;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  p {
    margin-bottom: 15px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.bg || theme.primary};
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.md};
  }
`;

const FAQs = [
  {
    question: "Qu'est-ce que le Dollar-Cost Averaging (DCA) ?",
    answer: "Le Dollar-Cost Averaging est une stratégie d'investissement qui consiste à investir régulièrement une somme fixe, indépendamment du prix du marché. Cette méthode permet de moyenner le coût d'achat dans le temps et de réduire l'impact de la volatilité."
  },
  {
    question: "Comment utiliser le simulateur Centurion ?",
    answer: "Pour utiliser Centurion, commencez par rechercher une action via la barre de recherche. Ensuite, définissez la date de début et le montant mensuel que vous souhaitez investir. Ajoutez l'action à votre liste, puis cliquez sur 'Calculer la performance' pour visualiser les résultats."
  },
  {
    question: "Les données historiques sont-elles précises ?",
    answer: "Centurion utilise des données provenant de fournisseurs financiers réputés. Cependant, des ajustements peuvent être nécessaires pour les divisions d'actions, les dividendes et autres événements corporatifs. Pour des décisions d'investissement critiques, nous recommandons de vérifier les données auprès de sources officielles."
  },
  {
    question: "Puis-je simuler plusieurs actions en même temps ?",
    answer: "Oui, Centurion vous permet d'ajouter plusieurs actions à votre simulation. Recherchez chaque action, configurez ses paramètres, puis ajoutez-la à votre liste. Vous pourrez ainsi comparer les performances de différentes actions sous une stratégie DCA."
  },
  {
    question: "Les dividendes sont-ils pris en compte ?",
    answer: "Par défaut, les dividendes ne sont pas réinvestis dans la simulation. Nous travaillons sur une fonctionnalité qui permettra de simuler le réinvestissement automatique des dividendes dans de futures versions."
  },
  {
    question: "Comment les performances sont-elles calculées ?",
    answer: "Pour chaque date d'investissement, nous calculons combien de parts vous auriez pu acheter avec votre investissement mensuel au prix de ce jour. Nous additionnons ensuite ces parts et calculons leur valeur totale au prix actuel. Le ROI (Return On Investment) est calculé en comparant cette valeur au montant total investi."
  }
];

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };
  
  const filteredFaqs = searchQuery 
    ? FAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FAQs;
  
  return (
    <Card>
      <CardTitle><FaQuestionCircle /> Aide et support</CardTitle>
      
      <SearchBar>
        <FaSearch />
        <input 
          type="text" 
          placeholder="Rechercher dans l'aide..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>
      
      <HelpContainer>
        <HelpSidebar>
          <CategoryMenu>
            <CategoryItem 
              active={activeCategory === 'getting-started'}
              onClick={() => setActiveCategory('getting-started')}
            >
              <FaChartLine /> Prise en main
            </CategoryItem>
            <CategoryItem 
              active={activeCategory === 'faq'}
              onClick={() => setActiveCategory('faq')}
            >
              <FaQuestionCircle /> Questions fréquentes
            </CategoryItem>
            <CategoryItem 
              active={activeCategory === 'contact'}
              onClick={() => setActiveCategory('contact')}
            >
              <FaEnvelope /> Contact et support
            </CategoryItem>
          </CategoryMenu>
        </HelpSidebar>
        
        <HelpContent>
          {activeCategory === 'getting-started' && (
            <HelpSection id="getting-started">
              <h2>Prise en main</h2>
              
              <p>
                Bienvenue sur Centurion, votre simulateur d'investissement régulier (DCA) 
                sur les marchés financiers. Voici comment utiliser l'application :
              </p>
              
              <h3>1. Rechercher une action</h3>
              <p>
                Commencez par rechercher une action en utilisant la barre de recherche. 
                Vous pouvez saisir le nom ou le symbole de l'action (ex: Apple, AAPL).
                Vous pouvez également sélectionner une action parmi les suggestions populaires.
              </p>
              
              <h3>2. Configurer les paramètres</h3>
              <p>
                Une fois l'action sélectionnée, définissez :
              </p>
              <ul>
                <li><strong>Date de début</strong> : La date à partir de laquelle vous souhaitez simuler l'investissement</li>
                <li><strong>Montant mensuel</strong> : La somme que vous auriez investi chaque mois (par défaut 100€)</li>
              </ul>
              
              <h3>3. Ajouter à la liste et calculer</h3>
              <p>
                Cliquez sur "Ajouter à la liste" pour inclure cette action dans votre simulation.
                Vous pouvez ajouter plusieurs actions pour les comparer.
                Une fois vos actions sélectionnées, cliquez sur "Calculer la performance".
              </p>
              
              <h3>4. Analyser les résultats</h3>
              <p>
                Les résultats de la simulation s'affichent sous forme de :
              </p>
              <ul>
                <li><strong>Résumé de performance</strong> : Montant investi, valeur actuelle, ROI, etc.</li>
                <li><strong>Graphique d'évolution</strong> : Visualisation de la valeur du portefeuille au fil du temps</li>
                <li><strong>Tableau détaillé</strong> : Détail mois par mois des investissements et performances</li>
              </ul>
              
              <p>
                Pour une expérience optimale, explorez les différentes vues et filtres disponibles
                dans les graphiques et tableaux.
              </p>
            </HelpSection>
          )}
          
          {activeCategory === 'faq' && (
            <HelpSection id="faq">
              <h2>Questions fréquentes</h2>
              
              {filteredFaqs.map((faq, index) => (
                <FaqItem key={index}>
                  <FaqQuestion 
                    active={openFaqIndex === index}
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    {openFaqIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </FaqQuestion>
                  <FaqAnswer active={openFaqIndex === index}>
                    {faq.answer}
                  </FaqAnswer>
                </FaqItem>
              ))}
              
              {filteredFaqs.length === 0 && (
                <p>Aucun résultat trouvé pour "{searchQuery}"</p>
              )}
            </HelpSection>
          )}
          
          {activeCategory === 'contact' && (
            <HelpSection id="contact">
              <h2>Contact et support</h2>
              
              <p>
                Vous avez une question ou besoin d'aide pour utiliser Centurion ? 
                Notre équipe est là pour vous aider.
              </p>
              
              <ContactCard>
                <h3><FaUser /> Support technique</h3>
                <p>
                  Pour toute question relative à l'utilisation de l'application,
                  rapporter un bug ou suggérer une amélioration, contactez-nous :
                </p>
                <Button>
                  <FaEnvelope /> Contacter le support
                </Button>
                
                <SocialLinks>
                  <SocialButton bg="#333" href="#" target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </SocialButton>
                  <SocialButton bg="#1DA1F2" href="#" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                  </SocialButton>
                  <SocialButton bg="#4361ee" href="#" target="_blank" rel="noopener noreferrer">
                    <FaEnvelope />
                  </SocialButton>
                </SocialLinks>
              </ContactCard>
              
              <h3>Ressources supplémentaires</h3>
              <ul>
                <li><a href="#">Documentation détaillée</a></li>
                <li><a href="#">Guide d'utilisation avancée</a></li>
                <li><a href="#">Blog et articles sur le DCA</a></li>
              </ul>
            </HelpSection>
          )}
        </HelpContent>
      </HelpContainer>
    </Card>
  );
};

export default Help;