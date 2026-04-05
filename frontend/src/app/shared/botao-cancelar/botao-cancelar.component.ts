import { Component, inject } from '@angular/core';
import { EventEmitter, Output, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ModalGenericoComponent } from '../modal-generico/modal-generico.component';

@Component({
  selector: 'app-botao-cancelar',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './botao-cancelar.component.html',
  styleUrl: './botao-cancelar.component.css'
})
export class BotaoCancelarComponent {
   @Input() confirmacao: boolean = false;
   @Output() clicou = new EventEmitter<void>();

   private dialog = inject(MatDialog);

  click() {
    if (this.confirmacao) {
      const dialogRef = this.dialog.open(ModalGenericoComponent, {
        data: {
          tipo: 'confirmacao',
          titulo: 'Confirmar Cancelamento',
          mensagem: 'Deseja realmente cancelar? Dados não salvos serão perdidos.',
          textoConfirmar: 'Sim, cancelar',
          textoCancelar: 'Não'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.clicou.emit();
      });
    } else {
      this.clicou.emit();
    }
  }
}
