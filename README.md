# kbox - Backend API

kbox is a backend system built for a personal resource management web app. It helps users save useful online content like links, notes, and PDFs into categorized collections with tagging, favorites, public/private sharing, and daily flashcard reminders.

This README documents the backend functionality including REST APIs, Supabase integration, input validation, and scheduled cron jobs.

---

## Features

- Category-wise organization (e.g., DSA, Frontend, Backend)
- Save links, notes, and PDFs with optional descriptions
- Mark resources as public/private and favorite
- Filter/search by tags
- Daily flashcard feature to resurface favorite content
- Increment/decrement likes on public resources
- CRUD APIs for all entities

---

## Tech Stack

- Node.js + Express.js
- Supabase (Database, Auth, Functions)
- Zod (Input validation)
- Multer (PDF file uploads)
- node-cron (Scheduled tasks)
- REST API structure
- Postman (API testing)

---

## Zod Validation Schemas

Zod is used to validate all incoming request payloads before they hit your logic. This protects your API from malformed or insecure data.

Defined schemas:

- `UserSchema`: email, password, full name
- `CategorySchema`: category name + user ID
- `CardSchema`: link/title/content + visibility
- `PublicSchema`: requires 1–7 unique tags
- `TagSchema`: validates tag name

Found in: `src/zod/project.validation.js`

---

## Database Tables (Supabase)

- `users`
- `categories`
- `links`
- `notes`
- `pdfs`
- `public_links`
- `public_pdfs`
- `tags`
- `flashcards`

---

## API Endpoints Overview

### Auth
| Method | Endpoint              | Action           |
|--------|------------------------|------------------|
| POST   | `/api/users/`          | Create user      |
| PUT    | `/api/users/`          | Update user      |
| GET    | `/api/users/:id`       | Get user info    |
| POST   | `/api/users/signin`    | Sign in          |
| POST   | `/api/users/signout`   | Sign out         |

### Categories
| Method | Endpoint                  | Action              |
|--------|---------------------------|---------------------|
| POST   | `/api/categories/`        | Create category     |
| PUT    | `/api/categories/`        | Update category     |
| GET    | `/api/categories/:id`     | Get category by ID  |
| DELETE | `/api/categories/:id`     | Delete category     |

### Links
| Method | Endpoint             | Action            |
|--------|----------------------|-------------------|
| POST   | `/api/links/`        | Add link          |
| PUT    | `/api/links/`        | Update link       |
| GET    | `/api/links/:id`     | Get link          |
| DELETE | `/api/links/:id`     | Delete link       |

### Notes
| Method | Endpoint             | Action            |
|--------|----------------------|-------------------|
| POST   | `/api/notes/`        | Add note          |
| PUT    | `/api/notes/`        | Update note       |
| GET    | `/api/notes/:id`     | Get note          |
| DELETE | `/api/notes/:id`     | Delete note       |

### PDFs
| Method | Endpoint             | Action                 |
|--------|----------------------|------------------------|
| POST   | `/api/pdfs/`         | Upload PDF (Multer)    |
| PUT    | `/api/pdfs/`         | Update PDF             |
| GET    | `/api/pdfs/:id`      | Get PDF                |
| DELETE | `/api/pdfs/:id`      | Delete PDF             |

### Public Links / PDFs
| Method | Endpoint                                 | Action                      |
|--------|------------------------------------------|-----------------------------|
| POST   | `/api/public/link`                       | Make link public            |
| DELETE | `/api/public/link`                       | Remove public link          |
| GET    | `/api/public/link`                       | Get all public links        |
| POST   | `/api/public/link/:id/addlike`           | Increment likes (link)      |
| DELETE | `/api/public/link/:id/removelike`        | Decrement likes (link)      |
| POST   | `/api/public/pdf`                        | Make PDF public             |
| DELETE | `/api/public/pdf`                        | Remove public PDF           |
| GET    | `/api/public/pdf`                        | Get all public PDFs         |
| POST   | `/api/public/pdf/:id/like`               | Increment likes (PDF)       |
| DELETE | `/api/public/pdf/:id/like`               | Decrement likes (PDF)       |

### Tags
| Method | Endpoint           | Action          |
|--------|--------------------|-----------------|
| POST   | `/api/tags/`       | Create tag      |
| GET    | `/api/tags/`       | Get tags        |

---

## Flashcard System

A cron job (`favoriteFlashcardCron.js`) runs every night at 12:00 AM and:

- Selects 3 random favorite resources per user
- Stores them in a `flashcards` table
- Helps users recall and use saved content

---

## Folder Structure

```bash
├── src/
│   ├── controller/
│   │   ├── category.controller.js
│   │   ├── favoriteFlashcardCron.js
│   │   ├── link.controller.js
│   │   ├── notes.controller.js
│   │   ├── pdf.controller.js
│   │   ├── publiclinks.controller.js
│   │   ├── publicPdfs.controller.js
│   │   ├── tags.controller.js
│   │   └── user.controller.js
│   ├── db/
│   │   └── db.js
│   ├── routes/
│   │   ├── category.route.js
│   │   ├── link.route.js
│   │   ├── notes.route.js
│   │   ├── pdf.route.js
│   │   ├── public.route.js
│   │   ├── tags.route.js
│   │   └── user.route.js
│   ├── zod/
│   │   └── project.validation.js
├── index.js
├── package.json
├── README.md
├── .gitignore
└── pnpm-lock.yaml
```

---

## Running Locally

To run this project locally, ensure you have:

- Node.js installed (v16+ recommended)
- `pnpm` installed globally (`npm install -g pnpm`)

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/your-username/kbox.git
cd kbox
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start the development server**

```bash
pnpm run dev
```

The backend server will start on [http://localhost:3000](http://localhost:3000) (or your configured port).

---
