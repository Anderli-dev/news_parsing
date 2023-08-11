import { createSlice  } from '@reduxjs/toolkit'

export const tabKeySlice = createSlice ({
  name: 'tabsKey',
    initialState: {tabs: {
            home: 0,
            posts: 1,
            users: 2,
            roles: 3,
            parsing: 4,
        }},
})

export default tabKeySlice.reducer