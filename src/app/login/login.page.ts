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

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['sharedLink']) {
        const authRequest: SharedLink = { access: params['sharedLink'] };
        this.authService.loginWithToken(authRequest).subscribe({
          next: (authResult) => {
            if (authResult) {
              this.setSession(authResult);
              this.router.navigate(['territory-details']);
            }
          },
          error: (err) => {
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

  submit(form?: any) {
    if (form?.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.error = "";
    this.authService.login(this.model.username, this.model.password).subscribe({
      next: (authResult) => {
        if (!authResult) {
          this.error = "Credenciais inválidas";
          return;
        }
        this.setSession(authResult);
        this.router.navigateByUrl("/home");
      },
      error: () => {
        this.error = "Erro de rede";
      }
    });
  }

  private setSession(authResult: Authentication) {
    localStorage.setItem('accessToken', authResult.tokenType + ' ' + authResult.accessToken);
    localStorage.setItem('user', JSON.stringify(authResult.user));
  }
}
