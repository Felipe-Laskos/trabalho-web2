import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { PerfilENUM } from '../../core/models/perfilENUM.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  readonly PerfilENUM = PerfilENUM;

  logado: boolean = false;
  nomeUsuario: string = '';
  perfil: PerfilENUM | null = null;

  ngOnInit(): void {
    this.atualizarSessao();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.atualizarSessao();
      }
    });
  }

  atualizarSessao(): void {
    this.logado = this.authService.estaLogado();
    this.nomeUsuario = this.authService.getNome();
    this.perfil = this.authService.getPerfil();
  }

  efetuarLogout(): void {
    this.authService.efetuarLogout();
  }
}
