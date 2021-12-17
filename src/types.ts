export interface TeamData {
  id: string;
  name: string;
}

export type PlayerData = {
  id: number;
  firstName: string;
  lastName: string;
  team: string;
  selectedByPercent: number;
  minutes: number;
  totalPoints: number;
  picture: string;
  shirtNum: number;
  position: string;
};
