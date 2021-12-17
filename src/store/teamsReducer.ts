import {createSlice} from "@reduxjs/toolkit";

import data from '../data/data.json';
import {TeamData} from "../types";

interface TeamsState {
  teams: TeamData[];
}

const initialState: TeamsState = {
  teams: data.teams.map(team => ({
    id: team.id.toString(),
    name: team.name
  }))
}

const teamsReducer = createSlice({
  name: 'teams',
  initialState,
  reducers: {
  },
});

export default teamsReducer.reducer;
