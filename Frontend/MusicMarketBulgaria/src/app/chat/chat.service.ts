import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ChatMessage } from './chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/chats'; // Update with your backend base URL

  constructor(private http: HttpClient) {}

  /**
   * Send a new message
   * @param receiverID The ID of the message recipient
   * @param content The content of the message
   * @returns Observable of the created ChatMessage
   */
  sendMessage(receiverID: string, content: string): Observable<ChatMessage> {
    const messageData = { receiverID, content };
    return this.http.post<ChatMessage>(`${this.apiUrl}/send`, messageData).pipe(
      tap({
        next: (response: any) => console.log('Message sent successfully:', response),
        error: (err: any) => console.error('Error sending message:', err),
      })
    );
  }
  

  /**
   * Get all messages related to the logged-in user
   * @returns Observable of an array of ChatMessages
   */

  getMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(this.apiUrl).pipe(
      tap({
        next: (messages) => console.log('Fetched messages:', messages),
        error: (err) => console.error('Error fetching messages:', err)
      })
    );
  }
}