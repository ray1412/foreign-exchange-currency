import React from 'react';
import styled from 'styled-components';
import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <div> Hai </div>
      <GlobalStyle />
    </AppWrapper>
  );
}
