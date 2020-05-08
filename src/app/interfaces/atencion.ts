import { Escritorio } from './escritorio';
import { Ticket } from './ticket';

export interface Atencion {
    id: string;
    escritorio: Escritorio;
    ticket: Ticket;
}