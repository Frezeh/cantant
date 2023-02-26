import { StatusBar } from "expo-status-bar";
import { StyleSheet, Alert, ScrollView } from "react-native";
import {
  ApplicationProvider,
  Button,
  Layout,
  IconRegistry,
  Input,
  Text,
  Toggle,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import Todos from "./components/Todos";
import useTodos from "./hooks/useTodos";
import React, { useState } from "react";

type ThemeType = "light" | "dark";

export default function App() {
  const { todos, currentTodo, setCurrentTodo, addTodo } = useTodos();
  const [checked, setChecked] = useState(true);
  const [theme, setTheme] = useState<ThemeType>("dark");

  const handleAddTodos = () => {
    if (currentTodo === "") Alert.alert("Todo item cannot be empty");
    else addTodo();
  };

  const onCheckedChange = (isChecked: boolean) => {
    setTheme(theme === "light" ? "dark" : "light");
    setChecked(isChecked);
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva[theme]}>
        <Layout style={styles.container}>
          <Toggle
            checked={checked}
            onChange={onCheckedChange}
            style={styles.toggle}
          >
            {theme}
          </Toggle>
          <Input
            value={currentTodo}
            placeholder="Add new todos....."
            onChangeText={setCurrentTodo}
            size="large"
          />
          <Button
            onPress={handleAddTodos}
            status="success"
            style={styles.button}
          >
            Add todo
          </Button>

          <Text style={styles.header}>My Todos</Text>
          <Text style={styles.text}>
            You have <Text style={{ fontWeight: "bold" }}>{todos.length}</Text>{" "}
            todos
          </Text>

          <ScrollView style={styles.scroll}>
            {todos.map((todo) => (
              <Todos key={todo.id} todo={todo} />
            ))}
          </ScrollView>
        </Layout>
        <StatusBar style="auto" />
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 20,
  },
  toggle: {
    paddingBottom: 10,
    alignSelf: "flex-end",
  },
  button: {
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  text: {
    fontSize: 18,
  },
  scroll: {
    marginTop: 20,
  },
});
