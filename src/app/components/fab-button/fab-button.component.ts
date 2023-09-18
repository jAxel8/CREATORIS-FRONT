import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.component.html',
  styleUrls: ['./fab-button.component.scss'], standalone: true, imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FabButtonComponent {
  @Output() click = new EventEmitter<any>();





  emit() {
    this.click.emit();
  }
}
