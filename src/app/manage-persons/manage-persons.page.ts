import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
} from "@ionic/angular/standalone";
import { PersonService } from "../service/person/person.service";
import { Person } from "src/app/model/Person";
import { pencil, add, trash } from "ionicons/icons";
import { AuthService } from "../service/authentication/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-manage-persons",
  templateUrl: "./manage-persons.page.html",
  styleUrls: ["./manage-persons.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    CommonModule,
    FormsModule,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    IonToast,
  ],
})
export class ManagePersonsPage implements OnInit {
  persons: Person[] = [];
  loading = false;

  // Form model: only name
  form: Partial<Person> = {};
  isEditing = false;
  toastMessage = "";

  // expose icons to the template
  readonly pencil = pencil;
  readonly add = add;
  readonly trash = trash;

  constructor(
    private personService: PersonService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPersons();
  }

  private loadPersons() {
    this.loading = true;
    this.personService.getAllPersons().subscribe({
      next: (list) => {
        this.persons = list;
        if (
          this.isEditing &&
          this.form?.id &&
          !list.find((p) => p.id === this.form.id)
        ) {
          this.resetForm();
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
        }
      },
    });
  }

  selectToEdit(p: Person) {
    this.form = { ...p };
    this.isEditing = true;
  }

  newPerson() {
    this.resetForm();
    this.isEditing = false;
  }

  save() {
    const name = (this.form.name || "").trim();
    if (!name) {
      this.showToast("Nome é obrigatório.");
      return;
    }
    const existing = this.persons.find(
      (p) => p.name?.toLowerCase() === name.toLowerCase()
    );

    if (!this.isEditing) {
      if (existing) {
        this.showToast("Já existe uma pessoa com esse nome.");
        return;
      }
      this.personService.add({ name }).subscribe({
        next: () => {
          this.showToast("Pessoa adicionada.");
          this.resetForm();
          this.loadPersons();
        },
        error: (err) => {
          console.error("Failed to add person", err);
          this.showToast("Falha ao adicionar pessoa.");
          if (err.status === 401 || err.status === 403) {
            this.authService.logout();
          }
        },
      });
    } else {
      if (existing && existing.id !== this.form.id) {
        this.showToast("Já existe outra pessoa com esse nome.");
        return;
      }
      const updated: Person = { id: this.form.id as number, name };
      this.personService.update(updated).subscribe({
        next: () => {
          this.showToast("Pessoa atualizada.");
          this.resetForm();
          this.isEditing = false;
          this.loadPersons();
        },
        error: (err) => {
          console.error("Failed to update person", err);
          this.showToast("Falha ao atualizar pessoa.");
          if (err.status === 401 || err.status === 403) {
            this.authService.logout();
          }
        }
      });
    }
  }

  deletePerson(p: Person) {
    const ok = window.confirm(`Remover "${p.name}"?`);
    if (!ok) return;
    this.personService.remove(p.id as number).subscribe({
      next: () => {
        this.showToast("Pessoa removida.");
        if (this.isEditing && this.form?.id === p.id) {
          this.resetForm();
        }
        this.loadPersons();
      },
      error: (err) => {
        console.error("Failed to remove person", err);
        this.showToast("Falha ao remover pessoa.");
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
        }
      }
    });
  }

  resetForm() {
    this.form = {};
    this.isEditing = false;
  }

  private showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => (this.toastMessage = ""), 2500);
  }
}
