import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone',
  standalone: true
})
export class TelefonePipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';

    let telefone = value.toString().replace(/\D/g, '');

    if (telefone.length === 11) {
      // Rm caso de celular: (00) 00000-0000
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 10) {
      // Em caso de telfone Fixo (mesmo hoje ser dificil ter): (00) 0000-0000
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return value.toString();
  }
}