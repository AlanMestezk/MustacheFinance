<p align="center">
  <img src="./src/assets/logo/logo.png" alt="Mustache Finance" width="700">
</p>

<h1 align="center">Mustache Finance</h1>

<p align="center">
  <strong>Dream it. Plan it.<br>
  Make it happen.</strong>
</p>

<p align="center">
  A modern personal finance management application built with React, TypeScript and Firebase.
</p>

<p align="center">
  <a href="https://mustache-finance.vercel.app/">
    <img
      src="https://img.shields.io/badge/🌐%20LIVE%20DEMO-Visit%20Mustache%20Finance-F5A623?style=for-the-badge"
      alt="Live Demo"
    >
  </a>
</p>

<p align="center">
  <a href="#features">Features</a>
  ·
  <a href="#technologies">Technologies</a>
  ·
  <a href="#project-structure">Project Structure</a>
  ·
  <a href="#getting-started">Getting Started</a>
  ·
  <a href="#roadmap">Roadmap</a>
</p>



---

## 🥸 About

**Mustache Finance** is a personal finance management application designed to make financial organization simple, visual and intuitive.

The goal is straightforward:

> **Your money. Your plans. Your future.**

Mustache Finance helps users keep track of their income and expenses, organize their financial life and create personal plans with measurable goals.

Instead of turning financial management into a complicated experience, the application focuses on clarity, visual feedback and ease of use.

---

## 💡 The Idea

Managing money is not only about numbers.

It's about having a plan.

Mustache Finance was created around a simple philosophy:

> **Dream it. Plan it. Make it happen.**

Whether you're saving for a trip, a new computer, a motorcycle, education or any other personal goal, the application helps turn an idea into something measurable.

### Your money deserves a plan.

### Your plans deserve a purpose.

### And your goals deserve to happen.

---

# ✨ Features

## 💰 Income Management

Keep track of everything coming into your finances.

- Create income records
- View income history
- Edit existing income records
- Delete income records
- Categorize income
- Track total income
- Sort records by date

---

## 💸 Expense Management

Understand where your money is going.

- Create expense records
- View expense history
- Edit existing expenses
- Delete expenses
- Categorize expenses
- Track total expenses
- Sort records by date

---

## 🎯 Financial Planning

Turn financial goals into measurable plans.

Create plans for things such as:

- ✈️ Trips
- 🏍️ Vehicles
- 🏠 Home projects
- 💻 Technology
- 📚 Education
- 🎮 Leisure
- 💡 Personal goals

Each financial plan includes:

- Current amount
- Target amount
- Progress percentage
- Remaining amount
- Category
- Date
- Visual progress bar

### Example

```text
Trip to Europe

Current: R$ 2,500
Goal:    R$ 5,000

██████████░░░░░░░░░░ 50%

50% completed
R$ 2,500 remaining
```

> **Small progress is still progress.**

---

## 📊 Dashboard

The dashboard provides a clear overview of the user's financial situation.

It includes:

- Total income
- Total expenses
- Current balance
- Financial plans
- Goal progress
- Financial summaries
- Quick access to the main sections

The idea is to make important information available at a glance.

> **Know your numbers. Know your direction.**

---

## 📄 Financial Reports

Generate financial reports based on a selected period.

Reports provide a consolidated view of:

- Income
- Expenses
- Balance
- Expenses by category
- Financial planning progress

Reports can also be generated as PDF files for easier sharing and archiving.

---

## 🔐 Authentication

User authentication is handled through **Firebase Authentication**.

Each user has their own account and their financial information is stored independently.

The application also supports user profiles with:

- Name
- Profile picture
- Account information

---

## ☁️ Cloud Data

Financial data is stored using **Firebase Firestore**.

Each user's information is organized under their own user identifier, keeping the application's data structure organized and scalable.

---

# 🛠️ Technologies

## Frontend

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **SCSS**
- **CSS Modules**
- **React Icons**

## Backend & Cloud

- **Firebase Authentication**
- **Firebase Firestore**

## Additional Libraries

- **html2canvas**
- **jsPDF**

Used for PDF report generation.

## Deployment

- **Vercel**

---

# 🏗️ Project Structure

```text
src/
├── assets/
│
├── components/
│   ├── Dashboard/
│   ├── Header/
│   ├── HeaderHome/
│   ├── Navigation/
│   └── ...
│
├── firebase/
│   ├── auth.ts
│   ├── config.ts
│   └── firestore.ts
│
├── pages/
│   ├── Home/
│   ├── Dashboard/
│   ├── Expenses/
│   ├── Incomes/
│   ├── Investments/
│   ├── Reports/
│   └── ...
│
├── routes/
│
├── styles/
│   └── variables.scss
│
├── App.tsx
└── main.tsx
```

The project follows a component-based architecture, separating:

- Reusable UI components
- Pages
- Routing
- Firebase services
- Global styles
- Page-specific styles

---

# 🔥 Firestore Structure

User-specific financial data follows this structure:

```text
users/
└── {userId}/
    ├── expenses/
    │   └── {expenseId}
    │
    ├── incomes/
    │   └── {incomeId}
    │
    └── investments/
        └── {investmentId}
```

### Expenses

```text
description
amount
category
date
createdAt
```

### Incomes

```text
description
amount
category
date
createdAt
```

### Financial Plans

```text
description
amount
goalAmount
category
date
createdAt
```

> The `investments` collection is currently used internally for the application's financial planning and goal functionality.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

## Clone the repository

```bash
git clone https://github.com/AlanMestezk/MustacheFinance.git
```

## Navigate to the project

```bash
cd MustacheFinance
```

## Install dependencies

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# 🏭 Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The production build is generated inside the `dist` directory.

---

# 🌐 Deployment

Mustache Finance is deployed using **Vercel**.

The project is configured to build the Vite application and serve the generated production bundle.

Every update pushed to the main branch can trigger a new deployment.

---

# 📸 Screenshots

Screenshots can be added here to showcase the main parts of the application.

### Dashboard

```text
Coming soon
```

### Financial Plans

```text
Coming soon
```

### Reports

```text
Coming soon
```


---

# 🎨 Design Philosophy

Mustache Finance follows a simple design philosophy:

> **Personal finance should be easy to understand.**

The interface was designed around:

- Visual clarity
- Simple navigation
- Strong visual hierarchy
- Meaningful feedback
- Minimal complexity
- Consistent interactions

The visual identity combines a dark interface with warm accent colors and the mustache concept to create a distinctive personality.

---

# 🥸 Why "Mustache"?

Because managing money doesn't have to be boring.

The mustache became part of the application's identity as a playful visual element that makes the product feel more personal and memorable.

Behind the mustache, however, the idea is serious:

> **Take control of your money.  
> Make your plans happen.**

---

# 📌 Project Status

The core application is functional and deployed.

Current functionality includes:

- Authentication
- User profiles
- Income management
- Expense management
- Financial planning
- Dashboard
- Financial reports
- PDF generation
- Firebase data persistence
- Vercel deployment

The project remains under active development as new ideas and improvements are explored.

---

# 👨‍💻 Author

Developed by **Alan Mestezk**.

This project was created as a personal development project focused on building a complete modern web application using React, TypeScript, Firebase and Vercel.

---

# 📄 License

This project is currently intended for personal and educational purposes.

---

<p align="center">

  <strong>🥸 Mustache Finance</strong>

  <br>

  <em>Dream it. Plan it. Make it happen.</em>

</p>
