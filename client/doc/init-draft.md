# 🧩 To-Do App Frontend Requirements (React)

## 🎯 Goal

Build a responsive and intuitive React-based frontend for the To-Do Web App that integrates seamlessly with the backend API and supports AI-generated and manual list creation.

---

## 🛠️ Tech Stack

- **React** (with Hooks)
- **React Router** for routing
- **Axios** for API requests
- **Tailwind CSS** for styling
- **Context API** or **Redux** for global state management (user, lists, tasks)
- **Toast notifications** for feedback

---

## 🔐 Authentication (Optional for MVP)

- Login/Signup with email
- Token storage in localStorage or HttpOnly cookie

---

## 🧭 Pages / Routes

- `/` – Dashboard or redirect to login
- `/login` – Login page
- `/register` – Register page
- `/lists` – List overview (all lists)
- `/list/:id` – Detailed view of a single list

---

## 📦 Components

### **NavigationBar**

- Links to Home, Lists, Logout

### **ListCard**

- Title, favorite toggle, edit/delete buttons

### **TaskItem**

- Title, checkbox for completion, reorder drag handle (optional)

### **NewListForm**

- Title input
- AI prompt field (optional)

### **TaskForm**

- Add/edit task fields

### **SortControls**

- Sort by created, modified, or title

---

## 🔄 Interactions

- CRUD for Lists and Tasks
- Toggle favorites
- AI-generated list creation from prompt input
- Sorting lists (client-side or via query params)
- Drag-and-drop task ordering (optional, advanced)

---

## 📞 API Integration

Use Axios to interact with endpoints as defined in the backend documentation (see separate doc).

---

## 🧪 Testing (Optional)

- Unit tests for components (e.g., with Jest/React Testing Library)
- E2E tests (e.g., Cypress)

---

Let me know what to expand or adjust next!
