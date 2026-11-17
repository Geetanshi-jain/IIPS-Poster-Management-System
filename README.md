# IIPS Student Poster Submission, Evaluation & Research Ranking System 
> Developed for the **International Institute of Professional Studies (IIPS), Devi Ahilya Vishwavidyalaya (DAVV), Indore**.

---

## 📌 1. Problem Statement

Currently, academic departments and event organizers use Excel sheets, paper forms, and emails to manage poster presentation events. This makes the process time-consuming and difficult. Sometimes, evaluation records get lost, marks are calculated incorrectly, and results are delayed.

---

## 💡 2. Proposed System (Solution)

The **IIPS Poster Management System** is a web application that makes the entire poster presentation process easy and digital. Admins can create events and set evaluation criteria. Students can register and upload their posters. Reviewers can evaluate posters and give marks through a common dashboard. The system automatically calculates average marks, handles tie-breakers, and generates the final leaderboard.

This system saves time, reduces manual work, avoids calculation errors, and makes the evaluation process more transparent and fair.

### 🔄 System Workflow:
```
[Admin Creates Event & Sets Criteria]
                 ↓
[Students Register & Upload Posters (PDF)]
                 ↓
[Admin Assigns Reviewers to Posters]
                 ↓
[Reviewers Grade Posters via Common Dashboard]
                 ↓
[System Automatically Calculates Average Marks & Ties]
                 ↓
[Final Official Leaderboard & Rankings Generated]
```

---

## 🔐 3. Login & Authentication Flow

The application uses **JSON Web Tokens (SimpleJWT)** for stateless, secure authentication. When a user logs in, the backend issues a 24-hour access token and a 7-day refresh token. The frontend automatically determines the user's role via `/api/auth/me/` and redirects to the designated dashboard.

### 🔑 Pre-Configured Demo Credentials

| Role | Username | Password | Designated Dashboard | URL |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Admin Control Panel | `http://localhost:5173/admin` |
| **Student 1** | `test1` | `1234` | Student Submission Portal | `http://localhost:5173/student` |
| **Student 2** | `test3` | `1234` | Student Submission Portal | `http://localhost:5173/student` |
| **Faculty Reviewer 1** | `test2` | `1234` | Reviewer Workspace | `http://localhost:5173/reviewer` |
| **Faculty Reviewer 2** | `test4` | `1234` | Reviewer Workspace | `http://localhost:5173/reviewer` |

---

## ⚙️ 4. Admin CRUD Operations

The **Administrator** holds full administrative and CRUD privileges across events, poster submissions, reviewer assignments, and leaderboards:



### 4.2 Backend View Implementation (`views.py`)
* **Event Creation & Listing (`event_list`):** Validates that `request.user.role == 'admin'` before allowing `POST` requests to create new competitions.
* **Event Detail & Deletion (`event_detail`):** Enforces admin authorization for `PUT` updates and `DELETE` actions.
* **Bulk Assignment (`bulk_assign_reviewers`):** Accepts arrays of `poster_ids` and `reviewer_ids`, preventing duplicate assignments.


---

## 🖥️ 5. UI Mockups & Wireframes
### 5.1 Admin Control Panel & Event Creator (`/admin`)
![Admin Control Panel Mockup]<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2f9ecde9-4c52-491b-981a-3c175cb5be62" />

<!-- Local image replace karne ke liye: ![Admin Dashboard](./screenshots/admin_dashboard.png) -->

<!-- Local image replace karne ke liye: ![Assignment Modal](./screenshots/assign_modal.png) -->

### 5.2 Student Submission Portal (`/student`)
![Student Submission Portal Mockup]<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2a90c1b8-03b1-4572-893d-c74a79f51633" />

<!-- Local image replace karne ke liye: ![Student Portal](./screenshots/student_portal.png) -->

### 5.3 Faculty Reviewer Workspace (`/reviewer`)
![Faculty Reviewer Workspace Mockup]<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/28aee8f0-025c-4337-a949-a23de4d19827" />

<!-- Local image replace karne ke liye: !




## 🚀 6. Quick Start & Setup Guide

### 6.1 Backend Setup (Django & DRF)
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. Start the backend development server
python manage.py runserver
```
Backend API will start at: `http://localhost:8000/`

---

### 6.2 Frontend Setup (React, Vite & Tailwind)
```bash
# 1. Open a new terminal and navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the Vite development server
npm run dev
```
Frontend web application will run at: `http://localhost:5173/`

---



## Contents
- 01 Problem Statement
- 02 Stakeholder Analysis
- 03 Software Requirements Specification
- 04 Use Case Model
- 05 Activity Diagrams
- 06 Class Diagram
- 07 Object Diagram
- 08 Sequence Diagrams
- 09 Communication Diagram
- 11 Package Diagram
- 12 Component Diagram
- 13 Deployment Diagram
- 14 Database Design



## Viewing Diagrams
Most diagrams are written using [Mermaid](https://mermaid.js.org/). You can view them directly on GitHub or using a Mermaid extension in VS Code.
