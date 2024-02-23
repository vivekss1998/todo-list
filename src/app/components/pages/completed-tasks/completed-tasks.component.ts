import { Component, inject } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { PageTitleComponent } from '../../page-title/page-title.component';
import { TaskListComponent } from '../../task-list/task-list.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [PageTitleComponent,TaskListComponent],
  templateUrl: './completed-tasks.component.html',
  styleUrl: './completed-tasks.component.scss'
})
export class CompletedTasksComponent {
  newTask="";
  taskList:any[]=[];
  httpService=inject(HttpService);

  ngOnInit(){
    this.getAllTasks();
  }
  getAllTasks(){
    this.httpService.getAllTasks().subscribe((result:any)=>{
      this.taskList=result.filter((x:any)=>x.completed==true);
    })
  }
  onComplete(task:any){
    task.completed=true;
    console.log("complete",task)
    this.httpService.updateTask(task).subscribe(()=>{
      this.getAllTasks();
    })
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

