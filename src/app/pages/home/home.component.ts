import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ColaService } from 'src/app/services/colas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private socketService: WebsocketService,
    private colaService: ColaService) { }

  ngOnInit(): void {
  }

  /**
   * Este método lo que hace es emitir creacion de nuevo escritorio al backend
   * @param numero 
   */
  entrar(numero: number) {
    if (!numero) {return;}
    this.router.navigate(['/escritorio', numero]);
  }
}
