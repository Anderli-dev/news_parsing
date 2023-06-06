import { createSlice  } from '@reduxjs/toolkit'

export const permissionsSlice = createSlice ({
  name: 'permissions',
  initialState: {list:[]},
  reducers: {
    setPermissions: (state, {payload}) => {
      state.list = payload
    },
    clearPermissions: (state) => {
      state.list = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPermissions, clearPermissions } = permissionsSlice.actions

export default permissionsSlice.reducer