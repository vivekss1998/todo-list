import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  @Input() taskList: any[] = [];
  @Output() complete = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>(); 

  markComplete(task: any) {
    this.complete.emit(task);
  }

  deleteTask(task: any) {
    this.delete.emit(task);
  }

  editTask(task: any) {
    this.edit.emit(task);
  }
}
