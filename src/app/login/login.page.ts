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
  IonCardContent
} from "@ionic/angular/standalone";
import { LoadingController } from '@ionic/angular';
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
    FormsModule
  ],
})
export class LoginPage implements OnInit {
  model = { username: "", password: "" };
  error = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params['sharedLink']) {
        const loading = await this.loadingCtrl.create({ message: 'Aguarde. Entrando no app.' });
        await loading.present();
        const authRequest: SharedLink = { access: params['sharedLink'] };
        this.authService.loginWithToken(authRequest).subscribe({
          next: async (authResult) => {
            await loading.dismiss();
            if (authResult) {
              this.setSession(authResult);
              this.router.navigate(['territory-details']);
            }
          },
          error: async (err) => {
            await loading.dismiss();
            if (err.status === 401 || err.status === 403) {
              this.authService.logout();
              this.error = "Acesso inválido ou expirado";
              return;
            }
            this.error = "Erro de rede";
          }
        });
      }
    });
    }

  async submit(form?: any) {
    if (form?.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.error = "";
    const loading = await this.loadingCtrl.create({ message: 'Aguarde. Entrando no app.' });
    await loading.present();
    this.authService.login(this.model.username, this.model.password).subscribe({
      next: async (authResult) => {
        await loading.dismiss();
        if (!authResult) {
          this.error = "Credenciais inválidas";
          return;
        }
        this.setSession(authResult);
        this.router.navigateByUrl("/home");
      },
      error: async () => {
        await loading.dismiss();
        this.error = "Erro de rede";
      }
    });
  }

  private setSession(authResult: Authentication) {
    localStorage.setItem('accessToken', authResult.tokenType + ' ' + authResult.accessToken);
    localStorage.setItem('user', JSON.stringify(authResult.user));
  }
}
