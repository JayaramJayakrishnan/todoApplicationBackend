const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");

const format = require("date-fns/format");
const { open } = require("sqlite");

let db = null;
const dbPath = path.join(__dirname, "todoApplication.db");

const app = express();
app.use(express.json());

statusValues = ["TO DO", "IN PROGRESS", "DONE"];
priorityValues = ["HIGH", "MEDIUM", "LOW"];
categoryValues = ["HOME", "WORK", "LEARNING"];

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const checkInfoValidityGet = (request, response, next) => {
  let isValid = true;
  const { status, priority, category } = request.query;
  if (status !== undefined) {
    if (!statusValues.includes(status)) {
      response.status(400);
      response.send("Invalid Todo Status");
      isValid = false;
    }
  }
  if (priority !== undefined) {
    if (!priorityValues.includes(priority)) {
      response.status(400);
      response.send("Invalid Todo Priority");
      isValid = false;
    }
  }
  if (category !== undefined) {
    if (!categoryValues.includes(category)) {
      response.status(400);
      response.send("Invalid Todo Category");
      isValid = false;
    }
  }
  if (isValid) {
    next();
  }
};

const checkInfoValidityPost = (request, response, next) => {
  let isValid = true;
  const { status, priority, category } = request.body;
  if (status !== undefined) {
    if (!statusValues.includes(status)) {
      response.status(400);
      response.send("Invalid Todo Status");
      isValid = false;
    }
  }
  if (priority !== undefined) {
    if (!priorityValues.includes(priority)) {
      response.status(400);
      response.send("Invalid Todo Priority");
      isValid = false;
    }
  }
  if (category !== undefined) {
    if (!categoryValues.includes(category)) {
      response.status(400);
      response.send("Invalid Todo Category");
      isValid = false;
    }
  }
  if (isValid) {
    next();
  }
};

const checkDateValidityGet = (request, response, next) => {
  const { date } = request.query;
  if (isValid(new Date(date))) {
    next();
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
};

const checkDateValidityPost = (request, response, next) => {
  const { dueDate } = request.body;
  if (isValid(new Date(dueDate))) {
    next();
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
};

//GET todo

app.get("/todos/", checkInfoValidityGet, async (request, response) => {
  const { status, priority, search_q, category } = request.query;
  if (
    status !== undefined &&
    priority === undefined &&
    category === undefined
  ) {
    const getTodosQuery = `SELECT * FROM todo 
        WHERE status = "${status}";`;

    const responseObj = await db.all(getTodosQuery);
    const todoList = responseObj.map((obj) => {
      return {
        id: obj.id,
        todo: obj.todo,
        priority: obj.priority,
        status: obj.status,
        category: obj.category,
        dueDate: obj.due_date,
      };
    });
    response.send(todoList);
  } else if (
    priority !== undefined &&
    status === undefined &&
    category === undefined
  ) {
    const getTodoQuery = `SELECT * FROM todo 
        WHERE priority = "${priority}";`;
    const responseObj = await db.all(getTodoQuery);
    const todoList = responseObj.map((obj) => {
      return {
        id: obj.id,
        todo: obj.todo,
        priority: obj.priority,
        status: obj.status,
        category: obj.category,
        dueDate: obj.due_date,
      };
    });
    response.send(todoList);
  } else if (priority !== undefined && status !== undefined) {
    const getTodoQuery = `SELECT * FROM todo 
        WHERE priority = "${priority}" AND status = "${status}";`;
    const responseObj = await db.all(getTodoQuery);
    const todoList = responseObj.map((obj) => {
      return {
        id: obj.id,
        todo: obj.todo,
        priority: obj.priority,
        status: obj.status,
        category: obj.category,
        dueDate: obj.due_date,
      };
    });
    response.send(todoList);
  } else if (search_q !== undefined) {
    const getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}%";`;
    const responseObj = await db.all(getTodoQuery);
    const todoList = responseObj.map((obj) => {
      return {
        id: obj.id,
        todo: obj.todo,
        priority: obj.priority,
        status: obj.status,
        category: obj.category,
        dueDate: obj.due_date,
      };
    });
    response.send(todoList);
  } else if (category !== undefined && status !== undefined) {
    const getTodoQuery = `SELECT * FROM todo 
        WHERE category = "${category}" AND status = "${status}";`;
    const responseObj = await db.all(getTodoQuery);
    const todoList = responseObj.map((obj) => {
      return {
        id: obj.id,
        todo: obj.todo,
        priority: obj.priority,
        status: obj.status,
        category: obj.category,
        dueDate: obj.due_date,
      };
    });
    response.send(todoList);
  } else if (category !== undefined && priority === undefined) {
    const getTodoQuery = `SELECT * FROM todo 
        WHERE category = "${category}";`;
    const responseObj = await db.all(getTodoQuery);
    const todoList = responseObj.map((obj) => {
      return {
        id: obj.id,
        todo: obj.todo,
        priority: obj.priority,
        status: obj.status,
        category: obj.category,
        dueDate: obj.due_date,
      };
    });
    response.send(todoList);
  } else if (category !== undefined && priority !== undefined) {
    const getTodoQuery = `SELECT * FROM todo 
        WHERE category = "${category}" AND priority = "${priority}";`;
    const responseObj = await db.all(getTodoQuery);
    const todoList = responseObj.map((obj) => {
      return {
        id: obj.id,
        todo: obj.todo,
        priority: obj.priority,
        status: obj.status,
        category: obj.category,
        dueDate: obj.due_date,
      };
    });
    response.send(todoList);
  }
});

//GET todo

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `SELECT * FROM todo
    WHERE id = ${todoId};`;

  const responseObj = await db.get(getTodoQuery);
  response.send({
    id: responseObj.id,
    todo: responseObj.todo,
    priority: responseObj.priority,
    status: responseObj.status,
    category: responseObj.category,
    dueDate: responseObj.due_date,
  });
});

