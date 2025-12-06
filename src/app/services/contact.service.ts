// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ContactMessage } from '../models/object-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.localBaseUrl}/contactMessages`;

  constructor(private http: HttpClient) {}

  // Submit a new contact message
  submitMessage(messageData: Omit<ContactMessage, 'id' | 'submittedAt' | 'status'>): Observable<ContactMessage> {
    const message: ContactMessage = {
      ...messageData,
      submittedAt: new Date().toISOString(),
      status: 'unread'
    };

    return this.http.post<ContactMessage>(this.apiUrl, message).pipe(
      catchError(this.handleError)
    );
  }

  // Get all messages sorted by date (newest first)
  getAllMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl).pipe(
      map(messages => messages.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )),
      catchError(this.handleError)
    );
  }

  // Get a specific message by ID
  getMessageById(id: string): Observable<ContactMessage> {
    return this.http.get<ContactMessage>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update message status
  updateMessageStatus(id: string, status: 'read' | 'replied'): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.apiUrl}/${id}`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a message
  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get count of unread messages
  getUnreadCount(): Observable<number> {
    return this.http.get<ContactMessage[]>(this.apiUrl).pipe(
      map(messages => messages.filter(msg => msg.status === 'unread').length),
      catchError(this.handleError)
    );
  }

  // Get messages by status
  getMessagesByStatus(status: ContactMessage['status']): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl).pipe(
      map(messages => messages
        .filter(msg => msg.status === status)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      ),
      catchError(this.handleError)
    );
  }

  // Search messages
  searchMessages(keyword: string): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl).pipe(
      map(messages => {
        const searchTerm = keyword.toLowerCase();
        return messages.filter(msg =>
          msg.firstName.toLowerCase().includes(searchTerm) ||
          msg.lastName?.toLowerCase().includes(searchTerm) ||
          msg.email.toLowerCase().includes(searchTerm) ||
          msg.message.toLowerCase().includes(searchTerm)
        ).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      }),
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}