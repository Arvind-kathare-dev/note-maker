import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import Folder from '@/models/Folder';
import Document from '@/models/Document';

const TEACHER_LAYOUT = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '🏫 Classroom Layout & Setup Guidelines' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Welcome teachers! This document outlines the mandatory layout and environmental setup for all Little Seeds classrooms.' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🍀 Nature-Inspired Setup' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Natural Lighting' }, { type: 'text', text: ' — Keep blinds open during the day. Use warm-toned lamps instead of harsh overhead fluorescent bulbs where possible.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Sensory Corners' }, { type: 'text', text: ' — Maintain a designated quiet sensory zone with soft cushions, picture books, and tactile nature blocks.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Eco Station' }, { type: 'text', text: ' — Ensure the recycling and organic compost bins are labeled and at child-eye level to encourage eco-consciousness.' }] }] }
    ]},
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '📝 Daily Attendance Protocols' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'All classroom teachers must take daily attendance using the tablets by 9:15 AM sharp. Any unexplained absences should be logged for the admin desk to follow up.' }] }
  ]
});

const ADMIN_PORTAL = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '🔑 Admin Portal Setup & Security' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Welcome admin! This manual contains highly sensitive information regarding access controls and portal settings.' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🛡️ Role-Based Access Control' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Administrators can assign four distinct access groups to users: Admin, Teacher, Student, and Guest. Ensure that developer integrations are strictly isolated.' }] }
  ]
});

const DEV_API = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '🔌 Little Seeds Core API Specifications' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Developer documentation for integrating third-party systems and custom portals with the Little Seeds backend database.' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🔐 Authentication' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'All API requests must include a Bearer token in the Authorization header:' }] },
    { type: 'codeBlock', attrs: { language: 'typescript' }, content: [{ type: 'text', text: 'Authorization: Bearer <your_jwt_token_here>' }] }
  ]
});

const STUDENT_GUIDE = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '🎒 Student Assignment Submission Guide' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Hey students! Here is the easy, step-by-step way to turn in your weekly worksheets and outdoor activities.' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '📸 Capturing Your Outdoor Discoveries' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'When you find a new leaf or seed during your nature walks, take a picture using your tablet, upload it to the assignment board, and write a one-sentence description!' }] }
  ]
});

const EDITOR_SHOWCASE = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '🎨 Advanced Editor Features Showcase' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Welcome to the Little Seeds advanced document designer! This page serves as a live demonstration of all high-fidelity editing modules integrated into the platform.' }] },
    { type: 'horizontalRule' },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '✨ Typography & Colors' }] },
    { type: 'paragraph', content: [
      { type: 'text', text: 'Apply custom ' },
      { type: 'text', marks: [{ type: 'bold' }], text: 'Bold' },
      { type: 'text', text: ', ' },
      { type: 'text', marks: [{ type: 'italic' }], text: 'Italic' },
      { type: 'text', text: ', ' },
      { type: 'text', marks: [{ type: 'underline' }], text: 'Underlined' },
      { type: 'text', text: ', or ' },
      { type: 'text', marks: [{ type: 'strike' }], text: 'Strikethrough' },
      { type: 'text', text: ' text decorations. You can also mix in ' },
      { type: 'text', marks: [{ type: 'textStyle', attrs: { color: '#fb923c' } }, { type: 'bold' }], text: 'custom colors' },
      { type: 'text', text: ' or ' },
      { type: 'text', marks: [{ type: 'highlight', attrs: { color: '#fef08a' } }], text: 'vibrant highlights' },
      { type: 'text', text: ' for standard operating procedures!' }
    ]}
  ]
});

const COACH_WORKOUT = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '💪 Coaches Workout Builder Guide' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Guide for certified trainers and coaches on how to create, test, and distribute workout regimens for athletes.' }] }
  ]
});

const PULSEFIT_DEV = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '⚡ WebSocket Real-time Sync Specification' }] }
  ]
});

const APEX_MERCHANT = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '📦 Product Catalog & SKUs' }] }
  ]
});

