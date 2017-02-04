/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { selectLocale } from './selectors';
import moment from 'moment';
import { LocaleProvider } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';
import thTH from './th_TH';

import 'moment/locale/th';

export class LanguageProvider extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { locale, children, messages } = this.props;
    moment.locale(locale);
    return (
      <LocaleProvider locale={locale === 'th' ? thTH : enUS}>
        <IntlProvider locale={locale} key={locale} messages={messages[locale]}>
          {React.Children.only(children)}
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

LanguageProvider.propTypes = {
  locale: React.PropTypes.string,
  messages: React.PropTypes.object,
  children: React.PropTypes.element.isRequired,
};


const mapStateToProps = createSelector(
  selectLocale(),
  (locale) => ({ locale })
);

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageProvider);
