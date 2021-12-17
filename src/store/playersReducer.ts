import {createSlice, PayloadAction} from "@reduxjs/toolkit";

import data from '../data/data.json';
import {PlayerData} from "../types";

interface PlayersState {
  allPlayers: PlayerData[];
  selectedPlayers: PlayerData[];
}

const initialState: PlayersState = {
  // I am so stupid
  allPlayers: data.players.map(player => ({
    ...player,
    team: player.team.toString(),
  })) as PlayerData[],
  selectedPlayers: data.players.map(player => ({
    ...player,
    team: player.team.toString(),
  })) as PlayerData[],
}

const playersReducer = createSlice({
  name: 'players',
  initialState,
  reducers: {
    updatePlayers(state, action: PayloadAction<PlayerData[]>) {
      state.selectedPlayers = action.payload;
    },
  },
});

export const { updatePlayers } = playersReducer.actions;
export default playersReducer.reducer;
