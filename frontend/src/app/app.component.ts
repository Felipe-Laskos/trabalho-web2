import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SolicitacaoService } from './core/services/solicitacao.service';
import { FuncionarioService } from './core/services/funcionario.service';
import { ClienteService } from './core/services/cliente.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private solicitacaoService = inject(SolicitacaoService);
  private funcionarioService = inject(FuncionarioService);
  private clienteService = inject(ClienteService);
}
