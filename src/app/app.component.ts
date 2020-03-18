import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  items = Array.from({ length: 10000 }).map((_, i) => ({
    id: i,
    label: `Item #${i}`,
    data: 'lorem ipsum lorem'
  }));
  selectedVal: Event;

  message: string;

  change($event: any) {
    debugger
    this.selectedVal = $event
  }


  selected(e) {

    console.log(e)
  }
}