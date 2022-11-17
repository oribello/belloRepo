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
      this.counter += parsedData.length * 9;

      /* stop listening when reaching 500 */
      if (this.counter > 500) events.close();
      
      this.data = parsedData;

      // Run change detection for binding
      this.cd.detectChanges();

    }
  }

  setPrimaryData() {
    this.data = Array.from(Array(5), () => new Array(9));

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 9; y++) {
        this.data[x][y] = ({
          'id': { 'x': x, 'y': y },
          'type': -1
        });
      }
    }
    console.log(this.data[1][1]);
  }
}