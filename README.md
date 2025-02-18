Role-Based Access Control (RBAC) with Node.js & MySQL

This project implements a secure authentication system using **JWT**, **Two-Factor Authentication (2FA)**, and **Role-Based Access Control (RBAC)** in a Node.js application with MySQL.

## Features

- **Authentication** using JWT tokens.
- **Two-Factor Authentication (2FA)** with OTP verification.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full system access.
  - **Team Lead**: Manage agents and escalations.
  - **Agent**: Handle tickets and customer queries.
- **User Management**: Name, contact details, role, and activity logs.

## Tech Stack

- **Node.js (Express.js)** - Backend framework
- **MySQL** - Database
- **bcrypt.js** - Password hashing
- **jsonwebtoken (JWT)** - Secure authentication
- **dotenv** - Environment variable management

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your db password
DB_NAME=you db name
SECRET_KEY="nest India is FinTech company."
PORT=8050
TWILIO_ACCOUNT_SID=your twilio SED
TWILIO_AUTH_TOKEN=your twilio token
TWILIO_PHONE_NUMBER=your twilio number
```

To run server
npm run dev
Server is running on port 8050

endpoints ------->
Regitser new user
localhost:8050/auth/signup
body to send

{
"username": "Prateek2",
"password": "Nigam123456",
"roles": ["team_lead"],
"phone":"+918009461123"
}

In roles send three roles only admin or team_lead or agent

for login -------->
localhost:8050/auth/login
body to send
{
"username": "Prateek2",
"password": "Nigam123456"
}

output -----> {
"message": "OTP sent successfully!"
}

for login verify \_--------->
localhost:8050/auth/verify-otp
body ----->
{
"username": "Prateek2",
"otp":"308958"
}
output ---> token

use this token now for authentication send token in autherization bearer token

If user is admin
GET request

localhost:8050/roles/admin

If user is team_lead------->
get request
localhost:8050/roles/team-lead

If user is agent
get request
localhost:8050/roles/agent

to see the activity of the users hit this endpoint
GET request
localhost:8050/activity/activity-logs

tables ---------->
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
roles text,
phone VARCHAR(20) NOT NULL,
otp VARCHAR(6),
otpExpires BIGINT;
);

CREATE TABLE activity_logs (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
action VARCHAR(255) NOT NULL,
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
