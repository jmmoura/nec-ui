import { BlockSummary } from "./BlockSummary";

export interface TerritoryDetails {
  id: number;
  territoryName: string;
  territoryNumber: string;
  assignedTo?: string | null;
  assignmentDate?: string | null;
  territoryTotalHouses?: number;
  territoryVisitedHouses?: number;
  noOneHomeHouses?: number;
  territoryWarningMessage?: string | null;
  territoryMapPath?: string | null;
  blocks?: BlockSummary[];
}
