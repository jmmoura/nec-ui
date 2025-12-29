import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
} from "@ionic/angular/standalone";
import { ToastController } from "@ionic/angular";
import { BlockDetails } from "../model/BlockDetails";
import { TerritoryDetails } from "../model/TerritoryDetails";
import { Address } from "../model/Address";
import { BlockService } from "../service/block/block.service";
import { AddressService } from "../service/address/address.service";
import { AuthService } from "../service/authentication/auth.service";

@Component({
  selector: "app-blocks",
  templateUrl: "./blocks.page.html",
  styleUrls: ["./blocks.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSpinner,
  ],
})
export class BlocksPage implements OnInit {
  loading = false;
  territory: TerritoryDetails | null = null;
  block: BlockDetails | null = null;
  addressList: Address[] = [];
  toast: any;

  constructor(
    private router: Router,
    private blockSvc: BlockService,
    private addressSvc: AddressService,
    private authService: AuthService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.territory = navigation?.extras.state?.territory;
    const blockSummary = navigation?.extras.state?.block;
    console.log("State:", navigation?.extras.state);

    if (!this.territory || !blockSummary) {
      console.error("Territory or block data is missing!");
      this.router.navigate(["/territory-details"]);
    } else {
      this.loadBlockData(blockSummary.id);
    }
  }

  loadBlockData(blockId: number) {
    this.loading = true;
    this.blockSvc.getBlock(blockId).subscribe({
      next: (blockDetails) => {
        this.block = blockDetails;
        this.addressList = blockDetails.addressList || [];
        this.addressList.map((address) => {
          address.id = address.id || 0;
          address.street = address.street || "";
          address.number = address.number || "";
          address.visitUnallowed = address.visitUnallowed || false;
          address.visitedAt = address.visitedAt || null;
          address.visitTime = address.visitedAt
            ? this.getTimeOfDay(address.visitedAt)
            : null;
          address.visited = !!address.visitedAt;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error("Error fetching block details:", err);
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
        }
      },
    });
  }

  getTotalHouses(): number {
    // Exclude houses marked as "Não bater"
    return (
      this.addressList?.filter((address) => !address.visitUnallowed).length || 0
    );
  }

  getVisitedHouses(): number {
    // Exclude houses marked as "Não bater"
    return (
      this.addressList?.filter(
        (address) => address.visitedAt && !address.visitUnallowed
      ).length || 0
    );
  }

  getVisitedPercentage(): number {
    const total = this.getTotalHouses();
    const visited = this.getVisitedHouses();
    return total ? Math.round((visited / total) * 100) : 0;
  }

  getNoOneHomeHouses(): number {
    return this.getTotalHouses() - this.getVisitedHouses();
  }

  getNoOneHomePercentage(): number {
    const total = this.getTotalHouses();
    const noOneHome = this.getNoOneHomeHouses();
    return total ? Math.round((noOneHome / total) * 100) : 0;
  }

  getUniqueStreets(): string[] {
    return [...new Set(this.addressList.map((address) => address.street))];
  }

  getHousesByStreet(street: string): any[] {
    return this.addressList.filter((address) => address.street === street);
  }

  markVisited(house: Address, event: any) {
    if (!house.visitUnallowed) {
      // capture previous state so we can revert on failure
      const prevVisited = !!house.visited;
      const prevVisitedAt = house.visitedAt;
      const prevVisitTime = house.visitTime;

      if (event.detail.checked) {
        // Mark as visited
        house.visited = true;
        const date = new Date();
        // Create a formatter for the America/Sao_Paulo timezone in ISO format
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Sao_Paulo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        const parts = formatter.formatToParts(date);
        const year = parts.find((p) => p.type === "year")?.value;
        const month = parts.find((p) => p.type === "month")?.value;
        const day = parts.find((p) => p.type === "day")?.value;
        const hour = parts.find((p) => p.type === "hour")?.value;
        const minute = parts.find((p) => p.type === "minute")?.value;
        const second = parts.find((p) => p.type === "second")?.value;

        house.visitedAt = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
        house.visitTime = this.getTimeOfDay(house.visitedAt);
      } else {
        // Clear date and time when unchecked
        house.visited = false;
        house.visitedAt = null;
        house.visitTime = null;
      }

      this.addressSvc.updateAddress(house).subscribe({
        next: (updatedAddress) => {
          console.log("Address updated successfully:", updatedAddress);
        },
        error: async (err) => {
          console.error("Error updating address:", err);
          // Revert UI state to previous values
          house.visited = prevVisited;
          house.visitedAt = prevVisitedAt;
          house.visitTime = prevVisitTime;

          // Show a toast to the user
          this.presentToast("Erro ao atualizar o endereço. A alteração foi revertida.", "danger");

          if (err.status === 401 || err.status === 403) {
            this.authService.logout();
          }
        },
      });
    }
  }

  async presentToast(message: string, color: string = "primary") {
    this.toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
    });
    this.toast.present();
  }

  getTimeOfDay(date: string): string {
    const hours = new Date(date).getHours();
    if (hours < 6) return "N"; // Noite
    if (hours < 12) return "M"; // Manhã
    if (hours < 18) return "T"; // Tarde
    return "N"; // Noite
  }
}
