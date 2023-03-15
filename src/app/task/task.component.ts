import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from "../models/task";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() edit: EventEmitter<Task> = new EventEmitter<Task>(); // modified

  constructor() { }

  ngOnInit(): void {
  }

}
