import {Component} from '@angular/core';
import {Task} from "./models/task";
import {TaskDialogResult} from "./models/dialog";
import {CdkDragDrop, transferArrayItem} from "@angular/cdk/drag-drop";
import {TaskDialogComponent} from "./task-dialog/task-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-firebase-discovery';

  todo: Task[] = [
    {title: 'Task 1', description: 'Description 1'},
    {title: 'Task 2', description: 'Description 2'},
    {title: 'Task 3', description: 'Description 3'},
  ];

  inProgress: Task[] = [];

  done: Task[] = [];

  constructor(private dialog: MatDialog){
  }


  editTask(list: string, task: Task): void {
    console.log('Edit Task');
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }

    if (!event.container.data || !event.previousContainer.data) {
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {}
      }
    });

    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined ) => {
        if (!result) {
          return;
        }
        this.todo.push(result.task);
      });
  }
}
