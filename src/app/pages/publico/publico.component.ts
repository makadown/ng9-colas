import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.component.html',
  styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit {

  constructor(private socketService: WebsocketService) { }

  ngOnInit(): void {
   /*  const body = document.getElementsByTagName('body')[0];
    body.classList.remove('container'); */
  }

}
