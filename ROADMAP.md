## Roadmap (49/124)

### Design (20/20)

- [x] Responsive Layout
  - [x] Mobile optimization
  - [x] Tablet-friendly design
  - [x] Desktop layout
- [x] Accessibility Compliance
  - [x] Keyboard navigation
  - [x] Screen reader compatibility
  - [x] ARIA attributes
- [x] Navigation System
  - [x] Mobile/Tablet: Collapsible topbar
  - [x] Desktop: Persistent sidebar
- [x] User Preferences
  - [x] Color Mode Toggle
    - [x] Light mode
    - [x] Dark mode
  - [x] Theme Selection
    - [x] Default theme
    - [x] Ayu theme
    - [x] Rose theme
    - [x] Grass theme

### Authentication & Authorization (14/14)

- [x] User Registration and Login
  - [x] Email/Password (Credentials Provider)
  - [x] Google OAuth
  - [x] Input validation
  - [x] Error handling
- [x] Account Linking
  - [x] Link Google OAuth to Credentials
  - [x] Link Credentials to OAuth
- [x] Logout functionality
- [x] Domain Restriction (UST-Legazpi only)
- [x] Enhanced Security
  - [x] Forgot password
  - [x] Email verification
  - [x] Two-factor authentication (2FA)

### User Management (5/9)

- [ ] Profile
  - [x] Change name
  - [ ] Add pronouns
  - [ ] Change picture
  - [x] Add bio
  - [ ] Add date of birth
- [x] Account
  - [x] Toggle 2FA
  - [x] Change password

### Learnings (11/44)

- [ ] Courses
  - [x] Management
    - [x] Create, edit, archive, delete
  - [x] Browsing
    - [x] Search (title, instructor, keywords)
    - [x] Filter (department, level, date)
    - [x] Sort options
  - [ ] Interactions
    - [ ] Course Forum
    - [x] Course Video Calls
  - [ ] Lessons
    - [x] Lesson content
    - [x] Progress tracking
      - [x] Not started
      - [x] In progress
      - [x] Completed
    - [ ] Lesson Forums
    - [x] AI-assisted chat for lesson topics
  - [ ] Assessments
    - [x] Activities
    - [x] Exams
    - [x] Quizzes
    - [ ] Features:
      - [x] Multi-part structure
      - [x] Question types:
        - [x] Multiple choice
        - [x] Checkbox
        - [x] Fill in the blank
        - [x] Short answer
      - [ ] Assessment availability settings:
        - [ ] Set start and end date/time (including expiration)
        - [ ] Set time limit for completion
      - [x] AI-assisted question generation
- [ ] Instructor Tools
  - [x] Content Management
    - [x] Create, modify, and delete courses
    - [x] Create, modify, and delete lessons
    - [x] Attach external resources to lessons
  - [x] Assessment Creation
    - [x] AI-powered question bank
    - [x] Automated difficulty rating for questions
    - [x] Smart question selection based on learning objectives
  - [ ] Schedule and conduct video calls

### Analytics and Progress Tracking (0/11)

- [ ] Student Dashboard
  - [x] View course progress and completion rates
  - [ ] Track assessment scores and overall performance
  - [ ] Display personalized learning recommendations
- [ ] Instructor Dashboard
  - [ ] Monitor class-wide progress and engagement
  - [ ] Analyze assessment results and identify areas for improvement
  - [ ] Generate and export detailed reports
- [ ] Shared Features
  - [ ] Visualize learning milestones and achievements
  - [ ] Set and track personal/class learning goals

### Chats (0/26)

- [ ] Group Rooms
  - [ ] Creation
    - [ ] Set group name and description
    - [ ] Add initial members
  - [ ] Management
    - [x] Invite users to group
    - [ ] Remove users from group
    - [ ] Assign/change group admin roles
  - [ ] Deletion
    - [ ] Confirm deletion with all members
    - [ ] Archive chat history
- [ ] Communication
  - [ ] Peer-to-peer
    - [ ] Text messages
      - [x] Send/receive in real-time
      - [x] Edit and delete messages
    - [ ] Voice/Video calls
      - [x] Initiate and receive calls
      - [x] Screen sharing
  - [ ] Peer-to-group
    - [x] Text messages
      - [x] Send/receive in real-time
      - [ ] Mention specific users
    - [ ] Voice/Video calls
      - [x] Initiate and join group calls
      - [ ] Participant management (mute, remove)
