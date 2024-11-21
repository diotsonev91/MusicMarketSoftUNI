import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from './chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/chat'; // Update with your backend base URL

  constructor(private http: HttpClient) {}

  /**
   * Send a new message
   * @param receiverID The ID of the message recipient
   * @param content The content of the message
   * @returns Observable of the created ChatMessage
   */
  sendMessage(receiverID: string, content: string): Observable<ChatMessage> {
    const messageData = { receiverID, content };
    return this.http.post<ChatMessage>(`${this.apiUrl}/send`, messageData);
  }

  /**
   * Get all messages related to the logged-in user
   * @returns Observable of an array of ChatMessages
   */
  getMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(this.apiUrl);
  }
}