# 💰 Finance System Backend

## 🚀 Overview
This is a backend system for a **Finance Dashboard Application** that supports role-based access control, financial record management, and dashboard analytics.

The system demonstrates backend architecture, API design, data modeling, and access control.

---

## 🧠 Features

### 👤 User & Role Management
- Create and manage users
- Role-based access control (RBAC)
- Roles:
  - **ADMIN** → Full access
  - **ANALYST** → Read + insights
  - **VIEWER** → Read-only dashboard
- User activation/deactivation support

---

### 💸 Financial Records Management
- Create, update, delete financial records
- Fields:
  - Amount
  - Type (**INCOME / EXPENSE**)
  - Category
  - Date
  - Notes
- Filtering support:
  - By date
  - By category
  - By type

---

### 📊 Dashboard APIs
- Total Income
- Total Expenses
- Net Balance
- Category-wise summary
- Monthly trends
- Recent activity

---

### 🔐 Access Control
- Implemented using **JWT + role-based middleware**
- Endpoint-level restrictions:
  - **VIEWER** → Dashboard only
  - **ANALYST** → Read + analytics
  - **ADMIN** → Full CRUD

---

### ⚠️ Validation & Error Handling
- Input validation implemented
- Proper HTTP status codes used
- Consistent error response structure

---

### 🚦 Rate Limiting & Security
- Rate limiting using `express-rate-limit`
- Security headers using `helmet`
- CORS enabled

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- express-rate-limit
- helmet

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/shobhit2306/finance-system.git
cd finance-system
npm install

configure .env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run the server with this command
npm run dev:nd

📡 API Testing
👉 A Postman collection is included for testing all APIs.

Steps:
## 📡 API Testing

Postman Collection:

🔗 https://raw.githubusercontent.com/shobhit2306/finance-system/359485b237caac6c07e08623d38a621a8b71a326/postman_collection/Finance_system_api_collection

You can import this directly into Postman.