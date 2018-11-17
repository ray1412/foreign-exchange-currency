import React from 'react';
import styled from 'styled-components';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import CurrencyConstant from './currencyConstant';

const Wrapper = styled(Card)`
  padding: 10px !important;
`;
const CalculationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Segment = styled.div`
  margin: 10px 0 5px;
`;
const CurrencyDescription = styled.span`
  font-style: italic;
  font-size: 0.9em;
  font-weight: bold;
`;
const defaultNumber = 1;
class CurrencyPanel extends React.PureComponent {
  componentDidMount() {}

  componentDidUpdate() {}

  calculateCurrency = () => {
    const { item, baseNumber } = this.props;
    if (baseNumber && !Number.isNaN(baseNumber)) {
      return parseFloat(item.rates * parseFloat(baseNumber)).toLocaleString();
    }
    return '-';
  };

  render() {
    const { item, baseCurrency } = this.props;
    return (
      <Wrapper fluid>
        <CalculationContainer>
          <span>{item.currency}</span>
          <span>{this.calculateCurrency()}</span>
        </CalculationContainer>
        <Segment>
          <CurrencyDescription>
            {item.currency} - {CurrencyConstant[item.currency]}{' '}
          </CurrencyDescription>
        </Segment>
        <Segment>
          <span>
            {defaultNumber}
            &nbsp;
            {baseCurrency} = {item.currency}
            &nbsp;
            {item.rates}
          </span>
        </Segment>
      </Wrapper>
    );
  }
}

CurrencyPanel.propTypes = {
  baseNumber: PropTypes.number,
  baseCurrency: PropTypes.string,
  item: PropTypes.object,
};

export default CurrencyPanel;
