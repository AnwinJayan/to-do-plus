# API Documentation

## Entities

### List

**Schema:**

```
{
  _id: string,
  userId: string,
  title: string, // required, max 100 chars, not empty/whitespace
  isFavorited: boolean,
  created_at: string (date-time),
  modified_at: string (date-time)
}
```

#### CreateListInput

```
{
  title: string // required
}
```

#### UpdateListInput

```
{
  title?: string,
  isFavorited?: boolean
}
```

### Task

**Schema:**

```
{
  _id: string,
  userId: string,
  listId: string,
  title: string, // required, max 200 chars, not empty/whitespace
  completed: boolean,
  position: integer,
  created_at: string (date-time),
  modified_at: string (date-time)
}
```

#### CreateTaskInput

```
{
  title: string, // required
  listId: string // required
}
```

#### UpdateTaskInput

```
{
  title?: string,
  completed?: boolean,
  position?: integer
}
```

---

## List Routes

### POST `/lists`

- **Description:** Create a new list
- **Request Body:** `CreateListInput`
- **Response:**
  - **201**
  - **Body:**
    ```json
    {
      "message": "List created successfully",
      "list": {
        /* List object */
      }
    }
    ```

### POST `/lists/ai`

- **Description:** Create a new list using AI
- **Request Body:** `{ prompt: string }`
- **Response:**
  - **201**
  - **Body:**
    ```json
    {
      "message": "AI-generated list created successfully",
      "list": {
        /* List object */
      }
    }
    ```

### GET `/lists`

- **Description:** Get all lists for the authenticated user
- **Query Params:**
  - `isFavorited` (boolean, optional)
  - `search` (string, optional)
  - `sort` (string, optional)
  - `page` (integer, optional)
  - `limit` (integer, optional)
- **Response:**
  - **200**
  - **Body:**
    ```json
    {
      "message": "Lists retrieved successfully",
      "lists": [
        /* List object, ... */
      ]
    }
    ```

### GET `/lists/{id}`

- **Description:** Get a list by ID
- **Path Param:** `id` (string)
- **Response:**
  - **200**
  - **Body:**
    ```json
    {
      "message": "List retrieved successfully",
      "list": {
        /* List object */
      }
    }
    ```

### PATCH `/lists/{id}`

- **Description:** Update a list by ID
- **Path Param:** `id` (string)
- **Request Body:** `UpdateListInput`
- **Response:**
  - **200**
  - **Body:**
    ```json
    {
      "message": "List updated successfully",
      "list": {
        /* Updated List object */
      }
    }
    ```

### DELETE `/lists/{id}`

- **Description:** Delete a list by ID
- **Path Param:** `id` (string)
- **Response:**
  - **204** (No content)

### DELETE `/lists`

- **Description:** Delete all lists for the authenticated user
- **Response:**
  - **204** (No content)

---

## Task Routes

### POST `/tasks`

- **Description:** Create a new task
- **Request Body:** `CreateTaskInput`
- **Response:**
  - **201**
  - **Body:**
    ```json
    {
      "message": "Task created successfully",
      "task": {
        /* Task object */
      }
    }
    ```

### GET `/tasks/{listId}`

- **Description:** Get all tasks for a list
- **Path Param:** `listId` (string)
- **Response:**
  - **200**
  - **Body:**
    ```json
    {
      "message": "Tasks retrieved successfully",
      "tasks": [
        /* Task object, ... */
      ]
    }
    ```

### GET `/tasks/id/{id}`

- **Description:** Get a task by ID
- **Path Param:** `id` (string)
- **Response:**
  - **200**
  - **Body:**
    ```json
    {
      "message": "Task retrieved successfully",
      "task": {
        /* Task object */
      }
    }
    ```

### PATCH `/tasks/{id}`

- **Description:** Update a task by ID
- **Path Param:** `id` (string)
- **Request Body:** `UpdateTaskInput`
- **Response:**
  - **200**
  - **Body:**
    ```json
    {
      "message": "Task updated successfully",
      "task": {
        /* Updated Task object */
      }
    }
    ```

### DELETE `/tasks/{id}`

- **Description:** Delete a task by ID
- **Path Param:** `id` (string)
- **Response:**
  - **204** (No content)
