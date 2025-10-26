# Smart To-Do App – Client

This is the front-end for **Smart To-Do**, an AI-powered task management app that automatically generates task lists and helps you stay organized with minimal effort.

## Features

- ✨ AI-generated task lists based on user input or goals
- 🧠 Smart suggestions and prioritization
- 📂 Simple categories and labels for easy organization
- 🔔 Reminders and deadline tracking
- 📱 Clean, intuitive interface
- 🎨 Theme support (light/dark)
- 🖼️ Image upload for resources and tasks

## Getting Started

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Structure & Usage

- Modular feature-based folders in `src/features/`
- Global state management in `src/store.ts`
- Theming and context in `src/contexts/`
- API layer in `src/lib/`
- Main entry: `src/App.tsx`

## Documentation

- [TechnicalDoc.md](./doc/TechnicalDoc.md): Architecture and technical details
- [ScaffoldingDoc.md](./doc/ScaffoldingDoc.md): How to scaffold new features and extend the app

## Contributing

Contributions are welcome! Please fork the repo, create a feature branch, and submit a pull request.
