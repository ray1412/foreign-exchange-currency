<p align="center"><img src="https://github.com/ray1412/foreign-exchange-currency/blob/master/ray1412-banner.png?raw=true" alt="ray1412-banner-logo" /></p>

## Introduction
Hi, my name is `Raymond Haryanto`. This Project is created in order to answer the challange which is coming from `Shopee ID`

## Goals
Creating Foreign Exchange Currency App which using `https://exchangeratesapi.io/` as the API.

## Support
This Project is built using `react-boilerplate`, template --> https://github.com/react-boilerplate/react-boilerplate

## Docker Support
The Dockerfile will expose port `80`, so make sure run it `<expose IP>:80`
If there is something wrong with the deployment, I'd already serve it on --> https://forex-ray.netlify.com

## Local Build Instructions
1. `git clone https://github.com/ray1412/foreign-exchange-currency`
2. `npm run install` or `yarn install`
3. `npm run build`

## Application Structure
This application is running on app/app.js.

` <Provider store={store}>
      <LanguageProvider messages={messages}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </LanguageProvider>
    </Provider>
`

It will directly go to `<App/>`, which is located on `app/containers/App/index.js`.
Below is the structure of the `<App/>` :
- Header --> displaying date and refresh button
- BaseCurrencyInput --> segment where user able to choose base currency and input the desired amount
- Content --> where list of selected currency will be shown.
- SubmitCurrency --> segment where user able to choose target currency (to be calculated)
