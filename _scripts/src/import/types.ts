///////////////////////////////////////////////////////
// PulseLive stuff
///////////////////////////////////////////////////////

export interface PulseLiveData {
  id: number;
  shirtNum: number;
  position: string;
}

export interface PulseLiveResponse {
  pageInfo: object;
  content: {
    playerId: number;
    info: {
      position: string;
      shirtNum: number;
      positionInfo: string;
      nationalTeam: object;
      currentTeam: object;
      birth: object;
      name: object;
      id: number;
    };
    altIds: {
      opta: string;
    }
  }[]
}

///////////////////////////////////////////////////////
// Static data stuff
///////////////////////////////////////////////////////

export interface StaticDataPlayerData {
  id: number;
  firstName: string;
  lastName: string;
  team: number;
  selectedByPercent: number;
  minutes: number;
  totalPoints: number;
  picture: string;
}

export interface StaticDataResponse {
  events: any[];
  gate_settings: object;
  phases: any[];
  teams: {
    id: number;
    name: string;
  }[];
  total_players: number;
  elements: {
    code: number;
    first_name: string;
    second_name: string;
    team: number;
    selected_by_percent: string;
    minutes: number;
    total_points: number;
  }[];
  element_stats: any[];
  element_types: any[];
}

///////////////////////////////////////////////////////
// Final data structures
///////////////////////////////////////////////////////

export interface TeamData {
  id: number;
  name: string;
}

export type PlayerData = StaticDataPlayerData & {
  shirtNum: number;
  position: string;
};
