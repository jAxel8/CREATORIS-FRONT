import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, CheckboxChangeEventDetail, CheckboxCustomEvent, DatetimeChangeEventDetail, DatetimeCustomEvent, IonModal } from '@ionic/angular';
import { Stats, Task } from '../interfaces/Task';
import { TaskService } from '../services/task.service';
import * as moment from 'moment';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  taskForm!: FormGroup;
  loaded = false;
  skeletons: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  tasks: Task[] = [];
  stats!: Stats;
  public selectedId!: string;
  updateMode = false;
  public selectedDate!: Date;
  constructor(private taskService: TaskService, private fB: FormBuilder, private alertController: AlertController) { }
  ngOnInit(): void {
    this.setupForm();
    this.getTasks();
    this.getStats();
  }

  setupForm() {
    this.taskForm = this.fB.group({
      task: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      date: [new Date(), Validators.required]
    })
  }

  createTask(): void {




    this.taskService.create(this.taskForm.value).subscribe(
      res => {
        console.log(res);
        this.modal.dismiss();


        this.getTasks();
        this.getStats();
      }, err => {
        console.log(err);
        this.presentAlert('SE PRESENTO UN ERROR AL CREAR LA NUEVA TAREA');

      }, () => {
        this.taskControl?.reset()
      }
    )
  }



  getTasks(): void {
    this.loaded = false;
    this.taskService.get(this.dateControl?.value).subscribe(
      res => {

        this.tasks = res;
        this.loaded = true;




      }, err => {
        console.log(err);
      }
    )
  }

  getStats(): void {

    this.taskService.getTaskStats(this.dateControl?.value).subscribe(
      res => {

        console.log(res);

        this.stats = res;

      }, err => {
        console.log(err);
      }
    )
  }


  update(id: string): void {
    this.taskService.update(this.taskForm.value, id).subscribe(
      res => {
        this.updateMode = false;
        this.getTasks();
        this.presentAlert('TAREA ACTUALIZADA CORRECTAMENTE');
        this.modal.dismiss();
      }, err => {
        console.log(err);
        this.presentAlert('SE PRESENTO UN ERROR AL ACTUALIZAR ');

      }
    )
  }

  updateStatus(id: string, checked: boolean): void {
    this.taskService.updateDoneStatus(id, checked).subscribe(
      res => {

        this.getStats();

      }, err => {
        console.log(err);

      }
    )
  }



  delete(id: string): void {
    this.taskService.delete(id).subscribe(
      res => {
        this.presentAlert('TAREA ELIMINADA CORRECTAMENTE');
        this.getTasks();
        this.getStats();
      }, err => {
        console.log(err);
        this.presentAlert('SE PRESENTO UN ERROR, INTENTE DE NUEVO');

      }
    )
  }

  selectDate(e: Event) {
    const ev = e as CustomEvent<DatetimeChangeEventDetail>;


    // Intenta analizar la cadena de fecha con moment.js
    const parsedDate = moment(ev.detail.value, 'YYYY-MM-DD');
    this.dateControl?.setValue(parsedDate);
    this.getTasks();
    this.getStats();
  }

  confirm() {
    this.modal.dismiss();
  }

  handleCheckbox(e: Event, id: string) {
    const ev = e as CustomEvent<CheckboxChangeEventDetail>;
    const checked = ev.detail.checked;


    this.updateStatus(id, checked);



  }


  async openUpdateModal(task: Task) {
    this.updateMode = true;
    this.selectedId = task._id;
    this.taskControl?.setValue(task.task);
    await this.modal.present();

    await this.modal.onWillDismiss().then(() => {
      this.selectedId = '';
      this.taskControl?.reset();
    })


  }


  //ALERT

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'AVISO',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }


  //GETTERS
  get taskControl() {
    return this.taskForm.get('task');
  }

  get dateControl() {
    return this.taskForm.get('date');
  }
}
