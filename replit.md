# Online Exam Platform - replit.md

## Overview

This is a comprehensive online exam platform built with React and TypeScript on the frontend, Express.js on the backend, and PostgreSQL for data storage. The platform supports multiple user roles (students, teachers, admins) and provides a complete exam management system with real-time features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **Forms**: React Hook Form with Zod for validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth integration
- **Session Management**: Express sessions with PostgreSQL store

## Key Components

### Authentication System
- Multi-role authentication (student, teacher, admin)
- Supabase integration for user management
- Custom AuthProvider with React Context
- Role-based access control and route protection

### Database Schema
- **Users/Profiles**: User information with role-based access
- **Exams**: Exam metadata, timing, and configuration
- **Questions**: Question bank with multiple choice support
- **Exam Attempts**: Student exam registrations and attempts
- **Answer Choices**: Multiple choice options with correct answers

### User Dashboards
- **Student Dashboard**: Exam participation, results viewing, profile management
- **Teacher Dashboard**: Exam creation, student management, results analysis
- **Admin Dashboard**: User approval, system oversight

### Exam System
- Real-time exam taking with timer functionality
- Question navigation and answer saving
- Automatic submission on time expiration
- Results calculation and display

## Data Flow

1. **User Registration**: Users sign up with role selection (student/teacher)
2. **Authentication**: Supabase handles authentication with custom profile creation
3. **Exam Creation**: Teachers create exams and add questions from question bank
4. **Exam Participation**: Students join exams via codes or registration
5. **Real-time Monitoring**: Live exam progress tracking and proctoring
6. **Results Processing**: Automatic scoring and result generation

## External Dependencies

### Primary Dependencies
- **Supabase**: Authentication, real-time features, and supplementary data storage
- **Neon Database**: Primary PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database operations
- **TanStack Query**: Server state management and caching

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 module
- **Development Server**: Vite dev server with HMR
- **Port Configuration**: Port 5000 for development

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Deployment**: Replit autoscale deployment target
- **Environment**: Production environment variables

### Database Management
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Shared schema definitions between client and server
- **Connection**: Neon serverless PostgreSQL with connection pooling

## Recent Changes
- June 19, 2025: إصلاح مشاكل قاعدة البيانات وربط الواجهات
  - أضافة API routes للامتحانات والأسئلة
  - إصلاح مشكلة زر التسجيل (تحسين اللون والخلفية)
  - ربط صفحات الطلاب بقاعدة البيانات الحقيقية
  - إضافة صفحة "الانضمام للامتحان" بنظام الرموز
  - إصلاح مشكلة النقر المتكرر على الأزرار
  - إزالة جميع البيانات الوهمية واستخدام قاعدة البيانات فقط
  - إصلاح مشكلة تسجيل الخروج للعودة للصفحة الرئيسية
  - تحسين معالجة الحالات الفارغة في الواجهات

## Changelog
```
- June 19, 2025: Initial setup and database integration
- June 19, 2025: Fixed UI issues and database connectivity
```

## User Preferences
```
Preferred communication style: Simple, everyday language in Arabic.
Data handling: No mock/dummy data - only real database data.
Logout behavior: Always return to main landing page after logout.
```