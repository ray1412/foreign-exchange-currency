import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import { Label, Input, Dropdown, Button } from 'semantic-ui-react';
import _debounce from 'lodash/debounce';
import saga from './saga';
import { loadExchangeRate } from './actions';
import {
  makeSelectExchangeRateData,
  makeSelectExchangeRateError,
  makeSelectExchangeRateLoaded,
  makeSelectExchangeRateLoading,
} from './selectors';
/**
 * styling part
 */
import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
  @media (min-width: 768px) {
    width: 75%;
  }
`;
const DateLabel = styled(Label)`
  border: none !important;
  background: transparent !important;
  text-align: right;
`;
const BaseCurrencyInput = styled(Input)`
  border-bottom: 1px solid #000;
  padding: 0 0 5px;
  input {
    text-align: right !important;
    border: none !important;
    background: transparent !important;
  }
`;
const DropdownWrapper = styled.div`
  width: 100%;
  margin: 25px auto;
  display: flex;
`;
const CustomDropdown = styled(Dropdown)`
  width: 70%;
  @media (min-width: 768px) {
    width: 85%;
  }
`;
const CustomDropdownButton = styled(Button)`
  width: 30%;
  @media (min-width: 768px) {
    width: 15%;
  }
`;
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      baseCurrency: 'USD',
      value: parseFloat(1.0),
    };
  }

  componentDidMount() {
    this.getExchangeRate();
  }

  getExchangeRate() {
    const { baseCurrency } = this.state;
    this.props.loadExchangeRate({ base: baseCurrency });
  }

  handleValueChanges = _debounce((e, data) => {
    const { value } = data;
    this.setState({
      value: parseFloat(value),
    });
  }, 25);

  handleBaseCurrencyChanges = (e, data) => {
    const { value } = data;
    this.setState(
      {
        baseCurrency: value,
      },
      () => this.props.loadExchangeRate({ base: this.state.baseCurrency }),
    );
  };

  handleTargetCurrencyChanges = (e, data) => {
    const { value } = data;
    this.setState({
      targetCurrency: value,
    });
  };

  submitCurrency = () => {
    const { displayedCurrency, targetCurrency } = this.state;
    this.setState({
      displayedCurrency: [...displayedCurrency, targetCurrency],
    });
  };

  render() {
    const {
      intl,
      exchangeRateLoading,
      exchangeRateData,
      exchangeRateLoaded,
    } = this.props;
    const { baseCurrency, value } = this.state;
    return (
      <AppWrapper>
        <DateLabel float="right" basic>
          {intl.formatMessage({ id: 'general.date' })}:{' '}
          {exchangeRateData ? (
            exchangeRateData.date
          ) : (
            <FormattedMessage id="general.loading" />
          )}
        </DateLabel>
        <BaseCurrencyInput
          type="number"
          step="any"
          action={
            <Dropdown
              scrolling
              loading={exchangeRateLoading}
              value={baseCurrency}
              options={exchangeRateLoaded ? exchangeRateData.currencyList : []}
              onChange={this.handleBaseCurrencyChanges}
            />
          }
          actionPosition="left"
          value={value}
          onChange={this.handleValueChanges}
        />
        <DropdownWrapper>
          <CustomDropdown
            search
            clearable
            scrolling
            selection={exchangeRateLoaded}
            loading={exchangeRateLoading}
            options={exchangeRateLoaded ? exchangeRateData.currencyList : []}
            onChange={this.handleTargetCurrencyChanges}
          />
          <CustomDropdownButton
            primary
            disabled={exchangeRateLoading}
            onClick={this.submitCurrency}
          >
            {intl.formatMessage({ id: 'general.submit' })}
          </CustomDropdownButton>
        </DropdownWrapper>
        <GlobalStyle />
      </AppWrapper>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadExchangeRate: query => dispatch(loadExchangeRate(query)),
  };
}

const mapStateToProps = createStructuredSelector({
  exchangeRateData: makeSelectExchangeRateData(),
  exchangeRateLoading: makeSelectExchangeRateLoading(),
  exchangeRateLoaded: makeSelectExchangeRateLoaded(),
  exchangeRateError: makeSelectExchangeRateError(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withSaga = injectSaga({ key: 'global', saga });

App.propTypes = {
  exchangeRateData: PropTypes.object,
  exchangeRateLoading: PropTypes.bool,
  intl: intlShape.isRequired,
  loadExchangeRate: PropTypes.func,
  exchangeRateLoaded: PropTypes.bool,
};
export default compose(
  withConnect,
  withSaga,
)(injectIntl(App));
