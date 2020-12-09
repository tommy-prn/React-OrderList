import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

const item = {
  id: v4(),
  name: "Masak mie instan",
};

const item2 = {
  id: v4(),
  name: "Ngopi santai",
};

function App() {
  const [text, setText] = useState("");
  const [state, setState] = useState({
    todo: {
      title: "todo",
      items: [item, item2],
    },
    doing: {
      title: "in progress",
      items: [],
    },
    done: {
      title: "done",
      items: [],
    },
  });

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      prev[source.droppableId].items.splice(source.index, 1);

      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  const addItem = () => {
    setState((prev) => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          items: [
            {
              id: v4(),
              name: text,
            },
            ...prev.todo.items,
          ],
        },
      };
    });

    setText("");
  };

  const delItem = (id, event) => {
    setState((prev) => {
      let todo;
      let doing;
      let done;

      todo = prev.todo.items.filter((item) => item.id !== id);
      doing = prev.doing.items.filter((item) => item.id !== id);
      done = prev.done.items.filter((item) => item.id !== id);

      prev.todo.items = todo;
      prev.doing.items = doing;
      prev.done.items = done;

      return { ...prev };
    });
    setText("");
  };

  return (
    <div className="App">
      <div className="AddBar">
        <input
          className="Inputs"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addItem} className="ButtonAdd">
          Add
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="CardContainer">
          {_.map(state, (data, key) => {
            return (
              <div
                key={key}
                className="CardHolder"
                style={
                  data.title === "todo"
                    ? { backgroundColor: "#fffd82" }
                    : data.title === "done"
                    ? { backgroundColor: "#ff9b71" }
                    : { backgroundColor: "#dbf4a7" }
                }
              >
                <p className="HeaderTitle">{data.title}</p>
                <Droppable droppableId={key}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={"droppable-col"}
                      >
                        {data.items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && "dragging"
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <input
                                      type="checkbox"
                                      className="Checkbox"
                                    />
                                    <div>{el.name}</div>
                                    <button
                                      className="DeleteButton"
                                      onClick={(e) => delItem(el.id)}
                                    >
                                      X
                                    </button>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
