import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ColaService } from 'src/app/services/colas.service';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Escritorio } from 'src/app/interfaces/escritorio';
import { Ticket } from 'src/app/interfaces/ticket';
import { Atencion } from 'src/app/interfaces/atencion';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.component.html',
  styleUrls: ['./escritorio.component.css']
})
export class EscritorioComponent implements OnInit, OnDestroy {

  onDestroy$ = new Subject();
  titulo = '';
  ticketActivo: Ticket;
  escritorios: Escritorio[] = [];
  tickets: Ticket[] = [];
  cola: Atencion[] = [];
  escritorioActivo: Escritorio;

  constructor(private socketService: WebsocketService,
    private colaService: ColaService, private titleService: Title,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      // this.escritorioActivo = +id;
      this.titulo = 'Escritorio ' + id;
      this.titleService.setTitle(this.titulo);

      this.colaService.getEscritorios()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((escritorios: Escritorio[]) => {
          this.escritorios = [...escritorios];
          if (this.escritorios.findIndex(e => e.numero === id) === -1) {
            // crear escritorio y emitir su creacion
            this.escritorioActivo = {
              id: new Date().toISOString(),
              numero: id
            };
            this.socketService.emit('crear-escritorio', this.escritorioActivo);
          } else {
            this.escritorioActivo = { ... this.escritorios.find(e => e.numero === id)[0] };
          }
        });
      this.colaService.getTickets()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((tickets: Ticket[]) => this.tickets = [...tickets]);

      this.colaService.getCola()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((atenciones: Atencion[]) => {
          this.cola = [...atenciones];
          // refresco el valor del ticket activo que el escritorio esta atendiendo
          if (this.cola.findIndex(c => c.escritorio.numero === id) > -1) {
            this.ticketActivo = { ... this.cola.find(c => c.escritorio.numero === id)[0] };
          }
        });

    });

  }

  ngOnInit(): void {
    this.escucharSockets();
  }
  /**
   * Método para escuchar socket de ticket creado.
   */
  escucharSockets() {
    this.socketService.listen('crear-ticket').subscribe((ticket: Ticket) => {
      // para no insertar un numero de ticket repetido
      if (ticket &&
        this.tickets.findIndex(e => e.numero === ticket.numero) === -1) {
        this.tickets.push(ticket);
      }
    });

    this.socketService.listen('ticket-liberado').subscribe((ticket: Ticket) => {
      // libero ticket porque ha sido atendido por otro escritorio
      this.liberarTicket(ticket);
    });
  }

  /**
   * Metodo para mandar a cola el ticket 
   */
  atenderSiguienteTicket() {
    // atiendo el primer ticket pusheado
    this.ticketActivo = { ...this.tickets[0] };
    this.liberarTicket(this.ticketActivo);
    const nuevaAtencion: Atencion = {
      id: new Date().toISOString(),
      escritorio: this.escritorioActivo,
      ticket: this.ticketActivo
    }
    this.socketService.emit('agregar-a-cola', nuevaAtencion);
  }

  /**
   * Limpia de la lista de tickets en espera
   * @param ticket 
   */
  liberarTicket(ticket: Ticket) {
    this.tickets = this.tickets.filter((t) => t.numero !== ticket.numero);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
