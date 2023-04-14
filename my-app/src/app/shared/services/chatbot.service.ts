import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of, take } from 'rxjs';
export class Message {
  constructor(public author: string, public content: string) { }
}
@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  conversation = new Subject<Message[]>();
  messageMap: any = {
    "hello": "Hello",
    "who are you?": "My name is Angular Bot",
    "what is angular": "Angular is the best framework ever",
    "order pizza": "Delivery or Takeaway?",
    "delivery": "Pizza Type?",
    "5 pepper": "Pizza Size?",
    "regular": "Should i Place order now?",
    "yes": "Order placed successfully.Thank you!",
    "default": "I can't understand. Can you please repeat"
  }
  private endpoint = 'https://your-chatbot-api-endpoint.com';
  inputText!: string;
  messages: any;
  chatbotService: any;
  constructor(private http: HttpClient) { }
  sendMessage(message: string): Observable<string> {
    const response = `You said: "${message}" - I'm a chatbot!`;
    return of(response);
  }
  getBotAnswer(msg: string): Observable<{ text: string, speech: string }> {
    const cleanedMsg = msg.replace(/\./g, '').toLowerCase();
    const userMessage = new Message('user', cleanedMsg);
    this.conversation.next([userMessage]);
    const botMessageText = this.getBotMessage(cleanedMsg);
    const botMessageSpeech = this.speak(botMessageText);
    const botMessage = { text: botMessageText, speech: botMessageSpeech };
    setTimeout(() => {
      this.conversation.next([new Message('bot', botMessageText)]);
    }, 1500);
    return of(botMessage);
  }
  speak(message: string) {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
    return message;
  }
  getBotMessage(question: string) {
    let answer = this.messageMap[question];
    return answer || this.messageMap['default'];
  }
}


