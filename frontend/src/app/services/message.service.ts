import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Message } from '../models/Message.model';


@Injectable({
    providedIn: 'root'
})
export class MessageService {
    messageSubject = new Subject<Message[]>();

    constructor(private http: HttpClient,
        private auth: AuthService) { }


    createMessage(message: any) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('message', JSON.stringify(message));
            this.http.post('http://localhost:5000/api/messages', formData).subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    getMessages() {
        this.http.get('http://localhost:5000/api/messages').subscribe(
            (messages: any[string]) => {
                this.messageSubject.next(messages);
            },
            (error) => {
                this.messageSubject.next([]);
                console.error(error);
            }
        );
    }

    modifyMessage(id: string, sauce: any) {
        return new Promise((resolve, reject) => {
            this.http.put('http://localhost:5000/api/messages/' + id, sauce).subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    deleteMessage(id: string) {
        return new Promise((resolve, reject) => {
            this.http.delete('http://localhost:5000/api/messages/' + id).subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    likeMessage(id: string, like: boolean) {
        return new Promise((resolve, reject) => {
            this.http.post(
                'http://localhost:5000/api/messages/' + id + '/like',
                {
                    userId: this.auth.getUserId(),
                    like: like ? 1 : 0
                })
                .subscribe(
                    () => {
                        resolve(like);
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    }

    dislikeMessage(id: string, dislike: boolean) {
        return new Promise((resolve, reject) => {
          this.http.post(
            'http://localhost:5000/api/messages/' + id + '/like',
            {
              userId: this.auth.getUserId(),
              like: dislike ? -1 : 0
            })
            .subscribe(
              () => {
                resolve(dislike);
              },
              (error) => {
                reject(error);
              }
            );
        });
      }

}