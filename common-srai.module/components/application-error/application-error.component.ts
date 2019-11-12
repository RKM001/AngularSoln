import { Component, OnInit, Input } from '@angular/core';
import { MessageType, ErrorMessages } from '../../utilities';

@Component({
  selector: 'srai-application-error',
  templateUrl: './application-error.component.html',
  styleUrls: ['./application-error.component.css']
})
export class ApplicationErrorComponent implements OnInit {

  @Input()
  public type: MessageType = MessageType.NoMessage;

  @Input()
  public customMessageKey = 'lblErrorMsg';

  public phraseKeys = ErrorMessages;

  constructor() { }

  public ngOnInit() { }

}
