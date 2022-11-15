import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Repos {
  id: string = '';
  name: string = '';
  html_url: string = '';
  description: string = '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  data = [];
  prvDataArr = [];
  counter: number = 0;

  constructor(private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  title = 'HTTP Client-Server Example';

  ngOnInit(): void {
    this.setPrimaryData();
    this.getData();
  }

  public getData() {
    const events = new EventSource('http://localhost:3001/my-endpoint');

    events.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      this.counter += parsedData.length;

      /* stop listening when reaching 500 */
      if (this.counter > 500) events.close();

      this.data = parsedData;
      this.cd.detectChanges();

    }
  }

  setPrimaryData() {
    for (let itr = 0; itr < 45; itr++) {
      this.data.push({
        'id': itr,
        'type': 0
      });
    }
  }
}