import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";
import * as Survey from "survey-angular";
import * as widgets from "surveyjs-widgets";
import * as SurveyCore from "survey-core";
import * as SurveyPDF from "survey-pdf";
import "inputmask/dist/inputmask/phone-codes/phone.js";

import { init as initCustomWidget } from "./customwidget";

import * as showdown from 'showdown';

import showdownHighlight from 'showdown-highlight';
import * as ownwidgets from './ownwidgets.js';
import { HttpClient } from '@angular/common/http';


widgets.icheck(Survey);
widgets.select2(Survey);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey);
widgets.jqueryuidatepicker(Survey);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey);
//widgets.signaturepad(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);
widgets.autocomplete(Survey);
widgets.bootstrapslider(Survey);
widgets.prettycheckbox(Survey);
//widgets.emotionsratings(Survey);
initCustomWidget(Survey);

widgets.icheck(SurveyCore);
widgets.select2(SurveyCore);
widgets.inputmask(SurveyCore);
widgets.jquerybarrating(SurveyCore);
widgets.jqueryuidatepicker(SurveyCore);
widgets.nouislider(SurveyCore);
widgets.select2tagbox(SurveyCore);
//widgets.signaturepad(SurveyCore);
widgets.sortablejs(SurveyCore);
widgets.ckeditor(SurveyCore);
widgets.autocomplete(SurveyCore);
widgets.bootstrapslider(SurveyCore);
widgets.prettycheckbox(SurveyCore);

ownwidgets.photocapture(Survey);
ownwidgets.uml(Survey);


Survey.JsonObject.metaData.addProperty('questionbase', 'popupdescription:text');
Survey.JsonObject.metaData.addProperty('page', 'popupdescription:text');

Survey.StylesManager.applyTheme("default");

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'survey',
  template: `<div class='survey-container contentcontainer codecontainer'><div id='surveyElement'></div></div>`
})
export class SurveyComponent implements OnInit {
  @Output() submitSurvey = new EventEmitter<any>();
  @Input()
  json: object;
  result: any;

  constructor(private http: HttpClient) {


  }


  ngOnInit() {
    const converter = new showdown.Converter({
      extensions: [showdownHighlight]
    }
    );
    //    console.log(showdownHighlight);

    this.http.get('/exam.json').subscribe(data => {
      this.json = data;


      const surveyModel = new Survey.Model(this.json);
      surveyModel
        .onTextMarkdown
        .add((survey, options) => {
          //convert the mardown text to html
          // console.log(options.text);

          var str = converter.makeHtml(options.text) as string;
          //remove root paragraphs <p></p>
          if (!str.startsWith('<p>')) {
          } else {
            str = str.substring(3);
            str = str.substring(0, str.length - 4);
          }
          //set html
          options.html = str;
        });

      surveyModel.onAfterRenderQuestion.add((survey, options) => {
        if (!options.question.popupdescription) { return; }
        // Add a button;
        const btn = document.createElement('button');
        btn.className = 'btn btn-info btn-xs';
        btn.innerHTML = 'More Info';
        btn.onclick = function () {
          // showDescription(question);
          alert(options.question.popupdescription);
        };
        const header = options.htmlElement.querySelector('h5');
        const span = document.createElement('span');
        span.innerHTML = '  ';
        header.appendChild(span);
        header.appendChild(btn);
      });
      surveyModel.onComplete
        .add((result, options) => {
          this.submitSurvey.emit(result.data);
          this.result = result.data;
        }
        );
      Survey.SurveyNG.render('surveyElement', { model: surveyModel });
    });

  }
  /*savePDF() {
    var options = {
      fontSize: 14,
      margins: {
        left: 10,
        right: 10,
        top: 10,
        bot: 10
      }
    };
    const surveyPDF = new SurveyPDF.SurveyPDF(this.json, options);
    console.log(this.result);
    surveyPDF.data = this.result;
    surveyPDF.save("survey PDF example");
  }*/
}
