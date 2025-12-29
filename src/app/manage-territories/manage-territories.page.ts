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
  ToastController
} from "@ionic/angular/standalone";

import { TerritoryAssignment } from "../model/TerritoryAssignment";
import { AssignmentService } from "../service/assignment/assignment.service";
import { Person } from 'src/app/model/Person';
import { PersonService } from 'src/app/service/person/person.service';
import { LinkGeneratorService } from 'src/app/service/link-generator/link-generator.service';
import { Role } from "../model/Role";
import { LinkRequest } from "../model/LinkRequest";
import { AuthService } from "../service/authentication/auth.service";
import { DateOrderDirective } from "../shared/validators/date-order.directive";

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
    DateOrderDirective,
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

  generatedLink: string | null = null;
  linkCopied = false;
  showLinkAvailable = false;
  isGeneratingLink = false;
  toast: any;

  constructor(
    private assignmentSvc: AssignmentService,
    private personSvc: PersonService,
    private linkGeneratorSvc: LinkGeneratorService,
    private authService: AuthService,
    private toastCtrl: ToastController,
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
      error: (err: any) => {
        console.error("Failed to load territories", err);
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
        }
      },
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
        completedDate: null,
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
    this.generatedLink = null;
    this.linkCopied = false;
    this.showLinkAvailable = !!this.selectedTerritory?.assignmentDate && !this.selectedTerritory?.completedDate;
  }

  closeEditTerritoryModal() {
    this.isEditTerritoryModalOpen = false;
    this.selectedTerritory = null;
    this.generatedLink = null;
    this.linkCopied = false;
    this.showLinkAvailable = false;
  }

  saveTerritory() {
    console.log("Saving territory:", this.selectedTerritory);
    this.assignmentSvc.updateAssignment(this.selectedTerritory!).subscribe({
      next: (updatedTerritory: TerritoryAssignment) => {
        // Refresh list and keep modal open; update selected territory and link availability
        this.loadTerritories();
        this.selectedTerritory = { ...updatedTerritory };
        this.showLinkAvailable = !!updatedTerritory.assignmentDate && !updatedTerritory.completedDate;
        this.generatedLink = null;
        this.linkCopied = false;
        this.showToast("Território salvo com sucesso.", "success");
      },
      error: (err: any) => {
        console.error("Failed to update territory", err);
        this.showToast("Falha ao salvar território.", "danger");
        if (err.status === 401 || err.status === 403) {
          this.isEditTerritoryModalOpen = false;
          this.authService.logout();
        }
      },
    });    
  }

  deleteTerritory(territory: any) {
    this.territories = this.territories.filter((t) => t !== territory);
    this.calculateStatistics();
  }

  generateLinkForSelectedTerritory() {
    if (!this.selectedTerritory) return;
    const linkRequest: LinkRequest = { territoryNumber: this.selectedTerritory.territoryNumber, role: Role.CONDUCTOR };
    this.isGeneratingLink = true;
    this.linkGeneratorSvc.generateTerritoryLink(linkRequest).subscribe({
      next: link => {
        this.generatedLink = link;
        this.linkCopied = false;
        this.isGeneratingLink = false;
      },
      error: (err: any) => {
        this.isGeneratingLink = false;
        console.error("Failed to get territory link", err);
        this.showToast("Falha ao gerar link.", "danger");
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
        }
      },
    });
  }

  async copyGeneratedLink() {
    if (!this.generatedLink || this.linkCopied) return;
    const text = this.generatedLink;
    try {
      if (navigator && typeof navigator.clipboard !== 'undefined') {
        await navigator.clipboard.writeText(text);
      } else {
        this.fallbackCopyTextToClipboard(text);
      }
      this.linkCopied = true;
    } catch (e) {
      // fallback attempt
      this.fallbackCopyTextToClipboard(text);
      this.linkCopied = true;
    }
  }

  private fallbackCopyTextToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textarea);
  }

  private async showToast(message: string, color: string = "primary") {
    this.toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
    });
    this.toast.present();
  }
}
