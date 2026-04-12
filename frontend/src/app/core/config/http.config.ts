import { HttpHeaders } from '@angular/common/http';

export const defaultHttpOptions = {
  observe: 'response' as const,
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};