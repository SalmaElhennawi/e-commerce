// Same as previous simple version
import { Component, OnInit } from '@angular/core';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'New Spring Collection Launch',
      excerpt: 'Discover our latest spring collection featuring lightweight fabrics and vibrant colors.',
      date: 'Jan 15, 2024',
      category: 'Collections',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      title: 'How to Style Denim',
      excerpt: 'Learn how to create different looks with our premium denim collection.',
      date: 'Jan 10, 2024',
      category: 'Style Tips',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'Sustainable Fashion',
      excerpt: 'Our commitment to using eco-friendly materials in all our products.',
      date: 'Jan 5, 2024',
      category: 'Sustainability',
      imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      title: 'Casual Weekend Looks',
      excerpt: 'Perfect outfit ideas for your weekend adventures.',
      date: 'Dec 28, 2023',
      category: 'Outfit Ideas',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 5,
      title: 'Mens Wardrobe Essentials',
      excerpt: 'Building a timeless wardrobe with our curated mens collection.',
      date: 'Dec 20, 2023',
      category: 'Mens Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 6,
      title: 'Clothing Care Guide',
      excerpt: 'How to properly care for your clothes to make them last longer.',
      date: 'Dec 15, 2023',
      category: 'Care Tips',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  categories = ['All', 'Collections', 'Style Tips', 'Sustainability', 'Outfit Ideas', 'Mens Fashion', 'Care Tips'];
  selectedCategory = 'All';
  filteredPosts: BlogPost[] = [];

  ngOnInit(): void {
    this.filteredPosts = [...this.blogPosts];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredPosts = [...this.blogPosts];
    } else {
      this.filteredPosts = this.blogPosts.filter(post => post.category === category);
    }
  }
}