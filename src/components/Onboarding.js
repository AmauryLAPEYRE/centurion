import React from 'react';
import styled from 'styled-components';
import { theme } from '../utils/theme';
import { FaInfoCircle, FaChartLine, FaCalendarAlt, FaMoneyBillWave, FaCalculator } from 'react-icons/fa';

const OnboardingContainer = styled.div`
  margin-bottom: 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const OnboardingHeader = styled.div`
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  color: white;
`;

const OnboardingTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const OnboardingContent = styled.div`
  padding: 20px;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => props.active ? 'rgba(67, 97, 238, 0.1)' : 'transparent'};
  border-left: 3px solid ${props => props.active ? '#4361ee' : 'transparent'};
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4361ee' : '#d9d9d9'};
  color: white;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h4`
  margin: 0 0 5px 0;
  color: ${props => props.active ? '#4361ee' : '#212529'};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const StepDescription = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
`;

const ExamplePrompt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(76, 201, 240, 0.1);
  border-radius: 8px;
  
  h5 {
    margin: 0;
    color: #3a0ca3;
  }
`;

const Onboarding = ({ currentStep = 1 }) => {
  return (
    <OnboardingContainer>
      <OnboardingHeader>
        <OnboardingTitle>
          <FaInfoCircle /> Comment utiliser Centurion DCA
        </OnboardingTitle>
      </OnboardingHeader>
      <OnboardingContent>
        <StepsList>
          <Step active={currentStep === 1}>
            <StepNumber active={currentStep === 1}>1</StepNumber>
            <StepContent>
              <StepTitle active={currentStep === 1}>
                <FaChartLine /> Recherchez une action
              </StepTitle>
              <StepDescription>
                Commencez par rechercher une action par son nom ou son symbole (ex: Tesla, AAPL). 
                Vous pouvez également choisir parmi les actions populaires ci-dessous.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step active={currentStep === 2}>
            <StepNumber active={currentStep === 2}>2</StepNumber>
            <StepContent>
              <StepTitle active={currentStep === 2}>
                <FaCalendarAlt /> Définissez la date de début
              </StepTitle>
              <StepDescription>
                Choisissez la date à partir de laquelle vous auriez commencé à investir. 
                Cette date détermine le prix d'entrée initial.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step active={currentStep === 3}>
            <StepNumber active={currentStep === 3}>3</StepNumber>
            <StepContent>
              <StepTitle active={currentStep === 3}>
                <FaMoneyBillWave /> Fixez votre investissement mensuel
              </StepTitle>
              <StepDescription>
                Indiquez le montant que vous auriez investi chaque mois sans interruption (DCA).
                Par défaut, la valeur est de 100€.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step active={currentStep === 4}>
            <StepNumber active={currentStep === 4}>4</StepNumber>
            <StepContent>
              <StepTitle active={currentStep === 4}>
                <FaCalculator /> Analysez les résultats
              </StepTitle>
              <StepDescription>
                Visualisez la progression de votre investissement au fil du temps, avec les bénéfices
                potentiels et l'évolution du nombre de parts acquises.
              </StepDescription>
            </StepContent>
          </Step>
        </StepsList>
        
        <ExamplePrompt>
          <h5>Exemple : Investir 100€ par mois dans Tesla depuis janvier 2015</h5>
          <p>Découvrez combien vaudrait votre investissement aujourd'hui et quelle serait votre performance !</p>
        </ExamplePrompt>
      </OnboardingContent>
    </OnboardingContainer>
  );
};

export default Onboarding;