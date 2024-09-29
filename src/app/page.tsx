"use client";
import styles from "./page.module.css";
import React, { useState, useEffect } from "react";

interface TodoType {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  duedate: string;
}

export default function Home() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duedate, setDuedate] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/todo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setTodos(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleAddTodo = async () => {
    // ตรวจสอบว่าทุกข้อมูลครบถ้วน
    if (!name || !description || !duedate) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          status: false,
          duedate,
        }),
      });
      const result = await response.json();
      setTodos((prevTodos) => [...prevTodos, result.data]);
      setName("");
      setDescription("");
      setDuedate("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleUpdateStatus = async (id: string, status: boolean) => {
    try {
      await fetch("http://localhost:3000/api/v1/todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          status: !status,
        }),
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, status: !status } : todo
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await fetch("http://localhost:3000/api/v1/todo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className={styles.page}>
      <h1>TODO LIST</h1>
      <div className={styles.addTodo}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Insert your list here"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="date"
          value={duedate}
          onChange={(e) => setDuedate(e.target.value)}
          placeholder="Date"
        />
        <button onClick={handleAddTodo}>ADD</button>
      </div>
      <div className={styles.todoList}>
        <div className={styles.pendingTasks}>
          <h2>Pending List</h2>
          {todos
            .filter((todo) => !todo.status)
            .map((todo) => (
              <div key={todo._id} className={styles.todoItem}>
                <h3>{todo.name}</h3>
                <p>{todo.description}</p>
                <span className={styles.dueDate}>
                  Date: {new Date(todo.duedate).toLocaleDateString()}
                </span>
                <button
                  className={styles.statusButton}
                  onClick={() => handleUpdateStatus(todo._id, todo.status)}
                >
                  Mark as Done
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
        <div className={styles.completedTasks}>
          <h2>Completed List</h2>
          {todos
            .filter((todo) => todo.status)
            .map((todo) => (
              <div
                key={todo._id}
                className={`${styles.todoItem} ${styles.completed}`}
              >
                <h3>{todo.name}</h3>
                <p>{todo.description}</p>
                <span className={styles.dueDate}>
                  Date: {new Date(todo.duedate).toLocaleDateString()}
                </span>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}