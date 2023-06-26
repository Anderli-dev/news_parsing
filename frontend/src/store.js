import { configureStore } from '@reduxjs/toolkit'
import permissionsReducer from "./store/userPermisions";
import tabKeyReducer from "./store/sideNavTab";
import tabsKeyReducer from "./store/tabsKey"
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
}

const permissionReducer = persistReducer(persistConfig, permissionsReducer)
const tabReducer = persistReducer(persistConfig, tabKeyReducer)

export const store = configureStore({
  reducer: {
    permissions: permissionReducer,
    currentTab: tabReducer,
    tabsKey: tabsKeyReducer
  },
})

export const persistor = persistStore(store)