import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ColaService } from 'src/app/services/colas.service';
import { Title } from '@angular/platform-browser';
import { Atencion } from 'src/app/interfaces/atencion';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * Este componente simula las pantallas que el publico verá mientras espera.
 * Tiene un mero caracter informativo.
 */
@Component({
  selector: 'app-publico',
  templateUrl: './publico.component.html',
  styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit, OnDestroy {

  onDestroy$ = new Subject();

  /**
   * Esta atencion siempre estará representando los primeros 4 elementos de la cola,
   * el server enviará inicialmente 4 dummys. Los cuales serán ignorados en pantalla.
   * Aquí también los inicializo para evitar la fatiga de estar validando en html
   */
  cola: Atencion[] = [
    { id: '', escritorio: { id: '', numero: 0 }, ticket: { id: '', numero: 0 } },
    { id: '', escritorio: { id: '', numero: 0 }, ticket: { id: '', numero: 0 } },
    { id: '', escritorio: { id: '', numero: 0 }, ticket: { id: '', numero: 0 } },
    { id: '', escritorio: { id: '', numero: 0 }, ticket: { id: '', numero: 0 } }
  ];

  constructor(private socketService: WebsocketService,
    private colaService: ColaService, private titleService: Title) {

  }

  ngOnInit(): void {
    /*  const body = document.getElementsByTagName('body')[0];
     body.classList.remove('container'); */
    this.titleService.setTitle('Pantalla de espera');
    this.colaService.getCola()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cola: Atencion[]) => this.cola = [...cola]);

    this.escucharSockets();
  }
  /**
   * Método para escuchar socket de asignacion de atencion a cola.
   */
  escucharSockets() {
    this.socketService.listen('agregar-a-cola').subscribe((atencion: Atencion) => {
      /* agrego atencion al primer elemento. Si, voy a tener mas de 4, 
      pero siempre estaré mostrando los primeros 4 */
      this.cola.unshift(atencion);
		});
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