const APEX_DEV = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '🔌 Headless GraphQL API Schema' }] }
  ]
});

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Seed Projects
    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      await Project.create([
        {
          id: 'p1',
          name: 'Little Seeds',
          description: 'School portal management system for teachers, admin, students, and parents.',
          icon: '🌱',
          color: '#10b981',
          version: 'v1.4.2',
        },
        {
          id: 'p2',
          name: 'PulseFit App',
          description: 'Cross-platform health, workout, and real-time coach logging tracker.',
          icon: '⚡',
          color: '#ea580c',
          version: 'v0.9.8-beta',
        },
        {
          id: 'p3',
          name: 'ApexCommerce',
          description: 'High-performance headless e-commerce backend engine and merchant dashboard.',
          icon: '🛒',
          color: '#0284c7',
          version: 'v2.1.0',
        }
      ]);
    }

    // 2. Seed Folders
    const foldersCount = await Folder.countDocuments();
    if (foldersCount === 0) {
      await Folder.create([
        { id: 'f_teacher_p1', name: 'Teacher Manuals', parentId: null, projectId: 'p1', icon: '👩‍🏫', color: '#16a34a' },
        { id: 'f_admin_p1', name: 'Admin Guidelines', parentId: null, projectId: 'p1', icon: '🔑', color: '#9333ea' },
        { id: 'f_student_p1', name: 'Student Guides', parentId: null, projectId: 'p1', icon: '🎒', color: '#ea580c' },
        { id: 'f_dev_p1', name: 'Developer Specs', parentId: null, projectId: 'p1', icon: '⚙️', color: '#0284c7' },
        { id: 'f_coach_p2', name: 'Coaches Handbook', parentId: null, projectId: 'p2', icon: '💪', color: '#16a34a' },
        { id: 'f_admin_p2', name: 'Platform Settings', parentId: null, projectId: 'p2', icon: '🔑', color: '#9333ea' },
        { id: 'f_athlete_p2', name: 'Athlete Guides', parentId: null, projectId: 'p2', icon: '🏃', color: '#ea580c' },
        { id: 'f_dev_p2', name: 'SDK Integration specs', parentId: null, projectId: 'p2', icon: '⚙️', color: '#0284c7' },
        { id: 'f_merchant_p3', name: 'Merchant Dashboard', parentId: null, projectId: 'p3', icon: '🏬', color: '#16a34a' },
        { id: 'f_admin_p3', name: 'Warehouse SOPs', parentId: null, projectId: 'p3', icon: '🔑', color: '#9333ea' },
        { id: 'f_customer_p3', name: 'Cart Checkout Flows', parentId: null, projectId: 'p3', icon: '🛒', color: '#ea580c' },
        { id: 'f_dev_p3', name: 'GraphQL Endpoint specs', parentId: null, projectId: 'p3', icon: '⚙️', color: '#0284c7' }
      ]);
    }

    // 3. Seed Documents
    const docsCount = await Document.countDocuments();
    if (docsCount === 0) {
      await Document.create([
        { id: 'd_teacher_1', folderId: 'f_teacher_p1', parentId: null, projectId: 'p1', title: 'Classroom Layout & Setup Guidelines', content: TEACHER_LAYOUT, category: 'teacher', emoji: '🏫', tags: ['setup', 'classroom'], status: 'published', isPinned: true, isFavorite: false, wordCount: 145, authorName: 'Principal Seeds', authorAvatar: 'https://i.pravatar.cc/150?u=1', version: 1 },
        { id: 'd_teacher_2', folderId: 'f_teacher_p1', parentId: null, projectId: 'p1', title: 'Advanced Editor Features Showcase', content: EDITOR_SHOWCASE, category: 'teacher', emoji: '🎨', tags: ['showcase', 'editor'], status: 'published', isPinned: true, isFavorite: true, wordCount: 380, authorName: 'Little Seeds Support', authorAvatar: 'https://i.pravatar.cc/150?u=1', version: 1 },
        { id: 'd_admin_1', folderId: 'f_admin_p1', parentId: null, projectId: 'p1', title: 'Admin Portal Setup Guide', content: ADMIN_PORTAL, category: 'admin', emoji: '🔑', tags: ['admin', 'portal'], status: 'published', isPinned: true, isFavorite: true, wordCount: 88, authorName: 'Support Team', authorAvatar: 'https://i.pravatar.cc/150?u=2', version: 1 },
        { id: 'd_dev_1', folderId: 'f_dev_p1', parentId: null, projectId: 'p1', title: 'Core API Specifications', content: DEV_API, category: 'developer', emoji: '🔌', tags: ['api', 'developer'], status: 'published', isPinned: false, isFavorite: false, wordCount: 52, authorName: 'Lead Dev', authorAvatar: 'https://i.pravatar.cc/150?u=3', version: 2 },
        { id: 'd_student_1', folderId: 'f_student_p1', parentId: null, projectId: 'p1', title: 'Assignment Submission Guide', content: STUDENT_GUIDE, category: 'student', emoji: '🎒', tags: ['homework', 'student'], status: 'published', isPinned: false, isFavorite: true, wordCount: 78, authorName: 'Teacher Maple', authorAvatar: 'https://i.pravatar.cc/150?u=4', version: 1 },
        { id: 'd_coach_p2_1', folderId: 'f_coach_p2', parentId: null, projectId: 'p2', title: 'Workout Builder SOP', content: COACH_WORKOUT, category: 'teacher', emoji: '💪', tags: ['coaching', 'workouts'], status: 'published', isPinned: true, isFavorite: false, wordCount: 95, authorName: 'Coach Iron', authorAvatar: 'https://i.pravatar.cc/150?u=5', version: 1 },
        { id: 'd_dev_p2_1', folderId: 'f_dev_p2', parentId: null, projectId: 'p2', title: 'Real-time WebSockets Sync', content: PULSEFIT_DEV, category: 'developer', emoji: '⚡', tags: ['ws', 'engineering'], status: 'published', isPinned: false, isFavorite: true, wordCount: 110, authorName: 'Biometrics Dev', authorAvatar: 'https://i.pravatar.cc/150?u=6', version: 3 },
        { id: 'd_merchant_p3_1', folderId: 'f_merchant_p3', parentId: null, projectId: 'p3', title: 'Product Inventory & SKUs', content: APEX_MERCHANT, category: 'teacher', emoji: '📦', tags: ['catalog', 'merchant'], status: 'published', isPinned: true, isFavorite: false, wordCount: 125, authorName: 'Operations Lead', authorAvatar: 'https://i.pravatar.cc/150?u=7', version: 1 },
        { id: 'd_dev_p3_1', folderId: 'f_dev_p3', parentId: null, projectId: 'p3', title: 'GraphQL Cart Mutations', content: APEX_DEV, category: 'developer', emoji: '🔌', tags: ['graphql', 'cart'], status: 'published', isPinned: false, isFavorite: true, wordCount: 88, authorName: 'Merchant Dev', authorAvatar: 'https://i.pravatar.cc/150?u=8', version: 1 }
      ]);
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully with all mock projects, folders, and manuals!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
