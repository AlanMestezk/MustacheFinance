<p align="center">
  <img src="./src/assets/logo/logo.png" alt="Mustache Finance" width="400">
</p>

<h1 align="center">Mustache Finance</h1>

<p align="center">
  A modern personal finance management application built with React, TypeScript and Firebase.
</p>

<p align="center">
  <a href="https://mustache-finance.vercel.app">Live Demo</a>
  ·
  <a href="#features">Features</a>
  ·
  <a href="#technologies">Technologies</a>
  ·
  <a href="#getting-started">Getting Started</a>
</p>

---

## 📖 About

**Mustache Finance** is a personal finance management web application designed to make financial organization simple, visual and intuitive.

The application allows users to keep track of their income and expenses, create personal financial plans, monitor progress toward goals and generate financial reports.

The project was created as a personal development project focused on building a complete modern web application while exploring frontend architecture, authentication, cloud data management and deployment.

---

## ✨ Features

### 💰 Income Management

- Create income records
- View income history
- Edit existing income records
- Delete income records
- Categorize income
- Automatic total calculation

### 💸 Expense Management

- Create expense records
- View expense history
- Edit existing expenses
- Delete expenses
- Categorize expenses
- Automatic total calculation

### 🎯 Financial Planning

Create personal financial goals such as:

- Buying a motorcycle
- Planning a trip
- Purchasing a computer
- Saving for education
- Other personal goals

Each plan includes:

- Current amount
- Target amount
- Progress percentage
- Remaining amount
- Category
- Creation date
- Visual progress bar

### 📊 Dashboard

The dashboard provides a quick overview of the user's financial situation, including:

- Total income
- Total expenses
- Financial balance
- Active financial plans
- Goal progress
- Top financial plans

### 📄 Reports

Users can generate financial reports based on a selected period and export the results as PDF.

### 🔐 Authentication

User authentication and profile management are handled through Firebase Authentication.

Each user's financial data is isolated and stored under their own account.

---

## 🛠️ Technologies

### Frontend

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **SCSS**
- **CSS Modules**
- **React Icons**

### Backend & Cloud

- **Firebase Authentication**
- **Firebase Firestore**

### Deployment

- **Vercel**

---

## 🏗️ Project Structure

```text
src/
├── assets/
├── components/
├── firebase/
├── pages/
├── routes/
├── styles/
├── App.tsx
└── main.tsx
