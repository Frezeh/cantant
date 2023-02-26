import React, { useEffect, useState, useCallback } from "react";
import * as SQLite from "expo-sqlite";
import { ToDoItem } from "../models/todo-model";

export default function useTodos() {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [currentTodo, setCurrentTodo] = useState("");

  const db = SQLite.openDatabase("mytodoapp");
  const todaysDate = new Date().toLocaleString();
  // const loadDataCallback = useCallback(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, activityDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, todo TEXT)"
  //     );
  //   });

  //   db.transaction((tx) => {
  //     tx.executeSql("SELECT * FROM todos", null!,
  //       (txObj, resultSet) => setTodos(resultSet.rows._array),
  //       // @ts-ignore
  //       (txObj, error) => console.log(error)
  //     )
  //   });
  
  //   setIsLoading(false);
  // }, [todos]);
  
  // useEffect(() => {
  //   loadDataCallback()
  // }, [loadDataCallback])
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, activityDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, todo TEXT)"
      );
    });

    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM todos", null!,
        (txObj, resultSet) => {
          //console.log(resultSet.rows._array)
          setTodos(resultSet.rows._array)
        },
        // @ts-ignore
        (txObj, error) => console.log(error)
      )
    });
  
    setIsLoading(false);
  }, [todos])
  

  const addTodo = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO todos (todo, activityDate) values (?, ?)", [currentTodo, todaysDate],
        (txObj, resultSet) => {
          let existingTodos = [...todos];
          existingTodos.push({ id: resultSet.insertId, activityDate: todaysDate,  todo: currentTodo });
          setTodos(existingTodos);
          setCurrentTodo("");
        },
        // @ts-ignore
        (txObj, error) => console.log(error)
      );
    });
  };

  const deleteTodo = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM todos WHERE id = ?", [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingTodos = [...todos].filter((name) => name.id !== id);
            setTodos(existingTodos);
          }
        },
        // @ts-ignore
        (txObj, error) => console.log(error)
      );
    });
  };

  const updateTodo = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE todos SET todo = ? WHERE id = ?", [currentTodo, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingTodos = [...todos];
            const indexToUpdate = existingTodos.findIndex(
              (name) => name.id === id
            );
            existingTodos[indexToUpdate].todo = currentTodo;
            setTodos(existingTodos);
            setCurrentTodo("");
          }
        },
        // @ts-ignore
        (txObj, error) => console.log(error)
      );
    });
  };

  return {
    addTodo,
    deleteTodo,
    todos,
    updateTodo,
    currentTodo,
    setCurrentTodo,
    isLoading,
  };
}