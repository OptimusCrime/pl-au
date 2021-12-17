import {PlayerData} from "./types";
import {SettingsFilter, SettingsSort} from "./store/settingsReducer";
import {ALL_TEAMS} from "./constants";
import {shuffleArray} from "./utilities";

const getSortParams = (a: PlayerData, b: PlayerData, sort: SettingsSort): number[] => {
  switch (sort) {
    case "selectedByPercent":
      return [a.selectedByPercent, b.selectedByPercent];
    case "minutes":
      return [a.minutes, b.minutes];
    case "totalPoints":
    default:
      return [a.totalPoints, b.totalPoints];
  }
}

const constructArrayWithTop16PlayersFromEachTeam = (allPlayers: PlayerData[]): number[] => {
  const teamGroupedArray: { [key: number]: { id: number, totalPoints: number }[] } = {};
  for (const currentPlayer of allPlayers) {
    const payload = {
      id: currentPlayer.id,
      totalPoints: currentPlayer.totalPoints
    };

    if (!(currentPlayer.team in teamGroupedArray)) {
      teamGroupedArray[currentPlayer.team] = [payload];
    } else {
      teamGroupedArray[currentPlayer.team].push({...payload});
    }
  }

  const top16PlayersFromEachTeam: number[] = [];

  for (const players of Object.values(teamGroupedArray)) {
    top16PlayersFromEachTeam.push(
      ...players
        .sort((a, b) => {
          if (a.totalPoints > b.totalPoints) {
            return -1;
          }
          if (a.totalPoints < b.totalPoints) {
            return 1;
          }
          return 0;
        })
        .map(player => player.id)
        .slice(0, 16)
    );
  }

  return top16PlayersFromEachTeam;
};

export const selectPlayers = (allPlayers: PlayerData[], settings: SettingsFilter, sort: SettingsSort): PlayerData[] => {
  const top16PlayerFromEachTeam: number[] = settings.includeOnlyTop16FromEachTeam
    ? constructArrayWithTop16PlayersFromEachTeam(allPlayers)
    : [];

  const selectedPlayer = allPlayers.filter(player => {
    if (settings.team !== ALL_TEAMS && settings.team !== player.team) {
      return false;
    }
    if (settings.exclude0Minutes && player.minutes === 0) {
      return false;
    }
    if (settings.exclude0Points && player.totalPoints === 0) {
      return false;
    }
    if (settings.includeOnlyTop16FromEachTeam && !top16PlayerFromEachTeam.includes(player.id)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const [aValue, bValue] = getSortParams(a, b, sort);
    if (aValue > bValue) {
      return -1;
    }
    if (aValue < bValue) {
      return 1;
    }
    return 0;
  });

  if (sort !== "random") {
    return selectedPlayer;
  }

  return shuffleArray(selectedPlayer);
}
