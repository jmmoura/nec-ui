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
  IonIcon,
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
import { AddressService } from "../service/address/address.service";
import { Share } from '@capacitor/share';
import { addIcons } from 'ionicons';
import { shareOutline, logoWhatsapp, mailOutline } from 'ionicons/icons';

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
    IonIcon,
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
    private addressSvc: AddressService,
  ) {
      addIcons({shareOutline,logoWhatsapp,mailOutline});}

  ngOnInit() {
    // Ensure required Ionicons are registered so they display correctly
    addIcons({
      'share-outline': shareOutline,
      'logo-whatsapp': logoWhatsapp,
      'mail-outline': mailOutline,
    });
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

  async shareTerritoryLink() {
    if (!this.generatedLink) {
      this.showToast('Gere o link antes de compartilhar', 'warning');
      return;
    }
    const title = this.selectedTerritory?.territoryName || `Território ${this.selectedTerritory?.territoryNumber || ''}`;
    const text = `Acesse o território ${this.selectedTerritory?.territoryNumber || ''}`;
    const url = this.generatedLink;
    try {
      // Prefer Capacitor native share when available (installed app / mobile)
      const can = await Share.canShare();
      if (can?.value) {
        await Share.share({ title, text, url, dialogTitle: 'Compartilhar território' });
        return;
      }
      // Fallback to Web Share API on supporting browsers
      if (navigator && 'share' in navigator) {
        await (navigator as any).share({ title, text, url });
        return;
      }
      // Last resort: guide user to use specific channels
      this.showToast('Compartilhamento do sistema não disponível. Use WhatsApp ou Email.', 'medium');
    } catch (e) {
      // User cancelled or error
      this.showToast('Compartilhamento cancelado ou indisponível.', 'warning');
    }
  }

  shareViaWhatsApp() {
    if (!this.generatedLink) {
      this.showToast('Gere o link antes de compartilhar', 'warning');
      return;
    }
    const message = `Território ${this.selectedTerritory?.territoryNumber || ''} - ${this.selectedTerritory?.territoryName || ''}\n${this.generatedLink}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }

  shareViaEmail() {
    if (!this.generatedLink) {
      this.showToast('Gere o link antes de compartilhar', 'warning');
      return;
    }
    const subject = `Território ${this.selectedTerritory?.territoryNumber || ''} - ${this.selectedTerritory?.territoryName || ''}`;
    const body = `Olá,\n\nSegue o link do território:\n${this.generatedLink}\n\nObrigado.`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  }

  resetVisitedHousesForSelectedTerritory() {
    if (!this.selectedTerritory || !this.selectedTerritory.territoryNumber) {
      return;
    }
    const territoryNumber = this.selectedTerritory.territoryNumber;
    this.addressSvc.resetAddress({ territoryNumber }).subscribe({
      next: () => {
        this.showToast("Casas desmarcadas.", "success");
      },
      error: (err: any) => {
        console.error("Failed to reset visited houses", err);
        this.showToast("Falha ao desmarcar casas.", "danger");
        if (err.status === 401 || err.status === 403) {
          this.isEditTerritoryModalOpen = false;
          this.authService.logout();
        }
      },
    });
  }
}
