import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Import standalone Ionic components
import { IonList, IonModal, IonNote, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton, IonInput, IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'app-manage-territories',
  templateUrl: './manage-territories.page.html',
  styleUrls: ['./manage-territories.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
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
    IonNote
  ],
})
export class ManageTerritoriesPage implements OnInit {
  territories: any[] = [];
  totalTerritories = 0;
  assignedTerritories = 0;
  unassignedTerritories = 0;

  isAddTerritoryModalOpen = false;
  newTerritory = { name: '', number: '' };

  isEditTerritoryModalOpen = false;
  selectedTerritory: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTerritories();
  }

  loadTerritories() {
    this.http.get<any[]>('assets/territories.json').subscribe((data) => {
      this.territories = data;
      this.calculateStatistics();
    });
  }

  calculateStatistics() {
    this.totalTerritories = this.territories.length;
    this.assignedTerritories = this.territories.filter((t) => t.assignedTo).length;
    this.unassignedTerritories = this.totalTerritories - this.assignedTerritories;
  }

  openAddTerritoryModal() {
    this.isAddTerritoryModalOpen = true;
  }

  closeAddTerritoryModal() {
    this.isAddTerritoryModalOpen = false;
    this.newTerritory = { name: '', number: '' };
  }

  isFormValid() {
    return (
      this.newTerritory.name.trim() !== '' &&
      this.newTerritory.number.trim() !== '' &&
      !this.territories.some((t) => t.number === this.newTerritory.number)
    );
  }

  addTerritory() {
    if (this.isFormValid()) {
      this.territories.push({ ...this.newTerritory, assignedTo: null, assignmentDate: null });
      this.calculateStatistics();
      this.closeAddTerritoryModal();
    }
  }

  openEditTerritoryModal(territory: any) {
    console.log('Opening edit modal for territory:', territory);
    this.selectedTerritory = { ...territory }; // Clone the territory to avoid direct mutation
    this.isEditTerritoryModalOpen = true;
  }

  closeEditTerritoryModal() {
    this.isEditTerritoryModalOpen = false;
    this.selectedTerritory = null;
  }

  saveTerritory() {
    console.log('Saving territory:', this.selectedTerritory);
    const index = this.territories.findIndex((t) => t.number === this.selectedTerritory.number);
    if (index !== -1) {
      this.territories[index] = { ...this.selectedTerritory };
      this.calculateStatistics();
      this.closeEditTerritoryModal();
    }
  }

  deleteTerritory(territory: any) {
    this.territories = this.territories.filter((t) => t !== territory);
    this.calculateStatistics();
  }
}