import { configureStore } from '@reduxjs/toolkit'
import permissionsReducer from "./store/userPermisions";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, permissionsReducer)

export const store = configureStore({
  reducer: {
    permissions: persistedReducer,
  },
})

export const persistor = persistStore(store)