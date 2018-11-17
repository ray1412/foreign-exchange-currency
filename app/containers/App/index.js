import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import _debounce from 'lodash/debounce';
import { Icon, Label, Input, Dropdown, Button } from 'semantic-ui-react';
import CurrencyPanel from 'components/CurrencyPanel';
import saga from './saga';
import { loadExchangeRate } from './actions';
import {
  makeSelectExchangeRateData,
  makeSelectExchangeRateError,
  makeSelectExchangeRateLoaded,
  makeSelectExchangeRateLoading,
} from './selectors';
/**
 *  styling part
 */
import GlobalStyle from '../../global-styles';

/**
 * component part
 */

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
  @media (min-width: 768px) {
    width: 75%;
  }
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0;
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
const ContentWrapper = styled.div`
  width: 100%;
  max-height: 75vh;
  overflow: scroll;
  padding: 10px 10px 5px;
  background: transparent;
`;
const SubmitCurrencyWrapper = styled.div`
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
      baseNumber: parseFloat(1.0),
      displayedCurrency: [],
    };
  }

  componentDidMount() {
    this.getExchangeRate();
  }

  componentDidUpdate(prevProps) {
    const { exchangeRateData } = this.props;
    if (prevProps.exchangeRateData !== exchangeRateData) {
      this.updateDisplayedCurrency();
    }
  }

  getExchangeRate() {
    const { baseCurrency } = this.state;
    this.props.loadExchangeRate({ base: baseCurrency });
  }

  handleBaseNumberChanges = _debounce((e, data) => {
    const { value } = data;
    this.setState({
      baseNumber: parseFloat(value),
    });
  }, 25);

  handleBaseCurrencyChanges = (e, data) => {
    const { value } = data;
    const { baseCurrency } = this.state;
    if (value !== baseCurrency) {
      this.setState(
        {
          baseCurrency: value,
        },
        () => this.props.loadExchangeRate({ base: this.state.baseCurrency }),
      );
    }
  };

  handleTargetCurrencyChanges = (e, data) => {
    const { value } = data;
    this.setState({
      targetCurrency: value,
    });
  };

  submitCurrency = () => {
    const { displayedCurrency, targetCurrency } = this.state;
    const { exchangeRateData } = this.props;
    const isCurrencyExist = displayedCurrency.find(
      item => item.currency === targetCurrency,
    );
    if (targetCurrency && !isCurrencyExist) {
      this.setState(
        {
          displayedCurrency: [
            ...displayedCurrency,
            {
              currency: targetCurrency,
              rates: exchangeRateData.rates[targetCurrency],
            },
          ],
        },
        () => console.log(this.state.displayedCurrency),
      );
    }
  };

  updateDisplayedCurrency = () => {
    console.log('kuy update');
    const { displayedCurrency } = this.state;
    const { exchangeRateData } = this.props;
    let newDisplayedCurrency = [];
    if (displayedCurrency && displayedCurrency.length > 0) {
      displayedCurrency.map(item => {
        newDisplayedCurrency = [
          ...newDisplayedCurrency,
          {
            currency: item.currency,
            rates: exchangeRateData.rates[item.currency],
          },
        ];
        return true;
      });
      this.setState({
        displayedCurrency: newDisplayedCurrency,
      });
    }
  };

  generateContent = () => {
    const { displayedCurrency, baseNumber, baseCurrency } = this.state;
    let renderedItem = null;
    if (displayedCurrency) {
      renderedItem = displayedCurrency.map(item => (
        <CurrencyPanel
          key={item.currency}
          item={item}
          baseNumber={baseNumber}
          baseCurrency={baseCurrency}
        />
      ));
    }
    return renderedItem;
  };

  render() {
    const {
      intl,
      exchangeRateLoading,
      exchangeRateData,
      exchangeRateLoaded,
    } = this.props;
    const { baseCurrency, baseNumber } = this.state;
    return (
      <AppWrapper>
        <Header>
          <DateLabel float="right" basic>
            {intl.formatMessage({ id: 'general.date' })}:{' '}
            {exchangeRateData ? (
              exchangeRateData.date
            ) : (
              <FormattedMessage id="general.loading" />
            )}
          </DateLabel>
          <Button
            disabled={exchangeRateLoading}
            circular
            icon
            size="tiny"
            onClick={() => this.getExchangeRate()}
          >
            <Icon name="refresh" />
          </Button>
        </Header>
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
          value={typeof baseNumber === 'number' ? baseNumber : ''}
          onChange={this.handleBaseNumberChanges}
        />
        <ContentWrapper>{this.generateContent()}</ContentWrapper>
        <SubmitCurrencyWrapper>
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
        </SubmitCurrencyWrapper>
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
