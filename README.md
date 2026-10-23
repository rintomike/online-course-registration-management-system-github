[Project README.md](https://github.com/user-attachments/files/33889227/Project.README.md)
# 🎓 COURSIFY — Online Course Registration & Management System

**COURSIFY** is a full-stack web application designed to streamline academic course browsing, student enrollment, profile management, and administrative catalog control. Built with a **Java Spring Boot** REST API backend, **MySQL** relational database, and a responsive **Vanilla HTML5, CSS3, and JavaScript** frontend, the system features distinct, role-tailored workspaces for both **Students** (Blue theme) and **Administrators** (Orange theme).

---

## ✨ Key Features

### 👨‍🎓 Student Portal (Blue Theme)
- **Authentication & Account Recovery:**
  - Student Sign-Up with validation (`sign-up.html`).
  - Secure Student Login (`login.html`).
  - Self-service Forgot Password workflow verifying username and registered mobile number (`forgot-password.html`).
- **Interactive Student Dashboard (`dashboard.html`):**
  - **Show All Courses:** Browse the complete course catalog with delivery mode and duration details.
  - **Enroll for Courses:** One-click course registration with instant duplicate-enrollment prevention (`Enrolled ✓`).
  - **Your Courses:** View all personal registered courses in one place and **Cancel Enrollment (Unenroll)** anytime.
  - **Live Course Search:** Instant filtering by course name or delivery type (`Online`, `Offline`, `Hybrid`).
- **Student Profile Management (`profile.html` & `edit-profile.html`):**
  - View personal academic profile details and update contact/profile information dynamically.

### 🛡️ Admin Workspace (Orange Theme)
- **Role-Protected Admin Authentication (`admin-login.html`):**
  - Dedicated administrator login backed by environment-secured credentials (`env.properties`) and session route guards.
- **Course Catalog Management (`admin-dashboard.html`):**
  - **Add New Courses:** Create courses with custom titles, duration (in days), and delivery modes (`Online`, `Offline`, `Hybrid`).
  - **Live Catalog Metrics:** Real-time counter displaying total active courses in the database.
  - **Remove Courses:** Transactional course deletion (`@Transactional`) with instant catalog refresh.
- **Student Enrollment & Approval Tracking:**
  - View which students are enrolled in which courses and **Approve** or **Reject** student course registrations directly from the dashboard.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Custom Properties, Flexbox, CSS Grid), Vanilla JavaScript (ES6+, Fetch API), Font Awesome & Lucide Icons |
| **Backend** | Java 17/21, Spring Boot 3.x, Spring Web (RESTful APIs), Spring Data JPA (Hibernate), Jakarta Validation |
| **Database** | MySQL 8.x |
| **Build & Config** | Apache Maven (`pom.xml`), Environment Configuration (`env.properties`), CORS Configuration |

---

## 📂 Project Directory Structure

```text
online-course-registration-management-system/
├── .gitignore                          # Ignores target/, *.class, env.properties, and IDE files
├── README.md                           # Project documentation
├── frontend/                           # Frontend static web application
│   ├── home-page/                      # Main Landing Page (index.html, index-styles.css, index-script.js)
│   ├── login/                          # Student Login & Forgot Password pages
│   ├── sign-up/                        # Student Account Registration page
│   ├── coursify_frontend/              # Student Dashboard, Profile, and Edit Profile pages
│   └── admin/                          # Orange-themed Admin Login & Admin Dashboard pages
└── springboot-project/                 # Spring Boot REST API Backend
    ├── pom.xml                         # Maven dependencies & build configuration
    └── src/main/
        ├── java/com/coursereg/
        │   ├── CourseRegistrationApplication.java
        │   ├── config/
        │   │   └── CorsConfig.java     # Cross-Origin Resource Sharing configuration
        │   ├── controller/
        │   │   ├── AuthController.java   # Student signup, login, profile & password reset endpoints
        │   │   ├── CourseController.java # Course listing, student enrollment & unenrollment endpoints
        │   │   └── AdminController.java  # Admin login, course creation/deletion & enrollment approvals
        │   ├── dto/                    # Request validation Data Transfer Objects (*Request.java)
        │   ├── model/                  # JPA Entities (Student.java, Course.java, StudentCourse.java)
        │   └── repository/             # Spring Data JPA Repositories (Student, Course, StudentCourse)
        └── resources/
            ├── application.properties      # Main Spring Boot & JPA configuration
            └── env.example.properties      # Template for local environment variables
```

---

## 🔌 REST API Endpoints Overview

### 1. Authentication & Student Profile (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new student account |
| `POST` | `/api/auth/login` | Authenticate an existing student |
| `PUT` | `/api/auth/forgot-password` | Reset student password using username & mobile number |
| `GET` | `/api/auth/profile/{username}` | Fetch student profile details |
| `PUT` | `/api/auth/profile/{username}` | Update student profile information |

### 2. Courses & Student Enrollment (`/api/courses`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/courses` | Fetch all available courses in the catalog |
| `POST` | `/api/courses/register` | Enroll a student in a specific course |
| `GET` | `/api/courses/student/{studentName}` | Get all courses a specific student is enrolled in |
| `DELETE` | `/api/courses/unenroll` | Cancel a student's enrollment (`?studentName=...&courseId=...`) |

### 3. Administration (`/api/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Authenticate administrator credentials |
| `POST` | `/api/admin/courses` | Add a new course to the catalog |
| `DELETE` | `/api/admin/courses/{courseName}` | Remove a course from the catalog |
| `GET` | `/api/admin/enrollments` | List all student course enrollments and their status |
| `PUT` | `/api/admin/enrollments/{id}/status` | Approve or reject a student enrollment (`?status=APPROVED`) |

---

## 🚀 Getting Started (Local Setup Guide)

### Prerequisites
- **Java JDK 17** or **JDK 21**
- **Apache Maven** (or IDE bundled Maven)
- **MySQL Server** running locally on port `3306`
- **VS Code** (with *Live Server* extension) or **IntelliJ IDEA**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/online-course-registration-management-system.git
cd online-course-registration-management-system
```

### Step 2: Configure the MySQL Database
Open your MySQL client (MySQL Workbench or CLI) and create the database:
```sql
CREATE DATABASE IF NOT EXISTS coursereg;
```
*(Spring Data JPA / Hibernate will automatically generate and update the tables `allinfo`, `allcourse`, and `student_course` when the backend starts).*

### Step 3: Set Up `env.properties`
Navigate to `springboot-project/src/main/resources/`. Copy `env.example.properties` and rename the copy to **`env.properties`** (this file is ignored by Git for security):

```properties
ADMIN_NAME=your_admin_name
ADMIN_PASSWORD=your_secure_admin_password
DB_USERNAME=your_mysql_database_username
DB_PASSWORD=your_mysql_root_password
```
Make sure `application.properties` imports this file via:
```properties
spring.config.import=optional:classpath:env.properties
```

### Step 4: Run the Spring Boot Backend
Open a terminal inside the `springboot-project` directory and start the server:
```bash
cd springboot-project
mvn spring-boot:run
```
The backend REST API will start on **`http://localhost:8080`**.

### Step 5: Launch the Frontend
1. Open the project folder in **VS Code**.
2. Right-click `frontend/home-page/index.html` and select **"Open with Live Server"**.
3. The application will open at `http://localhost:5500/frontend/home-page/index.html` (or `http://127.0.0.1:5500`).

---

## 📄 License
This project was developed for academic and educational purposes.
