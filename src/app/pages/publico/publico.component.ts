import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ColaService } from 'src/app/services/colas.service';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.component.html',
  styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit {

  constructor(private socketService: WebsocketService,
    private colaService: ColaService) { }

  ngOnInit(): void {
    /*  const body = document.getElementsByTagName('body')[0];
     body.classList.remove('container'); */
  }

}
