import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../store/hooks";

import './settings.scss';
import {
  isSettingsSort,
  updateExclude0Minutes,
  updateExclude0Points, updateIncludeOnlyTop16FromEachTeam, updateOptions,
  updateOptionsInformation,
  updateShowInformation, updateSort,
  updateTeam
} from "../../store/settingsReducer";
import {ALL_TEAMS} from "../../constants";
import {updatePlayers} from "../../store/playersReducer";
import {selectPlayers} from "../../selectPlayers";

const SettingsCheckbox = ({
                            text,
                            type,
                            checked,
                            onClick
                          }: { text: string; type: string; checked: boolean, onClick: () => void }) => {
  const id = `${type}_${text.replace(/[^a-z]*/g, '').toLowerCase()}`;

  return (
    <div className="settings-checkbox">
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={onClick}
      />
      <label
        htmlFor={id}
      >
        {text}
      </label>
    </div>
  )
}

export const Settings = ({ startGame }: { startGame: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {settings, players, teams} = useAppSelector(state => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updatePlayers(selectPlayers(players.allPlayers, settings.filterSettings, settings.sort)));
  }, [settings.filterSettings, settings.sort]);

  return (
    <div className="settings">
      <div className="settings-information">
        <div>
          <p>Players: {players.selectedPlayers.length} of {players.allPlayers.length}</p>
        </div>
        <div>
          <button onClick={() => startGame(true)}>
            Play!
          </button>
        </div>
      </div>
      <div className="settings-form">
        <div className="settings-form--section">
          <h3>Shown information</h3>
          <div className="settings-select-block">
            <SettingsCheckbox
              text="Name"
              type="shown"
              checked={settings.showInformation.name}
              onClick={() => dispatch(updateShowInformation("name"))}
            />
            <SettingsCheckbox
              text="Picture"
              type="shown"
              checked={settings.showInformation.picture}
              onClick={() => dispatch(updateShowInformation("picture"))}
            />
            <SettingsCheckbox
              text="Team"
              type="shown"
              checked={settings.showInformation.team}
              onClick={() => dispatch(updateShowInformation("team"))}
            />
            <SettingsCheckbox
              text="Shirt number"
              type="shown"
              checked={settings.showInformation.shirtNumber}
              onClick={() => dispatch(updateShowInformation("shirtNumber"))}
            />
            <SettingsCheckbox
              text="Position"
              type="shown"
              checked={settings.showInformation.position}
              onClick={() => dispatch(updateShowInformation("position"))}
            />
          </div>
        </div>
        <div className="settings-form--section">
          <h3>Options information</h3>
          <div className="settings-select-block">
            <SettingsCheckbox
              text="Name"
              type="options"
              checked={settings.optionsInformation.name}
              onClick={() => dispatch(updateOptionsInformation("name"))}
            />
            <SettingsCheckbox
              text="Picture"
              type="options"
              checked={settings.optionsInformation.picture}
              onClick={() => dispatch(updateOptionsInformation("picture"))}
            />
            <SettingsCheckbox
              text="Team"
              type="options"
              checked={settings.optionsInformation.team}
              onClick={() => dispatch(updateOptionsInformation("team"))}
            />
            <SettingsCheckbox
              text="Shirt number"
              type="options"
              checked={settings.optionsInformation.shirtNumber}
              onClick={() => dispatch(updateOptionsInformation("shirtNumber"))}
            />
            <SettingsCheckbox
              text="Position"
              type="options"
              checked={settings.optionsInformation.position}
              onClick={() => dispatch(updateOptionsInformation("position"))}
            />
          </div>
        </div>
        <div className="settings-form--section">
          <h3>Other settings</h3>
          <div className="settings-select">
            <label className="block" htmlFor="settings_team">Team</label>
            <select
              id="settings_team"
              name="settings_team"
              defaultValue={settings.filterSettings.team}
              onChange={e => {
                dispatch(updateTeam(e.target.value));
              }}
            >
              <option value={ALL_TEAMS}>All teams</option>
              {teams.teams.map(team => (
                <option
                  key={team.id}
                  value={team.id}
                >
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="settings-select-block">
            <SettingsCheckbox
              text="Exclude players with 0 points"
              type="other-settings"
              checked={settings.filterSettings.exclude0Points}
              onClick={() => dispatch(updateExclude0Points())}
            />
            <SettingsCheckbox
              text="Exclude players with 0 minutes"
              type="other-settings"
              checked={settings.filterSettings.exclude0Minutes}
              onClick={() => dispatch(updateExclude0Minutes())}
            />
            <SettingsCheckbox
              text="Include only top 16 players from each team"
              type="other-settings"
              checked={settings.filterSettings.includeOnlyTop16FromEachTeam}
              onClick={() => dispatch(updateIncludeOnlyTop16FromEachTeam())}
            />
          </div>
          <div className="settings-select">
            <label className="block" htmlFor="settings_sort">Sort players by</label>
            <select
              id="settings_sort"
              name="settings_sort"
              defaultValue={settings.sort}
              onChange={e => {
                const value = e.target.value;
                if (isSettingsSort(value)) {
                  dispatch(updateSort(value));
                } else {
                  console.error("Woops!");
                }
              }}
            >
              <option value="random">Random</option>
              <option value="totalPoints">Total points</option>
              <option value="selectedByPercent">Selected by percent</option>
              <option value="minutes">Minutes played</option>
            </select>
          </div>
          <div className="settings-select">
            <label className="block" htmlFor="settings_options">Number of options</label>
            <select
              id="settings_options"
              name="settings_options"
              defaultValue={settings.options}
              onChange={e => dispatch(updateOptions(Number(e.target.value)))}
            >
              <option value="2">2 options</option>
              <option value="3">3 options</option>
              <option value="5">5 options</option>
              <option value="10">10 options</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
