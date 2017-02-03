// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '/a',
      name: 'app',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/App/reducer'),
          System.import('containers/App/sagas'),
          System.import('containers/App'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('app', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      onEnter(nextState, replace, callback) {
        const username = window.sessionStorage.getItem('username');
        if (!username) return window.location.assign('/');
        callback();
      },
      childRoutes: [
        {
          path: 'home',
          name: 'home',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/HomePage/reducer'),
              System.import('containers/HomePage/sagas'),
              System.import('containers/HomePage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('homePage', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        }, {
          path: 'register',
          name: 'registerPage',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/RegisterPage/reducer'),
              System.import('containers/RegisterPage/sagas'),
              System.import('containers/RegisterPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('registerPage', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
          onEnter(nextState, replace, callback) {
            const username = window.sessionStorage.getItem('username');
            if (!username) return window.location.assign('/');
            if (username !== 'admin') return window.location.assign('/a/home');
            callback();
          },
        }, {
          path: 'product/:id',
          name: 'productPage',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/ProductPage/reducer'),
              System.import('containers/ProductPage/sagas'),
              System.import('containers/ProductPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('productPage', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        }, {
          path: 'd',
          name: 'dataTable',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/DataTable/reducer'),
              System.import('containers/DataTable/sagas'),
              System.import('containers/DataTable'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('dataTable', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
          childRoutes: [
            {
              path: 'sell',
              name: 'sellPage',
              stockType: 'sell',
              getComponents(location, cb) {
                const importModules = Promise.all([
                  System.import('containers/StockPage/UploadForm'),
                  System.import('containers/StockPage/SearchModal'),
                  System.import('containers/StockPage/SellPage'),
                ])
                .then(([ form, modal, page ]) => {
                  cb(null, { uploadForm: form.default, searchModal: modal.default, page: page.default })
                });
              },
            },
            {
              path: 'buy',
              name: 'buyPage',
              stockType: 'buy',
              getComponents(location, cb) {
                const importModules = Promise.all([
                  System.import('containers/StockPage/UploadForm'),
                  System.import('containers/StockPage/SearchModal'),
                  System.import('containers/StockPage/BuyPage'),
                ])
                .then(([ form, modal, page ]) => {
                  cb(null, { uploadForm: form.default, searchModal: modal.default, page: page.default })
                });
              },
            },
            {
              path: 'products',
              name: 'productsPage',
              getComponents(location, cb) {
                const importModules = Promise.all([
                  System.import('containers/ProductsPage/SearchModal'),
                  System.import('containers/ProductsPage'),
                ])
                .then(([ modal, component ]) => {
                  cb(null, { searchModal: modal.default, page: component.default })
                });
              },
            },
          ],
        },
      ],
    }, {
      path: '/',
      name: 'loginPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/LoginPage/reducer'),
          System.import('containers/LoginPage/sagas'),
          System.import('containers/LoginPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('loginPage', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      onEnter(nextState, replace, callback) {
        const username = window.sessionStorage.getItem('username');
        if (username) return window.location.assign('/a/home');
        callback();
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
