import * as https from "https";
import * as fs from "fs";
import * as path from "path";

import fetch from 'node-fetch';

import {
  PlayerData,
  PulseLiveData,
  PulseLiveResponse,
  StaticDataPlayerData,
  StaticDataResponse,
  TeamData
} from "./types";

const fetchWrapper = async<R>(url: string, headers: {[key: string]: string}): Promise<R> => {
  return await fetch(url, {
    method: "GET",
    headers: headers,
    agent: new https.Agent({
      rejectUnauthorized: false,
    })}).then(async(res) => {
    if (!res.ok) {
      throw new Error("Woops");
    }

    const data = await res.text();
    return JSON.parse(data.trim()) as R;
  });
}

const fetchStaticData = async (): Promise<{
  teams: TeamData[],
  players: StaticDataPlayerData[]
}> => {
  const response = await fetchWrapper<StaticDataResponse>("https://fantasy.premierleague.com/api/bootstrap-static/", {
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 OPR/82.0.4227.23",
    "Accept": "*/*"
  });

  const { teams, elements } = response;

  return {
    teams: teams.map(team => ({
      id: team.id,
      name: team.name,
    })),
    players: elements.map(player => ({
      id: player.code,
      firstName: player.first_name,
      lastName: player.second_name,
      team: player.team,
      selectedByPercent: Number(player.selected_by_percent),
      minutes: player.minutes,
      totalPoints: player.total_points,
      picture: `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`
    }))
  }
};

const fetchPlayersExtraData = async (): Promise<PulseLiveData[]> => {
  const data = [];
  let page = 0;

  while (true) {
    const response = await fetchWrapper<PulseLiveResponse>(`https://footballapi.pulselive.com/football/players?pageSize=30&compSeasons=418&altIds=true&page=${page}&type=player&id=-1&compSeasonId=418}`, {
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 OPR/82.0.4227.23",
      "Accept": "*/*",
      "Origin": "https://www.premierleague.com"
    });

    if (response.content && response.content.length > 0) {
      data.push(...response.content);
      console.log(`Fetched ${data.length} players. Page ${page + 1}`);
      page++;
    }
    else {
      break;
    }

    if (response.content.length !== 30) {
      break;
    }
  }

  return data.map(player => ({
    id: Number(player.altIds.opta.replace(/[^\d]/g, "")),
    shirtNum: player.info.shirtNum,
    position: player.info.positionInfo,
  }));
};

const mapPlayersData = (playersData: StaticDataPlayerData[], playersExtraData: PulseLiveData[]): PlayerData[] => {
  const response = [];

  for (const player of playersData) {
    const playerExtraData = playersExtraData.find(playerExtraData => playerExtraData.id === player.id);
    if (!playerExtraData) {
      continue;
    }

    response.push({
      ...player,
      ...playerExtraData
    });
  }

  return response;
}

const fetchData = async(): Promise<{
  teams: TeamData[];
  players: PlayerData[];
}> => {
  const { teams: teamsData, players: playersData } = await fetchStaticData();

  console.log(`Fetched ${teamsData.length} teams`);
  console.log(`Fetched ${playersData.length} players`);
  console.log("");

  const playersExtraData = await fetchPlayersExtraData();

  console.log(`Fetched a total of ${playersExtraData.length} players`);
  console.log("");

  const mappedPlayers = mapPlayersData(playersData, playersExtraData);

  console.log(`Mapped a total of ${mappedPlayers.length} players`);
  console.log("");

  return {
    teams: teamsData,
    players: mappedPlayers
  }
};


const run = async (): Promise<void> => {
  console.log("Preparing to fetch data");
  console.log("");

  const data = await fetchData();

  await fs.writeFileSync(path.join("..", "src", "data", "data.json"), JSON.stringify(data));
};

run().then(() => console.log("Finished running"));
