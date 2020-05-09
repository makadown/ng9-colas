import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Escritorio } from '../interfaces/escritorio';
import { Ticket } from '../interfaces/ticket';
import { Atencion } from '../interfaces/atencion';
import { environment } from 'src/environments/environment';

/**
 * Aquí se concentran las llamadas a servicios de consulta
 */
@Injectable({providedIn: 'root'})
export class ColaService {
    constructor(private http: HttpClient) { }

    getEscritorios(): Observable<Escritorio[]> {
        return this.http.get<Escritorio[]>( environment.socketConfig.url + '/escritorios');
    }

    getTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(environment.socketConfig.url + '/tickets');
    }

    getCola(): Observable<Atencion[]> {
       return this.http.get<Atencion[]>(environment.socketConfig.url + '/cola');
    }
}
