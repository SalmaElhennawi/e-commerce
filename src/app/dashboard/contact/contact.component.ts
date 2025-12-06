import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ContactMessage } from '../../models/object-model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  messages: ContactMessage[] = [];
  filteredMessages: ContactMessage[] = [];
  selectedMessage: ContactMessage | null = null;
  statusFilter: string = 'all';
  searchKeyword: string = '';
  
  stats = {
    total: 0,
    unread: 0,
    read: 0,
    replied: 0
  };
  
  loading = false;
  error: string | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.error = null;
    
    this.contactService.getAllMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.filteredMessages = [...messages];
        this.loading = false;
        this.updateStats();
      },
      error: (err) => {
        this.error = 'Failed to load messages. Please try again.';
        this.loading = false;
        console.error('Error loading messages:', err);
      }
    });
  }

  updateStats(): void {
    this.stats.total = this.messages.length;
    this.stats.unread = this.messages.filter(m => m.status === 'unread').length;
    this.stats.read = this.messages.filter(m => m.status === 'read').length;
    this.stats.replied = this.messages.filter(m => m.status === 'replied').length;
  }

  filterMessages(): void {
    let filtered = this.messages;
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.status === this.statusFilter);
    }
    
    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.firstName.toLowerCase().includes(keyword) ||
        (msg.lastName && msg.lastName.toLowerCase().includes(keyword)) ||
        msg.email.toLowerCase().includes(keyword) ||
        msg.message.toLowerCase().includes(keyword)
      );
    }
    
    this.filteredMessages = filtered;
  }

  onStatusFilterChange(): void {
    this.filterMessages();
  }

  onSearch(): void {
    this.filterMessages();
  }

  selectMessage(message: ContactMessage): void {
    this.selectedMessage = message;
    
    if (message.status === 'unread') {
      this.markAsRead(message.id as string);
    }
  }

  markAsRead(id: string): void {
    this.contactService.updateMessageStatus(id, 'read').subscribe({
      next: (updatedMessage) => {
        this.updateMessageInList(updatedMessage);
      },
      error: (err) => {
        console.error('Error marking as read:', err);
        alert('Failed to update message status');
      }
    });
  }

  markAsReplied(id: string): void {
    this.contactService.updateMessageStatus(id, 'replied').subscribe({
      next: (updatedMessage) => {
        this.updateMessageInList(updatedMessage);
      },
      error: (err) => {
        console.error('Error marking as replied:', err);
        alert('Failed to update message status');
      }
    });
  }

  deleteMessage(id: string): void {
    if (confirm('Are you sure you want to delete this message?')) {
      this.contactService.deleteMessage(id).subscribe({
        next: () => {
          this.messages = this.messages.filter(m => m.id !== id);
          this.filterMessages();
          this.updateStats();
          
          if (this.selectedMessage?.id === id) {
            this.selectedMessage = null;
          }
        },
        error: (err) => {
          console.error('Error deleting message:', err);
          alert('Failed to delete message');
        }
      });
    }
  }

  private updateMessageInList(updatedMessage: ContactMessage): void {
    const index = this.messages.findIndex(m => m.id === updatedMessage.id);
    if (index !== -1) {
      this.messages[index] = updatedMessage;
      this.updateStats();
      this.filterMessages();
      
      if (this.selectedMessage?.id === updatedMessage.id) {
        this.selectedMessage = updatedMessage;
      }
    }
  }

  getStatusBadgeClass(status: string | undefined): string {
    if (!status) return 'badge bg-secondary';
    
    switch (status) {
      case 'unread': return 'badge bg-danger';
      case 'read': return 'badge bg-warning text-dark';
      case 'replied': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }

  getStatusText(status: string | undefined): string {
    if (!status) return 'Unknown';
    
    switch (status) {
      case 'unread': return 'Unread';
      case 'read': return 'Read';
      case 'replied': return 'Replied';
      default: return 'Unknown';
    }
  }

  formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Helper method to safely get message ID as string
  getMessageId(message: ContactMessage): string {
    return message.id?.toString() || '';
  }

  // Method to copy phone number to clipboard
  copyPhoneNumber(phone: string | undefined): void {
    if (phone) {
      navigator.clipboard.writeText(phone).then(() => {
        alert(`Phone number copied to clipboard: ${phone}`);
      }).catch(err => {
        console.error('Failed to copy phone number:', err);
      });
    }
  }
}