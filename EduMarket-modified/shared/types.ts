// Types for EduMarket Application

export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  phone?: string;
  createdAt: Date;
}

export interface Teacher extends User {
  role: 'teacher';
  specialization: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  availability: string[];
}

export interface Student extends User {
  role: 'student';
  enrolledCourses: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  category: string;
  price: number;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  studentId: string;
  teacherId: string;
  courseId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'credit_card' | 'debit_card' | 'pix';
  transactionId?: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  teacherId: string;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
