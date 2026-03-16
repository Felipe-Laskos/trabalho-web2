import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent implements OnInit {
  minhasSolicitacoes: any[] = [
    { id: 101, data: '2026-03-10 09:00', equipamento: 'Notebook Dell Inspiron', estado: 'ABERTA' },
    { id: 102, data: '2026-03-12 14:30', equipamento: 'Impressora Epson L3150', estado: 'ORÇADA' },
    { id: 103, data: '2026-03-14 11:15', equipamento: 'Monitor LG UltraWide', estado: 'ARRUMADA' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.minhasSolicitacoes.sort((a, b) => a.data.localeCompare(b.data));
  }

  abrirAcao(solicitacao: any) {
    if (solicitacao.estado === 'ORÇADA') {
      this.router.navigate(['/cliente/orcamento', solicitacao.id]);
    } else if (solicitacao.estado === 'ARRUMADA') {
      this.router.navigate(['/cliente/pagamento', solicitacao.id]);
    } else {
      this.router.navigate(['/cliente/visualizar', solicitacao.id]);
    }
  }
}