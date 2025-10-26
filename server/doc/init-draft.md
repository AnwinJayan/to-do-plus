# 📋 To-Do Web App Documentation

## 📝 Description

This is a simple to-do web application that allows users to create and manage to-do lists. Users have two options:

1. **Manual List Creation**: Users can manually create their own to-do lists and add tasks as needed.
2. **AI-Generated Lists**: Users can input a goal or task in a form with the label “I want to…” (e.g., “bake a chocolate cake”). Using the Gemini API, the app generates an appropriate list title and step-by-step tasks relevant to that input.

---

## 🧹 Entities

### **User**

- `email`: string – user's email address
- `username`: string – unique display name
- `_id`: string – unique identifier

### **List**

- `title`: string – title of the list
- `isFavorited`: boolean – indicates if the list is marked as favorite
- `created_at`: datetime – when the list was created
- `modified_at`: datetime – when the list was last modified
- `userId`: string – reference to the user who owns the list

### **Task**

- `title`: string – title of the task
- `completed`: boolean – indicates if the task is completed
- `position`: number – task's order in the list
- `listId`: string – reference to the list
- `userId`: string – reference to the user

---

## 🌐 API Base URL

```
/api/v1/
```

---

## 📂 List Routes

### **Create a blank list**

- `POST /list`
- **Query Parameters**: isFavorited \[boolean]
- **Request Body**:

  ```json
  {
    "title": "Grocery List"
  }
  ```

- **Response**:

  ```json
  {
    "msg": "List created",
    "list": { ... }
  }
  ```

### **Generate a list using AI**

- `POST /list/ai`
- **Request Body**:

  ```json
  {
    "prompt": "bake a chocolate cake"
  }
  ```

- **Response**:

  ```json
  {
    "msg": "AI-generated list created",
    "list": { ... },
  }
  ```

### **Get all user lists**

- `GET /list`
- **Response**:

  ```json
  {
    "lists": [ ... ]
  }
  ```

### **Get a single list by ID**

- `GET /list/:id`
- **Response**:

  ```json
  {
    "list": { ... }
  }
  ```

### **Update a list**

- `PATCH /list/:id`
- **Request Body**:

  ```json
  {
    "title": "New List Title",
    "isFavorited": true
  }
  ```

- **Response**:

  ```json
  {
    "msg": "List updated",
    "list": { ... }
  }
  ```

### **Delete a list**

- `DELETE /list/:id`
- **Response**:

  ```json
  {
    "msg": "List deleted"
  }
  ```

### **Delete all lists**

- `DELETE /list`
- **Response**:

  ```json
  {
    "msg": "All lists deleted"
  }
  ```

---

## ✅ Task Routes

### **Add task to list**

- `POST /task`
- **Request Body**:

  ```json
  {
    "title": "Buy eggs",
    "listId": "abc123",
    "userId": "user456"
  }
  ```

- **Response**:

  ```json
  {
    "msg": "Task added",
    "task": { ... }
  }
  ```

### **Get tasks for a list**

- `GET /task/:listId`
- **Response**:

  ```json
  {
    "tasks": [ ... ]
  }
  ```

### **Get a single task by ID**

- `GET /task/id/:id`
- **Response**:

  ```json
  {
    "task": { ... }
  }
  ```

### **Update a task**

- `PATCH /task/:id`
- **Request Body**:

  ```json
  {
    "title": "Buy eggs and milk",
    "completed": true,
    "position": 2
  }
  ```

- **Response**:

  ```json
  {
    "msg": "Task updated",
    "task": { ... }
  }
  ```

### **Delete a task**

- `DELETE /task/:id`
- **Response**:

  ```json
  {
    "msg": "Task deleted"
  }
  ```
