import { Component } from '@angular/core';
import {Task} from "./models/task";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-firebase-discovery';

  todo: Task[]  = [
    {title: 'Task 1', description: 'Description 1'},
    {title: 'Task 2', description: 'Description 2'},
    {title: 'Task 3', description: 'Description 3'},
  ];

}
