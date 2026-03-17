import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../../services/ai-chat.service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  messages: Message[] = [
    { text: 'Hello! I am your RevShop AI assistant. How can I help you today?', sender: 'bot', timestamp: new Date() }
  ];
  userInput: string = '';
  isOpen: boolean = false;
  isLoading: boolean = false;

  /** Flag: only scroll when we explicitly push a new message */
  private shouldScrollToBottom = false;

  constructor(private aiChatService: AiChatService, private cdr: ChangeDetectorRef) {}

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.shouldScrollToBottom = true;
    }
  }

  sendMessage() {
    if (this.userInput.trim() && !this.isLoading) {
      const userMessage = this.userInput;
      this.messages.push({ text: userMessage, sender: 'user', timestamp: new Date() });
      this.userInput = '';
      this.isLoading = true;
      this.shouldScrollToBottom = true;

      this.aiChatService.streamMessage(userMessage).subscribe({
        next: (chunk) => {
          if (this.isLoading) {
            // First chunk: create a new bot message
            this.messages.push({ text: chunk, sender: 'bot', timestamp: new Date() });
            this.isLoading = false;
          } else {
            // Subsequent chunks: append to the last bot message
            const lastMsg = this.messages[this.messages.length - 1];
            if (lastMsg && lastMsg.sender === 'bot') {
              lastMsg.text += chunk;
            }
          }
          // Only auto-scroll if user is already near the bottom
          this.scrollToBottomIfNear();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Chat error:', err);
          this.messages.push({
            text: 'Sorry, I encountered an error. Please make sure the AI service is running.',
            sender: 'bot',
            timestamp: new Date()
          });
          this.isLoading = false;
          this.shouldScrollToBottom = true;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  /** Scroll to bottom only when near the bottom (user hasn't scrolled up to read) */
  private scrollToBottomIfNear(): void {
    try {
      const el = this.myScrollContainer.nativeElement;
      const threshold = 120; // px from bottom
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      if (isNearBottom) {
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {}
  }

  private scrollToBottom(): void {
    try {
      const el = this.myScrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {}
  }
}

