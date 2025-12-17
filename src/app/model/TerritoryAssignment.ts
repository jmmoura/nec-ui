export interface TerritoryAssignment {
  id?: number | null;
  territoryName: string;
  territoryNumber: string;
  assignedToPersonId?: number | null;
  assignedToPersonName?: string | null;
  assignmentDate?: string | null;
  completedDate?: string | null;
  territoryWarningMessage?: string | null;
}