import React from "react";
import { StyleSheet, Alert, View } from "react-native";
import {
  Card,
  Text,
  Layout,
  Modal,
  Button,
  Input,
} from "@ui-kitten/components";
import { ToDoItem } from "../models/todo-model";
import useTodos from "../hooks/useTodos";

export default function Todos({ todo }: { todo: ToDoItem }) {
  const { deleteTodo, updateTodo, isLoading, currentTodo, setCurrentTodo } = useTodos();
  const [isDeleteVisible, setIsDeleteVisible] = React.useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = React.useState(false);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading todos...</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteTodo(todo.id!);
    setIsDeleteVisible(false);
  };

  const handleUpdate = () => {
    if (currentTodo === "") Alert.alert("Todo item cannot be empty");
    else updateTodo(todo.id!);

    setIsUpdateVisible(false);
  };

  return (
    <View>
      <Card style={styles.card}>
        <Layout style={styles.layout}>
          <View style={styles.flex}>
            <Text style={styles.subdued}>{todo.activityDate}</Text>
            <Button
              onPress={() => setIsDeleteVisible(true)}
              status="danger"
              size="tiny"
              style={styles.button}
            >
              Delete
            </Button>
            <Button onPress={() => setIsUpdateVisible(true)} size="tiny" style={styles.button}>
              Update
            </Button> 
          </View>

            <Text style={styles.text}>{todo.todo}</Text>
        </Layout>
      </Card>

      <Modal
        visible={isDeleteVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setIsDeleteVisible(false)}
      >
        <Card disabled={true}>
          <Text>{`Are you sure you want to delete this item?`}</Text>
          <Button onPress={handleDelete} style={styles.margin}>
            YES
          </Button>
          <Button
            onPress={() => setIsDeleteVisible(false)}
            style={styles.margin}
          >
            NO
          </Button>
        </Card>
      </Modal>

      <Modal
        visible={isUpdateVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setIsUpdateVisible(false)}
        style={{ width: "80%" }}
      >
        <Card disabled={true}>
          <Input
            value={currentTodo}
            placeholder="update item....."
            onChangeText={setCurrentTodo}
            size="large"
          />
          <Button onPress={handleUpdate} style={styles.margin}>
            UPDATE
          </Button>
        </Card>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 10,
    marginBottom: 10,
  },
  layout: {
    display: "flex",
    justifyContent: "space-between",
    width: "80%",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subdued: {
    fontSize: 12,
    color: "grey",
  },
  text: {
    fontSize: 20,
    marginTop: 5
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  margin: {
    margin: 10,
  },
  button: {
    marginLeft: 10, 
    marginRight: 5
  }
});
