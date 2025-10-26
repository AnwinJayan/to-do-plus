# Smart To-Do App – Server

This is the back-end API for **Smart To-Do**, an AI-powered task management app that automatically generates task lists and helps you stay organized with minimal effort.

## Features

- ✨ AI-generated task lists and suggestions
- 🧠 Smart prioritization and reminders
- 📂 Categories, labels, and user management
- 🔒 Authentication and security best practices
- 🖼️ File/image upload (local and Cloudinary support)
- 📝 Modular CRUD endpoints for tasks, bags, resources, and more
- 📊 Swagger API docs at `/api-docs`

## Getting Started

```bash
cd server
yarn install
# Copy .env.example to .env and set your environment variables
yarn dev
```

API runs at [http://localhost:5000](http://localhost:5000)

## Structure & Usage

- Modular feature-based folders in `src/`
- Mongoose models in `src/models/`
- API routes in `src/routes/`
- Controllers and services for business logic
- Centralized error handling and validation

## Documentation

- [TechnicalDoc.md](./docs/TechnicalDoc.md): Technical breakdown
- [ScaffoldingDoc.md](./docs/ScaffoldingDoc.md): Extending and customizing the API
- [api-doc.md](./docs/api-doc.md): API endpoints and schemas

## Contributing

Contributions are welcome! Please fork the repo, create a feature branch, and submit a pull request.
