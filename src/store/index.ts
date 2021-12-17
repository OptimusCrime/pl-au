import { configureStore } from '@reduxjs/toolkit';

import playersReducer from "./playersReducer";
import settingsReducer from "./settingsReducer";
import teamsReducer from "./teamsReducer";

export const store = configureStore({
  reducer: {
    players: playersReducer,
    teams: teamsReducer,
    settings: settingsReducer,
  },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
