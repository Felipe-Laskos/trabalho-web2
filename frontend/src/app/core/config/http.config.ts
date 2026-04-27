import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const API_URL = environment.apiUrl;

export const defaultHttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};