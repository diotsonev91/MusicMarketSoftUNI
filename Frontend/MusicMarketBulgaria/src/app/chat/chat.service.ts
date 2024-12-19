import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ChatMessage } from './chat.model';
import { Conversation } from './conversation.model'; // Assuming this exists

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:5000'; // Update with your backend base URL

  constructor(private http: HttpClient) {}

  /**
   * Send a new message
   * @param receiverID The ID of the message recipient
   * @param content The content of the message
   * @returns Observable of the created ChatMessage
   */
  sendMessage(receiverID: string, content: string): Observable<ChatMessage> {
    const messageData = { receiverID, content };
    return this.http.post<ChatMessage>(`${this.apiUrl}/chats/send`, messageData).pipe(
      tap({
        next: (response: any) => console.log('Message sent successfully:', response),
        error: (err: any) => console.error('Error sending message:', err),
      })
    );
  }


  /**
   * Get all conversations for the logged-in user
   * @returns Observable of an array of Conversations
   */
  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`).pipe(
      tap({
        next: (conversations) => console.log('Fetched conversations:', conversations),
        error: (err: any) => console.error('Error fetching conversations:', err),
      })
    );
  }

  markAsRead(id: string): Observable<any> {
   // console.log('Requesting URL:', `${this.apiUrl}/conversations/${id}/markAsRead`);

    return this.http.patch(`${this.apiUrl}/conversations/${id}/markAsRead`, {});
  }
  /**
   * Delete a conversation by its ID
   * @param conversationId The ID of the conversation to delete
   * @returns Observable of the deletion result
   */
  deleteConversation(conversationId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/conversations/${conversationId}`).pipe(
      tap({
        next: (response: any) => console.log('Conversation deleted successfully:', response),
        error: (err: any) => console.error('Error deleting conversation:', err),
      })
    );
  }
}
