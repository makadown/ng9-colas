import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ColaService } from 'src/app/services/colas.service';

@Component({
  selector: 'app-nuevo-ticket',
  templateUrl: './nuevo-ticket.component.html',
  styleUrls: ['./nuevo-ticket.component.css']
})
export class NuevoTicketComponent implements OnInit {

  constructor(private socketService: WebsocketService,
    private colaService: ColaService) { }

  ngOnInit(): void {
  }

}
