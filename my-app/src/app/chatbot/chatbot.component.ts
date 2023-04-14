import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatbotService, Message } from '../shared/services/chatbot.service';
import { VoiceRecognitionService } from '../shared/services/voice-recognition.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  conversation: string[] = [];
  inputText: string = '';
  message: string = '';
  subscription!: Subscription;
  isOpen = true;
  @Input() chatboxIsOpen: boolean = true;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  chatbotResponse: string = '';
  messages: Message[] = [];
  chatFlag: boolean | undefined;
  value: string | undefined;
  constructor(private chatbotService: ChatbotService, public service: VoiceRecognitionService) {
    this.service.init()
      .subscribe(transcript => {
        this.setValue(transcript);
      });
  }
  ngOnInit(): void {
    this.chatbotService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });
    this.subscription = this.service.init().subscribe(transcript => {
      console.log('Transcript:', transcript);
      this.inputText = transcript;
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  startService() {
    this.service.start();
    setTimeout(() => {
      this.service.stop();
    }, 5000);
  }
  closeChat() {
    this.close.emit();
  }
  sendMessage() {
    this.chatbotService.getBotAnswer(this.inputText).subscribe(response => {
      this.chatbotResponse = response.text;
      this.speak(response.speech);
    });
    this.inputText = '';
  }
  openChatBot() {
    this.chatFlag = !this.chatFlag;
  }
  setValue(transcript: string) {
    console.log("setValue:", transcript);
    this.value = transcript;
    this.inputText = transcript;
  }
  speak(message: string) {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  }
}
