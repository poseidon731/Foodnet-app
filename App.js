import React from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@modules';
import AppContainer from '@navigations';

import i18n from '@utils/i18n';

i18n.setI18nConfig();
LogBox.ignoreAllLogs(true);

global.internet = true;

export default App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
}