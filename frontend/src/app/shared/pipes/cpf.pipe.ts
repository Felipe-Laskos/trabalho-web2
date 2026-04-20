import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpf',
  standalone: true
})
export class CpfPipe implements PipeTransform {
  
  // alterando para aceitar string ou number
  transform(value: string | number): string {
    if (!value) return '';

    // garantindo que o valor seja convertido para string antes de usar o replace
    const valorString = value.toString();
    const cpf = valorString.replace(/\D/g, '');

    if (cpf.length !== 11) return valorString;

    return cpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );
  }
}