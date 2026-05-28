# Educational CRM - Lead Management Module (Backend)

This is a dynamic Lead Management Module built with FastAPI and PostgreSQL. It supports role-based access control, dynamic form building, lead tracking, and follow-ups.

## Features

- **JWT Authentication**: Secure login and role-based access (Admin/Counselor).
- **Dynamic Form Builder**: Create forms with custom fields (text, email, dropdown, etc.).
- **Lead Management**: Track student leads, assign counselors, and store dynamic field values.
- **Follow-Up System**: Schedule and track follow-ups with activity logs.
- **Analytics Dashboard**: Real-time stats on lead conversion and counselor performance.

## Tech Stack

- **FastAPI**: Modern, high-performance web framework.
- **SQLAlchemy**: ORM for database interactions.
- **PostgreSQL**: Robust relational database.
- **Alembic**: Database migrations management.
- **Pydantic**: Data validation and serialization.
- **JOSE**: JWT token handling.

## Installation

### 1. Clone the repository
```bash
git clone <repo-url>
cd lead_module/backend
```

### 2. Set up virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (already provided in this setup):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lead_db
SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Database Setup
Ensure PostgreSQL is running and the database `lead_db` exists.

Run migrations:
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 5. Seed Initial Data
```bash
python -m app.database.seed
```

### 6. Run the Application
```bash
uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Default Credentials

- **Admin**: `admin@example.com` / `admin123`
- **Counselor**: `counselor@example.com` / `counselor123`

## Project Structure

```text
backend/
├── app/
│   ├── api/          # Route handlers & Dependencies
│   ├── core/         # Config & Security
│   ├── models/       # SQLAlchemy Models
│   ├── schemas/      # Pydantic Schemas
│   ├── services/     # Business Logic
│   ├── database/     # DB Session & Seeding
│   └── main.py       # FastAPI Entry Point
├── alembic/          # Database Migrations
└── .env              # Configuration
```
