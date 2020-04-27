import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SuerveyJSPrinter } from './quizzdsl/prettyprinter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

json: any;

constructor(private http: HttpClient){

  const p = new SuerveyJSPrinter('Examen SIR 2020',
  `Vous allez démarrer cet examen. <br/>
  Vous avez 60 minutes pour cette épreuve.<br/>
  Commencez par vérifier que vous êtes logué avec votre compte en haut de la page<br/>
  Prenez une photo de vous en train de composer, pas grave si cela ne marche pas<br/>
  Utilisez uniquement chrome ou firefox<br/>
  Veuillez cliquer sur  <b>'Démarrer l'examen'</b> quand vous êtes prêts.`,
  3600);
let s1 = p.print(`# (b) uml
----
# (mt) Test
- [ ] test1
- [ ] test2
----
---
# (c) Test
- [ ] Essai1
- [ ] Essai2
- [ ] Essai3
- [ ] Essai4
- [ ]
\`\`\`java
public void main()
\`\`\`

---

# (html)
<p> test </p>

----

# (c)
## Que pensez vous de ce travail
- [ ] Ok
- [ ] Bof

---


`);

  const s = JSON.parse(eval(s1));
// Random pages
  let init = s.pages.shift();
  this.shuffleArray(s.pages);
  s.pages = [init, ...s.pages];

  this.json = s;



}

 shuffleArray(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

casusername: any;

ngOnInit(): void {
  this.http.get('/casusername', {responseType: 'text'}).subscribe(data => {
    console.log(data);
    this.casusername = data.split('\n').shift();
  });

}



  sendData(result: any) {
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
