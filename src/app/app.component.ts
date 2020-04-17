import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

constructor(private http: HttpClient){


}

casusername ;

ngOnInit(): void {
  this.http.get('/casusername', {responseType: 'text'}).subscribe(data => {
    console.log(data);
    this.casusername = data.split('\n').shift();
  });

}



  sendData(result) {
    console.log(result);
    const formData = new FormData();
    let dataStr = new Blob([JSON.stringify(result)], { type: 'application/json' });
    //var dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));

    formData.append('upload[]', dataStr, 'result.json');


    this.http.post('/upload', formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
}
