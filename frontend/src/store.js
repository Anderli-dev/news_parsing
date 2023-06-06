import { configureStore } from '@reduxjs/toolkit'
import permissionsReducer from "./store/userPermisions";

export default configureStore({
  reducer: {
    permissions: permissionsReducer,
  },
})