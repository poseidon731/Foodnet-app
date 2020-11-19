import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import authReducer from '@modules/reducers/auth';

const peresistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: null,
  whitelist: ['auth'],
  blacklist: [''],
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(peresistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));

let persistor = persistStore(store);

export { store, persistor };
