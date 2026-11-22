# TalentSphere AI: AI-Powered Smart Recruitment & Talent Management System

VCUBE HACK QUEST 1.0 | Problem 1: HR Tech / Recruitment AI

An intelligent recruitment platform that automates resume screening, job matching, interview preparation and resume improvement using Generative AI.

## Live Links
- **Live Application:** https://talentsphere-ai-sigma.vercel.app
- **Backend API:** https://talentsphere-ai-lnv2.onrender.com
- **API Docs (Swagger):** https://talentsphere-ai-lnv2.onrender.com/swagger-ui.html
- **GitHub:** https://github.com/bhaskarvadde/talentsphere-ai
- **Postman Collection:** [/postman/VCUBE-AI-Recruitment.postman_collection.json](postman/VCUBE-AI-Recruitment.postman_collection.json)
- **ER Diagram:** [/docs/er-diagram.png](docs/er-diagram.png)
- **Presentation:** [/docs/TalentSphere_AI_Presentation.pptx](docs/TalentSphere_AI_Presentation.pptx)

## Demo Accounts
- Recruiter: recruiter.demo@talentsphere.com / Demo@1234
- Candidate: candidate.demo@talentsphere.com / Demo@1234

> Note: the backend runs on a free tier and sleeps when idle. The first request (login or register) can take up to a minute. Please wait and try again if it seems stuck.

## Features
**Recruiter**
- Register and log in securely
- Post and close jobs
- View applicants ranked by AI match score
- Shortlist, reject or hire candidates
- Generate interview questions tailored to an applicant
- Analytics dashboard

**Candidate**
- Register, log in and manage a profile
- Upload a resume (PDF) and get an AI analysis
- Search and apply to jobs
- AI job match, interview preparation and resume improvement
- Track application status

## AI Features (all called from the Spring Boot backend)
| Feature | Endpoint | Real data used |
|---|---|---|
| Resume Analyzer | `POST /api/candidate/resume`, `POST /api/ai/analyze-resume` | Resume text extracted from the uploaded PDF |
| Job Matching AI | `GET /api/ai/match/{jobId}` (also runs on apply) | Candidate resume and job record from the database |
| Interview Question Generator | `GET /api/ai/interview-questions/{jobId}` | Job record and candidate resume |
| Resume Improvement Assistant | `POST /api/ai/improve-resume?jobId=` | Candidate resume and the target job |

Every AI output is stored in the `resume_analysis` table. The LLM is reached through an OpenAI-compatible API (Groq), configured with environment variables.

## Tech Stack
- **Backend:** Java 17, Spring Boot 3.3, Spring Data JPA, Spring Security (JWT), REST APIs, Apache PDFBox, Swagger (springdoc)
- **Database:** MySQL-compatible (TiDB Cloud)
- **AI:** LLM API (OpenAI-compatible) called from Spring Boot
- **Frontend:** React.js (Vite), Axios, React Router, Recharts
- **Tools and deployment:** Git, GitHub, Postman, Docker, Render (backend), Vercel (frontend)

## Architecture
```
React (Vercel) -> REST + JWT -> Spring Boot (Render) -> MySQL (TiDB Cloud)
                                      |
                                      +-> LLM API (prompts built from resume + job data)
```

## Database (5 tables)
| Table | Purpose |
|---|---|
| users | Recruiters and candidates (role, company) |
| candidates | Candidate profile and resume text (linked to users) |
| jobs | Jobs posted by recruiters |
| applications | Job + candidate, status, AI match score and summary |
| resume_analysis | All AI results (type, score, content) |

See the ER diagram in `docs/er-diagram.png`.

## Security
- JWT authentication (24-hour tokens)
- BCrypt password hashing
- Role-based access: Recruiter and Candidate
- Recruiters can only see and manage their own jobs
- Input validation on requests

## API Overview
| Method | Endpoint | Role |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| POST / GET | /api/jobs, /api/jobs/mine, /api/jobs/{id} | Recruiter / any user |
| PUT | /api/jobs/{id}/status | Recruiter |
| POST | /api/jobs/{id}/apply | Candidate |
| GET | /api/jobs/{id}/applications | Recruiter |
| GET / PUT | /api/candidate/me | Candidate |
| POST | /api/candidate/resume | Candidate |
| GET | /api/applications/mine | Candidate |
| PUT | /api/applications/{id}/status | Recruiter |
| POST / GET | /api/ai/analyze-resume, /api/ai/match/{jobId}, /api/ai/interview-questions/{jobId}, /api/ai/improve-resume | Candidate (interview questions also Recruiter) |
| GET | /api/analytics/recruiter, /api/analytics/candidate | Recruiter / Candidate |

Full interactive documentation is in Swagger (link above).

## Run Locally
**Backend**
```bash
cd backend
# set these environment variables (or edit application.properties for local use only)
# DB_URL, DB_USER, DB_PASS, JWT_SECRET, AI_API_KEY, AI_BASE_URL, AI_MODEL
mvn spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
# create .env with: VITE_API_URL=http://localhost:8080
npm run dev
```

## Deployment
- **Database:** TiDB Cloud Starter (free)
- **Backend:** Render Web Service (Docker, root directory `backend`)
- **Frontend:** Vercel (root directory `frontend`)

Environment variables:
- Render: `DB_URL`, `DB_USER`, `DB_PASS`, `JWT_SECRET`, `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`
- Vercel: `VITE_API_URL`

## Team
**Maven Minds**: <member 1>, <member 2>, <member 3>, <member 4>, <member 5>

## Future Scope
Email notifications, interview scheduling, bias checks in screening, removing personal details before AI processing, OCR for scanned resumes, asynchronous AI processing, automated tests.
