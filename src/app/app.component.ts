import {Component} from '@angular/core';
import {Task} from "./models/task";
import {TaskDialogResult} from "./models/dialog";
import {CdkDragDrop, transferArrayItem} from "@angular/cdk/drag-drop";
import {TaskDialogComponent} from "./task-dialog/task-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {BehaviorSubject, Observable} from "rxjs";


const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-firebase-discovery';


  todo = getObservable(this.fbStore.collection('todo')) as Observable<Task[]>;
  inProgress = getObservable(this.fbStore.collection('inProgress')) as Observable<Task[]>;
  done = getObservable(this.fbStore.collection('done')) as Observable<Task[]>;


  constructor(private dialog: MatDialog,
              private fbStore: AngularFirestore) {
  }

  drop(event: any/*event: CdkDragDrop<Task[]>*/): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];

    this.fbStore.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.fbStore.collection(event.previousContainer.id).doc(item.id).delete(),
        this.fbStore.collection(event.container.id).doc(item.id).set(item)
      ]);
      return promise;
    })

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
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        this.fbStore.collection('todo').add(result.task)
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent,
      {
        width: "270px",
        data: {
          task,
          enableDelete: true,
        }
      }
    );
    dialogRef.afterClosed().subscribe(
      (result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        if (result.delete) {
          this.fbStore.collection(list).doc(task.id).delete();
        } else {
          this.fbStore.collection(list).doc(task.id).update(task);
        }
      }
    )
  }

}
