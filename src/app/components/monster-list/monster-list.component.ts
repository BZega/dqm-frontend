import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monster-list',
  templateUrl: './monster-list.component.html',
  styleUrls: ['./monster-list.component.scss']
})
export class MonsterListComponent implements OnInit {
  content: string = "Random content";

  constructor() { }

  ngOnInit(): void {

  }
}
