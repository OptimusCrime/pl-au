import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ALL_TEAMS} from "../constants";

const flipSettingsInformation = (oppositeSettings: SettingsInformation, currentSettings: SettingsInformation): SettingsInformation => ({
  name: oppositeSettings.name && currentSettings.name ? false : currentSettings.name,
  picture: oppositeSettings.picture && currentSettings.picture ? false : currentSettings.picture,
  team: oppositeSettings.team && currentSettings.team ? false : currentSettings.team,
  shirtNumber: oppositeSettings.shirtNumber && currentSettings.shirtNumber ? false : currentSettings.shirtNumber,
  position: oppositeSettings.position && currentSettings.position ? false : currentSettings.position,
});

interface SettingsInformation {
  name: boolean;
  picture: boolean;
  team: boolean;
  shirtNumber: boolean;
  position: boolean;
}

export interface SettingsFilter {
  exclude0Points: boolean;
  exclude0Minutes: boolean;
  includeOnlyTop16FromEachTeam: boolean;
  team: string;
}

export type SettingsSort =
  "random"
  | "totalPoints"
  | "selectedByPercent"
  | "minutes";

export const isSettingsSort = (value: string): value is SettingsSort => {
  switch (value) {
    case "random":
    case "totalPoints":
    case "selectedByPercent":
    case "minutes":
      return true;
    default:
      return false;
  }
}

export interface SettingsState {
  showInformation: SettingsInformation;
  optionsInformation: SettingsInformation;
  filterSettings: SettingsFilter;
  sort: SettingsSort;
  options: number;
}

const initialOptionsInformationState = {
  name: true,
  picture: false,
  team: false,
  shirtNumber: true,
  position: false,
};

const initialShowInformationState = {
  name: false,
  picture: true,
  team: false,
  shirtNumber: false,
  position: true,
}

const initialState: SettingsState = {
  optionsInformation: initialOptionsInformationState,
  showInformation: flipSettingsInformation(initialOptionsInformationState, initialShowInformationState),
  filterSettings: {
    exclude0Points: true,
    exclude0Minutes: true,
    includeOnlyTop16FromEachTeam: false,
    team: ALL_TEAMS
  },
  sort: "random",
  options: 3,
}

export type InformationType =
  'name'
  | 'team'
  | 'picture'
  | 'shirtNumber'
  | 'position';

const settingsReducer = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateShowInformation(state, action: PayloadAction<InformationType>) {
      // There has to be a better way of doing this...
      const updateInformation = {
        name: action.payload === "name" ? !state.showInformation.name : state.showInformation.name,
        team: action.payload === "team" ? !state.showInformation.team : state.showInformation.team,
        picture: action.payload === "picture" ? !state.showInformation.picture : state.showInformation.picture,
        shirtNumber: action.payload === "shirtNumber" ? !state.showInformation.shirtNumber : state.showInformation.shirtNumber,
        position: action.payload === "position" ? !state.showInformation.position : state.showInformation.position,
      };
      state.showInformation = updateInformation;
      state.optionsInformation = flipSettingsInformation(updateInformation, state.optionsInformation);
    },
    updateOptionsInformation(state, action: PayloadAction<InformationType>) {
      const updateInformation = {
        name: action.payload === "name" ? !state.optionsInformation.name : state.optionsInformation.name,
        team: action.payload === "team" ? !state.optionsInformation.team : state.optionsInformation.team,
        picture: action.payload === "picture" ? !state.optionsInformation.picture : state.optionsInformation.picture,
        shirtNumber: action.payload === "shirtNumber" ? !state.optionsInformation.shirtNumber : state.optionsInformation.shirtNumber,
        position: action.payload === "position" ? !state.optionsInformation.position : state.optionsInformation.position,
      };
      state.optionsInformation = updateInformation;
      state.showInformation = flipSettingsInformation(updateInformation, state.showInformation);
    },
    updateTeam(state, action: PayloadAction<string>) {
      state.filterSettings.team = action.payload;
    },
    updateExclude0Minutes(state) {
      state.filterSettings.exclude0Minutes = !state.filterSettings.exclude0Minutes;
    },
    updateExclude0Points(state) {
      state.filterSettings.exclude0Points = !state.filterSettings.exclude0Points;
    },
    updateIncludeOnlyTop16FromEachTeam(state) {
      state.filterSettings.includeOnlyTop16FromEachTeam = !state.filterSettings.includeOnlyTop16FromEachTeam;
    },
    updateSort(state, action: PayloadAction<SettingsSort>) {
      state.sort = action.payload
    },
    updateOptions(state, action: PayloadAction<number>) {
      state.options = action.payload;
    }
  },
});

export const {
  updateShowInformation,
  updateOptionsInformation,
  updateTeam,
  updateExclude0Minutes,
  updateExclude0Points,
  updateIncludeOnlyTop16FromEachTeam,
  updateSort,
  updateOptions,
} = settingsReducer.actions;
export default settingsReducer.reducer;
