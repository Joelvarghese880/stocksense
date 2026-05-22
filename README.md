# 📦 StockSense — E-commerce Warehouse Management System

A full-stack warehouse management system built with FastAPI, React, and PostgreSQL.

---

# 🌐 Live Demo

🚀 Frontend: https://stocksense-teal.vercel.app

📘 API Docs: https://stocksense-n8mp.onrender.com/docs

🔗 Backend API: https://stocksense-n8mp.onrender.com

---

## 🔑 Demo Credentials

Try the live demo instantly with these test accounts:

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@stocksense.com | demo1234 |
| Staff | staff@stocksense.com | demo1234 |

**Admin** can create products, manage users, transfer stock, and access all features.  
**Staff** can view inventory, perform stock-in/out operations, and view alerts.

## Features

- 🔐 JWT Authentication with Role-Based Access (Admin / Staff)
- 📦 Product & Category Management
- 🏭 Multi-Warehouse Stock Tracking
- 📥📤 Stock In / Stock Out / Transfer operations
- 📋 Full Audit Log of every stock movement
- 🚨 Automatic Low Stock Alerts
- 🤖 AI Demand Forecasting (Linear Regression)
- 📊 Analytics Dashboard with charts

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | FastAPI, SQLAlchemy, Alembic, PostgreSQL |
| Auth | JWT (python-jose), bcrypt (passlib) |
| ML | NumPy (Linear Regression) |
| Frontend | React, React Router, Axios, Recharts |
| Deploy | Render (API) + Neon (DB) + Vercel (Frontend) |

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register user |
| POST | /auth/login | Login + get JWT |
| GET | /products | List all products |
| POST | /stock/in | Add stock |
| POST | /stock/out | Remove stock |
| POST | /stock/transfer | Transfer between warehouses |
| GET | /stock/alerts | Low stock alerts |
| GET | /forecast/{id} | AI demand forecast |