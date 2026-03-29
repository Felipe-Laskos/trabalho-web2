import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidarCpf(): ValidatorFn {
  return (controle: AbstractControl): ValidationErrors | null => {
    const valorCpf = controle.value;
    if (!valorCpf) return null;

    const cpfApenasNumeros = valorCpf.replace(/[^\d]+/g, '');

    if (cpfApenasNumeros.length !== 11 || !!cpfApenasNumeros.match(/(\d)\1{10}/)) {
      return { cpfInvalido: true };
    }

    const calcularDigito = (corpoCpf: string, multiplicador: number): number => {
      let soma = 0;
      for (let i = 0; i < corpoCpf.length; i++) {
        soma += parseInt(corpoCpf[i]) * (multiplicador - i);
      }
      const resto = (soma * 10) % 11;
      return resto === 10 || resto === 11 ? 0 : resto;
    };

    const digito1 = calcularDigito(cpfApenasNumeros.substring(0, 9), 10);
    const digito2 = calcularDigito(cpfApenasNumeros.substring(0, 10), 11);

    if (digito1 !== parseInt(cpfApenasNumeros[9]) || digito2 !== parseInt(cpfApenasNumeros[10])) {
      return { cpfInvalido: true };
    }
    return null;
  };
}