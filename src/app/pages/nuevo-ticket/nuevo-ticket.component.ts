import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ColaService } from 'src/app/services/colas.service';
import { Title } from '@angular/platform-browser';
import { Escritorio } from 'src/app/interfaces/escritorio';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ticket } from 'src/app/interfaces/ticket';

/**
 * Componente que simula un kiosko, una pantalla unica en la que un usuario
 * llega e imprime su ticket para entrar a la cola.
 * A futuro quiza se implemente algo como varias pantallas donde los
 * clientes lleguen a generar tickets simultaneamente.
 */
@Component({
  selector: 'app-nuevo-ticket',
  templateUrl: './nuevo-ticket.component.html',
  styleUrls: ['./nuevo-ticket.component.css']
})
export class NuevoTicketComponent implements OnInit, OnDestroy {

  onDestroy$ = new Subject();

  escritorios: Escritorio[] = [];
  tickets: Ticket[] = [];

  constructor(private socketService: WebsocketService,
    private colaService: ColaService, private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Imprima su ticket de espera');
    this.colaService.getEscritorios()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((escritorios: Escritorio[]) => this.escritorios = [...escritorios]);
    this.colaService.getTickets()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((tickets: Ticket[]) => this.tickets = [...tickets]);

    this.escucharSockets();
  }
  /**
   * Método para escuchar socket de escritorio creado.
   */
  escucharSockets() {
    this.socketService.listen('crear-escritorio').subscribe((escritorio: Escritorio) => {

      // para no insertar un numero de escritorio repetido
      if (escritorio &&
        this.escritorios.findIndex(e => e.numero === escritorio.numero) === -1) {
        /* agrego atencion al primer elemento. Si, voy a tener mas de 4, 
      pero siempre estaré mostrando los primeros 4 */
        this.escritorios.unshift(escritorio);
      }
    });
  }

  crearTicket() {
    const numeroNuevo = this.tickets.length === 0 ? 1 : this.tickets[this.tickets.length-1].numero + 1;
    const nuevoTicket: Ticket = {
      id: new Date().toISOString(),
      numero: numeroNuevo
    };

    this.tickets.push(nuevoTicket);

    // emitir evento de socker, agregar marcador
    this.socketService.emit('crear-ticket', nuevoTicket);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
