import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {

  messageSub!: Subscription;
  messages: Message[];
  errorMsg: string;

  constructor(private message: MessageService,
    private router: Router) {
      this.messages = [];
      this.errorMsg = '';
    }

  ngOnInit(): void {
    this.messageSub = this.message.messageSubject.subscribe(
      (messages: any[string]) => {
        this.messages = messages;
      },
      (error: string) => {
        this.errorMsg = JSON.stringify(error);
      }
    );
    this.message.getMessages();
  }

  onClickMessage(id: string) {
    this.router.navigate(['messages', id]);
  }

}
