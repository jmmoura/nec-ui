import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  LoadingController,
} from "@ionic/angular/standalone";
import { AuthService } from "../service/authentication/auth.service";
import { Authentication } from "../model/Authentication";
import { SharedLink } from "../model/SharedLink";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    FormsModule,
  ],
})
export class LoginPage implements OnInit {
  model = { username: "", password: "" };
  error = "";
  loading: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params["sharedLink"]) {
        this.showLoading();

        const authRequest: SharedLink = { access: params["sharedLink"] };
        this.authService.loginWithToken(authRequest).subscribe({
          next: (authResult) => {
            if (authResult) {
              this.setSession(authResult);
              this.loading.dismiss();
              this.router.navigate(["territory-details"]);
            }
          },
          error: (err) => {
            if (err.status === 401 || err.status === 403) {
              this.authService.logout();
              this.error = "Acesso inválido ou expirado";
              return;
            }
            this.loading.dismiss();
            this.error = "Erro de rede";
          },
        });
      }
    });
  }

  submit(form?: any) {
    if (form?.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.showLoading();

    this.error = "";
    this.authService.login(this.model.username, this.model.password).subscribe({
      next: (authResult) => {
        this.loading.dismiss();
        if (!authResult) {
          this.error = "Credenciais inválidas";
          return;
        }
        this.setSession(authResult);
        this.router.navigateByUrl("/home");
      },
      error: () => {
        this.loading.dismiss();
        this.error = "Erro de rede";
      },
    });
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Aguarde. Entrando no app.",
    });

    this.loading.present();
  }

  private setSession(authResult: Authentication) {
    localStorage.setItem(
      "accessToken",
      authResult.tokenType + " " + authResult.accessToken
    );
    localStorage.setItem("user", JSON.stringify(authResult.user));
  }
}
