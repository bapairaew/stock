// Fix issue that navigating between same page with different params meter
// does not trigger componentDidMount which consequently make the page not
// re-fetch the data

import React from 'react';
import StockPage from './index';

const BuyPage = (props) => (
  <StockPage {...props} />
);

export default SellPage;
