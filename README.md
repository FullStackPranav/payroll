# 🧾 Payroll Management System

A full-stack MERN web application that automates employee payroll, attendance tracking, and payslip generation. Built to streamline HR operations with secure authentication, role-based dashboards, leave management, and real-time data tracking.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Axios, CSS Modules
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer (local storage)
- **Other Tools**: dotenv, bcrypt, moment.js

---

## ✅ Features

### 👨‍💼 Admin
- Admin login with JWT authentication
- Dashboard showing user statistics
- Add/view all employees
- Set user hourly pay and activity status (active/inactive)
- Assign roles
- View and filter employee attendance
- Generate monthly payslips based on hours worked
- View detailed attendance per day for any user
- Add/edit working hours manually
- Manage leave requests (approve/reject)
- View leave reports and filter them by month or year

### 👷 Employee
- Register and log in
- Upload profile picture
- Punch in/out daily
- View monthly payslips (auto-generated)
- Apply for leave
- View leave status
- View personal attendance logs
- View assigned shifts and shift compliance

---

## 📸 Screenshots

> Screenshots are hosted using GitHub user attachment links.

![Homepage](https://github.com/user-attachments/assets/370c9404-6947-4b7d-bb4d-4c0ce0373588)
![Admin Dashboard](https://github.com/user-attachments/assets/7b013e7f-6c35-4a29-9f5f-2e4306d62de2)
![Employee Punch In](https://github.com/user-attachments/assets/ad13c03f-de1b-4ad6-86a0-970f589aff73)
![Payslip View](https://github.com/user-attachments/assets/8a14a919-f6da-457d-9d67-f6b01ffcf7ac)

---

## 📂 Folder Structure

```bash
payroll-management/
├── client/               # React frontend
├── server/               # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── uploads/          # Multer file uploads (profile pictures)
└── .env                  # Environment variables
```

---

## 🧰 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/FullStackPranav/payroll-management.git
cd payroll-management
```

### 2. Backend Setup

```bash
cd server
npm install
npm start
```

Create a `.env` file inside `/server` with the following:

```env
MONGO_URI=yourMongoDB_URI
JWT_SECRET=yourJWTsecret
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

### 4. Admin Role Setup

- Register a user via the frontend.
- Open MongoDB in Compass (or any DB tool).
- Manually update that user’s `role` to `"admin"` in the database.

---

## 📄 License

This project is open-source and free to use for educational and personal purposes.

---

## 🙋 Contact

**Pranav TP**  
📍 Kochi, Kerala  
📧 [pranavpradeeptp@gmail.com](mailto:pranavpradeeptp@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/pranavpradeept/)  
💻 [GitHub](https://github.com/FullStackPranav)
