import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardTitle, Badge, FlexRow, Button } from './StyledComponents';
import { theme } from '../utils/theme';
import { 
  FaGraduationCap, FaBook, FaChartLine, FaMoneyBillWave, 
  FaCalendarAlt, FaQuestion, FaLightbulb, FaChevronRight 
} from 'react-icons/fa';

const EducationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const TopicCard = styled.div`
  background-color: white;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const TopicHeader = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, ${props => props.color || theme.primary} 0%, ${props => props.colorSecondary || theme.secondary} 100%);
  color: white;
  position: relative;
  overflow: hidden;
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 1.3rem;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    right: -15px;
    top: -15px;
    background-color: rgba(255, 255, 255, 0.15);
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
`;

const TopicIcon = styled.div`
  position: absolute;
  right: 20px;
  bottom: -15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || theme.primary};
  box-shadow: ${theme.shadows.md};
  z-index: 1;
`;

const TopicContent = styled.div`
  padding: 20px;
  
  ul {
    padding-left: 20px;
    margin: 15px 0;
    
    li {
      margin-bottom: 8px;
      color: ${theme.darkGray};
      position: relative;
      
      &::before {
        content: '•';
        position: absolute;
        left: -15px;
        color: ${theme.primary};
      }
    }
  }
`;

const TopicFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid ${theme.gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReadMoreButton = styled.button`
  background-color: transparent;
  color: ${theme.primary};
  border: none;
  display: flex;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 0;
  transition: all 0.2s ease;
  
  svg {
    margin-left: 5px;
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: ${theme.secondary};
    
    svg {
      transform: translateX(3px);
    }
  }
`;

const ArticleContainer = styled.div`
  margin-top: 30px;
`;

const ArticleHeader = styled.div`
  margin-bottom: 25px;
  border-bottom: 1px solid ${theme.gray};
  padding-bottom: 15px;
  
  h2 {
    margin: 0 0 10px 0;
    color: ${theme.secondary};
  }
  
  p {
    margin: 0;
    color: ${theme.darkGray};
    font-size: 1.1rem;
  }
`;

const ArticleContent = styled.div`
  line-height: 1.6;
  color: ${theme.dark};
  
  h3 {
    margin: 25px 0 15px 0;
    color: ${theme.secondary};
  }
  
  p {
    margin: 0 0 15px 0;
  }
  
  blockquote {
    margin: 20px 0;
    padding: 15px 20px;
    background-color: ${theme.light};
    border-left: 3px solid ${theme.primary};
    font-style: italic;
  }
  
  img {
    max-width: 100%;
    border-radius: ${theme.radius.md};
    margin: 20px 0;
  }
`;

const BackButton = styled(Button)`
  margin-bottom: 20px;
`;

// Données éducatives
const educationTopics = [
  {
    id: 'dca-basics',
    title: 'Le DCA : principes fondamentaux',
    description: 'Comprendre le principe d\'investissement régulier et ses avantages',
    color: theme.primary,
    colorSecondary: '#3f37c9',
    icon: <FaChartLine />,
    content: [
      'Définition et origine du DCA',
      'Avantages psychologiques et financiers',
      'Éviter le market timing',
      'Comment démarrer une stratégie DCA'
    ],
    level: 'Débutant'
  },
  {
    id: 'volatility',
    title: 'Exploiter la volatilité à votre avantage',
    description: 'Comment le DCA transforme la volatilité en opportunité',
    color: '#f72585',
    colorSecondary: '#b5179e',
    icon: <FaMoneyBillWave />,
    content: [
      'Définition de la volatilité de marché',
      'L\'effet de moyenne lors des baisses',
      'Études de cas sur différents marchés',
      'DCA vs investissement forfaitaire'
    ],
    level: 'Intermédiaire'
  },
  {
    id: 'strategies',
    title: 'Stratégies avancées de DCA',
    description: 'Au-delà du DCA traditionnel : variantes et optimisations',
    color: '#4cc9f0',
    colorSecondary: '#4361ee',
    icon: <FaLightbulb />,
    content: [
      'DCA avec pondération de valeur',
      'DCA tactique et variations calendaires',
      'Combiner DCA et analyse fondamentale',
      'Automatisation de votre stratégie DCA'
    ],
    level: 'Avancé'
  },
  {
    id: 'tax-optimization',
    title: 'Optimisations fiscales',
    description: 'Structurer vos investissements pour minimiser l\'impact fiscal',
    color: '#90be6d',
    colorSecondary: '#43aa8b',
    icon: <FaBook />,
    content: [
      'Enveloppes fiscales adaptées au DCA',
      'Gestion des plus-values et dividendes',
      'Planification successorale',
      'Déclarations fiscales et suivi'
    ],
    level: 'Intermédiaire'
  },
  {
    id: 'timeframes',
    title: 'Fréquence et horizon d\'investissement',
    description: 'Choisir la bonne fréquence et durée pour votre stratégie',
    color: '#f8961e',
    colorSecondary: '#f3722c',
    icon: <FaCalendarAlt />,
    content: [
      'Comparaison des fréquences (quotidien, hebdomadaire, mensuel)',
      'Impact de la durée sur les performances',
      'Ajuster sa stratégie selon l\'âge et les objectifs',
      'Rébalancement et évolution du portefeuille'
    ],
    level: 'Débutant'
  },
  {
    id: 'faq',
    title: 'Questions fréquentes sur le DCA',
    description: 'Réponses aux interrogations courantes des investisseurs',
    color: '#480ca8',
    colorSecondary: '#3a0ca3',
    icon: <FaQuestion />,
    content: [
      'Le DCA fonctionne-t-il dans tous les marchés ?',
      'Comment choisir les actifs pour le DCA ?',
      'Faut-il continuer le DCA pendant les crises ?',
      'DCA et diversification : comment équilibrer ?'
    ],
    level: 'Débutant'
  }
];

// Contenu détaillé pour l'article DCA
const dcaArticleContent = `
## Le Dollar-Cost Averaging (DCA) : principes fondamentaux

Le Dollar-Cost Averaging, souvent abrégé en DCA, est une stratégie d'investissement qui consiste à investir régulièrement des sommes fixes sur les marchés financiers, indépendamment des fluctuations de prix. Cette approche s'oppose au "timing de marché" où l'investisseur tente de prédire les mouvements du marché pour acheter au plus bas et vendre au plus haut.

### Définition et origine du DCA

Le concept du DCA a été popularisé par Benjamin Graham, le mentor de Warren Buffett, dans son livre "The Intelligent Investor" publié en 1949. Graham préconisait cette méthode comme moyen de réduire l'impact de la volatilité sur les investissements à long terme.

### Avantages psychologiques et financiers

Le DCA présente plusieurs avantages majeurs :

1. **Réduction du risque émotionnel** : En investissant de manière systématique, on élimine l'anxiété liée à la recherche du "moment parfait" pour investir.

2. **Moyenne des prix d'achat** : Lorsque les marchés baissent, vos investissements réguliers vous permettent d'acheter plus de parts, ce qui réduit votre prix moyen d'achat.

3. **Discipline d'investissement** : Le DCA vous force à maintenir une discipline d'investissement, évitant ainsi les décisions impulsives.

4. **Adaptation aux différents revenus** : Que vous ayez un revenu modeste ou important, le DCA permet d'adapter votre stratégie à votre capacité d'épargne.

> "Le plus grand ennemi de l'investisseur est probablement lui-même." - Benjamin Graham

### Éviter le market timing

Les études montrent que même les professionnels peinent à prédire systématiquement les mouvements du marché. Le DCA contourne ce problème en répartissant les achats dans le temps, vous permettant de capturer différents points de prix.

Une étude de Vanguard a démontré que, sur une période de 10 ans, un investisseur utilisant le DCA obtenait des résultats comparables à ceux qui avaient investi une somme forfaitaire, mais avec une volatilité significativement réduite.

### Comment démarrer une stratégie DCA

Pour mettre en place une stratégie DCA efficace :

1. **Choisissez une fréquence d'investissement** : Hebdomadaire, bimensuelle ou mensuelle, selon votre flux de revenus.

2. **Déterminez un montant fixe** : Choisissez un montant que vous pouvez investir confortablement à chaque période.

3. **Sélectionnez des actifs diversifiés** : Actions, ETF, fonds indiciels qui correspondent à vos objectifs à long terme.

4. **Automatisez le processus** : Mettez en place des virements automatiques pour ne jamais manquer un investissement.

5. **Restez constant** : La clé du DCA est la régularité, même (et surtout) en période de baisse des marchés.

### Conclusion

Le DCA est particulièrement adapté aux investisseurs de long terme qui cherchent à constituer progressivement un patrimoine financier. Cette méthode n'est pas une garantie de surperformance, mais elle offre un cadre discipliné qui permet de naviguer sereinement à travers les cycles de marché tout en réduisant l'impact psychologique des fluctuations boursières.
`;

const Education = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const handleSelectTopic = (topicId) => {
    setSelectedTopic(topicId);
    // Faire défiler vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => {
    setSelectedTopic(null);
  };
  
  return (
    <>
      <Card>
        <CardTitle><FaGraduationCap /> Centre éducatif</CardTitle>
        
        {selectedTopic ? (
          <>
            <BackButton small onClick={handleBack}>
              ← Retour aux sujets
            </BackButton>
            
            <ArticleContainer>
              <ArticleHeader>
                <h2>Le DCA : principes fondamentaux</h2>
                <p>Comprendre le principe d'investissement régulier et ses avantages</p>
                <FlexRow style={{ marginTop: 15 }}>
                  <Badge info>Débutant</Badge>
                  <Badge>10 min de lecture</Badge>
                  <Badge success>Guide</Badge>
                </FlexRow>
              </ArticleHeader>
              
              <ArticleContent dangerouslySetInnerHTML={{ __html: dcaArticleContent }} />
            </ArticleContainer>
          </>
        ) : (
          <>
            <p>Enrichissez vos connaissances sur l'investissement régulier et les stratégies DCA.</p>
            
            <EducationGrid>
              {educationTopics.map((topic) => (
                <TopicCard key={topic.id} onClick={() => handleSelectTopic(topic.id)}>
                  <TopicHeader color={topic.color} colorSecondary={topic.colorSecondary}>
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                    <TopicIcon color={topic.color}>
                      {topic.icon}
                    </TopicIcon>
                  </TopicHeader>
                  
                  <TopicContent>
                    <ul>
                      {topic.content.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </TopicContent>
                  
                  <TopicFooter>
                    <Badge>{topic.level}</Badge>
                    <ReadMoreButton>
                      Lire l'article <FaChevronRight />
                    </ReadMoreButton>
                  </TopicFooter>
                </TopicCard>
              ))}
            </EducationGrid>
          </>
        )}
      </Card>
    </>
  );
};

export default Education;