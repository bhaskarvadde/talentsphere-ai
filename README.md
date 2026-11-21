# talentsphere-ai
# AI-Powered Smart Recruitment & Talent Management System

VCUBE HACK QUEST 1.0 | Problem 1: HR Tech / Recruitment AI

An intelligent recruitment platform that automates resume screening, job matching,
interview preparation and resume improvement using Generative AI.

## Live Links
- Frontend: <your-frontend-url>
- Backend API: <your-render-backend-url>
- GitHub: <repo-url>
- Postman collection: `/postman/VCUBE-AI-Recruitment.postman_collection.json`

## Features
**Recruiter:** register/login, post and close jobs, view applicants ranked by AI match
score, shortlist/reject/hire, generate interview questions per applicant, analytics dashboard.

**Candidate:** register/login, profile, resume upload (PDF/TXT), AI resume analysis,
AI job match, apply to jobs, interview prep, resume improvement assistant, application tracking.

## AI Features (all called from the Spring Boot backend)
| Feature | Endpoint | Real data used |
|---|---|---|
| Resume Analyzer | `POST /api/candidate/resume`, `POST /api/ai/analyze-resume` | Resume text extracted from the uploaded PDF |
| Job Matching AI | `GET /api/ai/match/{jobId}` (also runs on apply) | Candidate resume and job record from the DB |
| Interview Question Generator | `GET /api/ai/interview-questions/{jobId}` | Job record and candidate resume |
| Resume Improvement Assistant | `POST /api/ai/improve-resume?jobId=` | Candidate resume and the target job |

Every AI output is persisted in the `resume_analysis` table.
The LLM is reached through any OpenAI-compatible API (configured by env vars).

## Tech Stack
Java 17, Spring Boot 3, Spring Data JPA, Spring Security (JWT, role-based), REST APIs,
MySQL, Apache PDFBox, LLM API (OpenAI-compatible), React.js, Postman, Git/GitHub, Render.

## Architecture
React -> REST (JWT) -> Spring Boot (controller -> service -> repository) -> MySQL
                                        |
                                        +-> LLM API (resume + job data from DB in prompts)

## Database (5 tables)
users, candidates, jobs, applications, resume_analysis (see ER diagram in `/docs/er-diagram.png`).

## API Overview
| Method | Endpoint | Role |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| POST/GET | /api/jobs, /api/jobs/mine, /api/jobs/{id} | Recruiter / Any |
| PUT | /api/jobs/{id}/status | Recruiter |
| POST | /api/jobs/{id}/apply | Candidate |
| GET | /api/jobs/{id}/applications | Recruiter |
| GET/PUT | /api/candidate/me | Candidate |
| POST | /api/candidate/resume | Candidate |
| GET | /api/applications/mine | Candidate |
| PUT | /api/applications/{id}/status | Recruiter |
| GET | /api/analytics/recruiter, /api/analytics/candidate | Recruiter / Candidate |

## Run Locally
```bash
# Backend
export DB_URL="jdbc:mysql://localhost:3306/recruitdb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export DB_USER=root DB_PASS=root
export JWT_SECRET="a-long-random-secret-of-at-least-32-characters"
export AI_API_KEY=<your-key>
export AI_BASE_URL=https://api.groq.com/openai/v1
export AI_MODEL=<model-name>
mvn spring-boot:run

# Frontend
cd frontend && npm install && npm run dev   # set VITE_API_URL=http://localhost:8080
```

## Deployment
Backend: Render Web Service (Docker) + cloud MySQL. Frontend: Render Static Site / Vercel.
Environment variables: DB_URL, DB_USER, DB_PASS, JWT_SECRET, AI_API_KEY, AI_BASE_URL, AI_MODEL.

## Team
<Team name>: <member 1>, <member 2>, <member 3>, <member 4>, <member 5>

## Future Scope
Email notifications, interview scheduling, bias-detection in screening, ATS integrations,
semantic search with embeddings.