//agenda

app.get("/agenda/", checkDateValidityGet, async (request, response) => {
  const { date } = request.query;
  const dueDate = format(new Date(date), "yyyy-MM-dd");
  const getTodoQuery = `SELECT * FROM todo
    WHERE due_date = "${dueDate}";`;

  const responseObj = await db.all(getTodoQuery);
  const todoList = responseObj.map((obj) => {
    return {
      id: obj.id,
      todo: obj.todo,
      priority: obj.priority,
      status: obj.status,
      category: obj.category,
      dueDate: obj.due_date,
    };
  });

  response.send(todoList);
});

//POST todo

app.post(
  "/todos/",
  checkInfoValidityPost,
  checkDateValidityPost,
  async (request, response) => {
    const { id, todo, priority, status, category, dueDate } = request.body;
    const postTodoQuery = `INSERT INTO todo (id, todo, priority, status, category, due_date)
    VALUES (${id}, "${todo}", "${priority}", "${status}", "${category}", "${dueDate}");`;

    let res = await db.run(postTodoQuery);
    response.send("Todo Successfully Added");
  }
);

//update todo

app.put("/todos/:todoId/", checkInfoValidityPost, async (request, response) => {
  const { todoId } = request.params;
  const { todo, priority, status, category, dueDate } = request.body;
  if (status !== undefined) {
    const updateTodoQuery = `UPDATE todo SET
    status = "${status}"
    WHERE id = ${todoId};`;

    await db.run(updateTodoQuery);
    response.send("Status Updated");
  }
  if (priority !== undefined) {
    const updateTodoQuery = `UPDATE todo SET priority = "${priority}" WHERE id = ${todoId};`;
    await db.run(updateTodoQuery);
    response.send("Priority Updated");
  }
  if (todo !== undefined) {
    const updateTodoQuery = `UPDATE todo SET todo = "${todo}" WHERE id = ${todoId};`;
    await db.run(updateTodoQuery);
    response.send("Todo Updated");
  }
  if (category !== undefined) {
    const updateTodoQuery = `UPDATE todo SET category = "${category}" WHERE id = ${todoId};`;
    await db.run(updateTodoQuery);
    response.send("Category Updated");
  }
  if (dueDate !== undefined) {
    if (isValid(new Date(dueDate))) {
      const updateTodoQuery = `UPDATE todo SET due_date = "${dueDate}" WHERE id = ${todoId};`;
      await db.run(updateTodoQuery);
      response.send("Due Date Updated");
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }
});

//Delete Todo

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  console.log(todoId);
  const deleteTodoQuery = `DELETE FROM todo WHERE id = ${todoId};`;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
