# Calorie Cart — Calorie-Aware Grocery Shopping App

## Overview

Calorie Cart is a React web application that combines online grocery shopping with calorie tracking. Users browse a store of food items, add them to a cart, and see a running calorie count alongside their order — helping them stay accountable to their dietary goals at checkout.

## Tech Stack

- **Frontend**: React 18, Vite
- **UI**: React Bootstrap
- **State**: React hooks (cart quantity, session)
- **Auth**: Login / Register pages with session management

## Features

- **Home** — hero carousel showcasing the app's value, deals section with discounted items
- **Store** — browse full food catalog with calorie info per item
- **Cart & Checkout** — running calorie total alongside item prices
- **Account** — user profile page
- **Auth** — login and registration flows

## Project Structure

```
src/
├── components/
│   ├── structural/
│   │   ├── CalorieCartApp.jsx      ← root app shell
│   │   └── calorieCartAppLayout.jsx
│   └── websitePages/
│       ├── homePage.jsx
│       ├── storePage.jsx
│       ├── checkoutPage.jsx
│       ├── AccountPage.jsx
│       ├── loginPage.jsx
│       └── registerPage.jsx
├── API/
│   └── items.json                  ← food item catalog
└── assets/                         ← icons (calories, protein, etc.)
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
```
