import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { PageTitleComponent } from '../../page-title/page-title.component';
import { TaskListComponent } from '../../task-list/task-list.component';
import { StateService } from '../../../services/state.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-task',
  standalone: true,
  imports: [FormsModule, DatePipe, PageTitleComponent, TaskListComponent],
  templateUrl: './all-task.component.html',
  styleUrl: './all-task.component.scss',
})
export class AllTaskComponent {
  newTask = '';
  intialTaskList: any[] = [];
  taskList: any[] = [];
  httpService = inject(HttpService);
  stateService = inject(StateService);

  ngOnInit() {
    this.stateService.searchSubject.subscribe((value) => {
      console.log("search", value);
      if (value) {
        this.taskList = this.intialTaskList.filter((x) =>
          x.title.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.taskList = this.intialTaskList;
      }
    });
    this.getAllTasks();
  }

  addTask() {
    console.log('addTask', this.newTask);
    this.httpService.addTask(this.newTask).subscribe(() => {
      this.newTask = '';
      this.getAllTasks();
      Swal.fire(
        'Task Added!',
        'Your new task has been added successfully.',
        'success'
      );
    });
  }

  getAllTasks() {
    this.httpService.getAllTasks().subscribe((result: any) => {
      this.intialTaskList = result;
      this.taskList = this.intialTaskList.slice().sort((a, b) => a.title.localeCompare(b.title));
    });
  }

onComplete(task: any) {
  const previousCompletedState = task.completed;
  task.completed = true;
  console.log('complete', task);

  this.httpService.updateTask(task).subscribe(() => {
    this.getAllTasks();
    Swal.fire({
      title: 'Task Completed!',
      text: 'Congratulations! You have completed a task.',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Undo',
    }).then((result) => {
      if (result.isConfirmed) {
        task.completed = previousCompletedState;
        this.httpService.updateTask(task).subscribe(() => {
          this.getAllTasks();
        });
        Swal.fire(
          'Undo Completed!',
          'Your task completion has been undone.',
          'success'
        );
      } else {
        Swal.fire(
          'Task Completed!',
          'Congratulations! You have completed a task.',
          'success'
        );
      }
    });
  });
}

  onDelete(task: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        task.delete = true;
        console.log('delete', task);
        this.httpService.deleteTask(task.id).subscribe(() => {
          this.getAllTasks();
        });
        Swal.fire(
          'Deleted!',
          'Your task has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your task is safe :)',
          'error'
        );
      }
    });
  }
  editTask(task: any) {
    const newTaskTitle = prompt('Edit Task', task.title);

    if (newTaskTitle !== null) {
      task.title = newTaskTitle;
      this.httpService.updateTask(task).subscribe(() => {
        this.getAllTasks();
        Swal.fire(
          'Task Updated!',
          'Your task has been updated successfully.',
          'success'
        );
      });
    } else {
      Swal.fire(
        'Cancelled',
        'Your task update has been cancelled.',
        'info'
      );
    }
  }
}
