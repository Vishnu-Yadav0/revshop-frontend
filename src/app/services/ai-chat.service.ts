import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private apiUrl = '/api/chat/generate';
  private streamUrl = '/api/chat/stream';

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<{response: string}> {
    return this.http.post<{response: string}>(this.apiUrl, { message });
  }

  streamMessage(message: string): Observable<string> {
    return new Observable<string>(observer => {
      fetch(this.streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      }).then(response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          observer.error('Failed to get reader');
          return;
        }

        const push = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              return;
            }
            const chunk = decoder.decode(value, { stream: true });
            // SSE format is usually "data: content\n\n"
            const lines = chunk.split('\n');
            lines.forEach(line => {
              if (line.startsWith('data:')) {
                // Remove only the "data:" prefix (and one optional protocol space).
                // DO NOT .trim() the whole content — Ollama sends tokens with leading
                // spaces as word separators (e.g. " for", " a"). Trimming removes them
                // and causes words to be concatenated without spaces.
                const raw = line.substring(5); // drops "data:"
                const content = raw.startsWith(' ') ? raw.substring(1) : raw; // drop one protocol space
                if (content) observer.next(content);
              } else if (line.trim() && !line.startsWith(':')) {
                // Raw text (not SSE format) — safe to use as-is
                observer.next(line);
              }
            });
            push();
          }).catch(err => observer.error(err));
        };

        push();
      }).catch(err => observer.error(err));
    });
  }
}
