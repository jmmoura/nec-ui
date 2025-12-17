import { Component, forwardRef, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

// Import standalone Ionic components
import {
  IonList,
  IonModal,
  IonNote,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/angular/standalone";

import { TerritoryAssignment } from "../model/TerritoryAssignment";
import { AssignmentService } from "../service/assignment/assignment.service";
import { Person } from 'src/app/model/Person';
import { PersonService } from 'src/app/service/person/person.service';

@Component({
  selector: "app-manage-territories",
  templateUrl: "./manage-territories.page.html",
  styleUrls: ["./manage-territories.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonTextarea,
    IonList,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonText,
  ],
})
export class ManageTerritoriesPage implements OnInit {
  territories: TerritoryAssignment[] = [];
  totalTerritories = 0;
  assignedTerritories = 0;
  unassignedTerritories = 0;
  assignedPercentage = 0;
  unassignedPercentage = 0;

  isAddTerritoryModalOpen = false;
  newTerritory = { name: "", number: "" };

  isEditTerritoryModalOpen = false;
  selectedTerritory: TerritoryAssignment | null = null;

  personList: Person[] = [];

  constructor(
    private assignmentSvc: AssignmentService,
    private personSvc: PersonService,
  ) {}

  ngOnInit() {
    this.loadTerritories();
    this.loadPersonList();
  }

  loadTerritories() {
    this.assignmentSvc.getCurrentAssignments().subscribe({
      next: (data: TerritoryAssignment[]) => {
        this.territories = data;
        this.calculateStatistics();
      },
      error: (err: any) => console.error("Failed to load territories", err),
    });
  }

  calculateStatistics() {
    this.totalTerritories = this.territories.length;
    this.assignedTerritories = this.territories.filter(
      (t) => t.assignedToPersonId
    ).length;
    this.unassignedTerritories =
      this.totalTerritories - this.assignedTerritories;

    // Calculate percentages and round them to integers
    this.assignedPercentage = this.totalTerritories
      ? Math.round((this.assignedTerritories / this.totalTerritories) * 100)
      : 0;
    this.unassignedPercentage = this.totalTerritories
      ? Math.round((this.unassignedTerritories / this.totalTerritories) * 100)
      : 0;
  }

  openAddTerritoryModal() {
    this.isAddTerritoryModalOpen = true;
  }

  closeAddTerritoryModal() {
    this.isAddTerritoryModalOpen = false;
    this.newTerritory = { name: "", number: "" };
  }

  isFormValid() {
    return (
      this.newTerritory.name.trim() !== "" &&
      this.newTerritory.number.trim() !== "" &&
      !this.territories.some((t) => t.territoryNumber === this.newTerritory.number)
    );
  }

  addTerritory() {
    if (this.isFormValid()) {
      this.territories.push({
        ...this.newTerritory,
        territoryNumber: this.newTerritory.number,
        territoryName: this.newTerritory.name,
        assignedToPersonId: null,
        assignmentDate: null,
        completedDate: null, // ensure field exists on new entries
      });
      this.calculateStatistics();
      this.closeAddTerritoryModal();
    }
  }

  loadPersonList() {
    this.personSvc.getAllPersons().subscribe({
      next: (data: Person[]) => {
        this.personList = data;
      },
      error: (err: any) => console.error('Failed to load person list', err),
    });
  }

  onAssignedPersonChange(event: any) {
    const selectedId = event && event.detail !== undefined ? event.detail.value : event;
    if (!this.selectedTerritory) return;
    this.selectedTerritory.assignedToPersonId = selectedId;
    const person = this.personList.find((p) => p.id === selectedId);
    this.selectedTerritory.assignedToPersonName = person ? person.name : null;
  }

  openEditTerritoryModal(territory: TerritoryAssignment) {
    this.selectedTerritory = {
      ...territory
    };
    this.isEditTerritoryModalOpen = true;
  }

  closeEditTerritoryModal() {
    this.isEditTerritoryModalOpen = false;
    this.selectedTerritory = null;
  }

  saveTerritory() {
    console.log("Saving territory:", this.selectedTerritory);
    this.assignmentSvc.updateAssignment(this.selectedTerritory!).subscribe({
      next: (updatedTerritory: TerritoryAssignment) => {
        this.loadTerritories();
        this.closeEditTerritoryModal();
      },
      error: (err: any) => console.error("Failed to update territory", err),
    });    
  }

  deleteTerritory(territory: any) {
    this.territories = this.territories.filter((t) => t !== territory);
    this.calculateStatistics();
  }
}
