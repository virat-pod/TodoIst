import { useEffect, useState } from "react";
import "./index.css";
import { DateTime } from "luxon";
import Input from "./components/input";
import { MdCheck, MdDelete, MdClose, MdRefresh } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [currentTime, setCurrentTime] = useState(DateTime.now());
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [onlyCheck, setCheck] = useState(false);
  const [onlyCheckTodo, setCheckTodo] = useState([]);

  let saveTodo = (updateTodo) => {
    localStorage.setItem("todos", JSON.stringify(updateTodo));
  };

  useEffect(() => {
  let saveTodos = JSON.parse(localStorage.getItem("todos")) || [];
  setTodos(saveTodos);
}, []);

  const dateGet = (which) => {
    const now = currentTime;
    if (which == "date") {
      return now.toFormat("dd/MM/yyyy");
    } else if (which == "time") {
      return now.toFormat("h:mm:ss a");
    }
    return "something went wrong";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onChange = (e) => {
    setTodo(e.target.value);
  };

  const onAdd = async () => {
    let task = todo.trim();
    if (task === "") return;
    let newTodo = [
      ...todos,
      {
        id: uuidv4(),
        task,
        time: DateTime.now().toFormat("hh:mm a"),
        isCompleted: false,
      },
    ];
    setTodos(newTodo);
    setTodo("");
    saveTodo(newTodo);
  };

  const checkTodo = (id) => {
    let index = todos.findIndex((i) => i.id == id);
    if (index >= 0) {
      const newTodo = [...todos];
      const todo = newTodo[index];
      todo.isCompleted = !todo.isCompleted;
      todo.finishedTime = todo.finishedTime
        ? false
        : DateTime.now().toFormat("hh:mm a");
      if (!todo.finishedTime) {
        todo.time = DateTime.now().toFormat("hh:mm a");
      }
      setTodos(newTodo);
      saveTodo(newTodo);
    }
  };

  const deleteTodo = (id) => {
    let newTodo = todos.filter((item) => item.id !== id);
    setTodos(newTodo);
    if (onlyCheckTodo) {
      let checkTodos = onlyCheckTodo.filter((item) => item.id !== id);
      setCheckTodo(checkTodos);
    }
    saveTodo(newTodo);
  };

  const editTodo = (id) => {
    let ThatTodo = todos.find((i) => i.id === id);
    if (ThatTodo.isCompleted == true) return;
    let newTodo = todos.filter((item) => item.id !== id);
    setTodos(newTodo);
    setTodo(ThatTodo.task);
    saveTodo(todos);
  };
  const onlyChecks = () => {
    let value = !onlyCheck;
    setCheck(value);
    if (value) {
      let checkTodos = todos.filter((i) => i.isCompleted == true);
      setCheckTodo(checkTodos);
    }
  };

  return (
    <div className="bg-[linear-gradient(135deg,_#1b262c_0%,_#0f4c75_100%)] relative overflow-hidden w-full h-screen flex items-center text-white justify-center">
      <div className=" w-full lg:w-2xl px-2 flex flex-col gap-4 h-screen overflow-x-hidden overflow-y-scroll pr-2.5 hover:pr-0 hover:scrollbar items-center pt-28 sm:pt-20">
        <h1 className=' text-6xl md:text-7xl text-amber-100 font-["Playwrite_AT"] border-r-[3px] mb-8 border-r-[white]'>
          Just do It.
        </h1>
        <div className="flex flex-col w-full justify-center sm:w-full sm:max-w-xl md:max-w-2xl gap-1 text-center mb-7 mx-auto ">
          <Input
            onChange={onChange}
            isCheckOnly={onlyChecks}
            todo={todo}
            onAdd={onAdd}
          />
        </div>
        <div className="inbox">
          <div className="time text-green-50 font-mono text-[1.4rem] tracking-wide">
            {dateGet("date")}, {dateGet("time")}
          </div>
        </div>
        <div className="todos w-sm sm:w-md items-center md:w-lg flex flex-col sm:pt-1.5 pb-4 gap-2 text-white">
          {(todos.length === 0 ||
            (todos.every((todo) => todo.isCompleted) && !onlyCheck)) && (
            <div className="w-full text-[1.6rem] underline font-['Titillium_Web'] cursor-not-allowed text-center font-bold">
              No todo's to display
            </div>
          )}
          {(onlyCheck ? onlyCheckTodo : todos).map((items) => {
            if (items.isCompleted && !onlyCheck) {
              return;
            }
            return (
              <div
                key={items.id}
                className="group todo relative h-fit w-[90%] sm:w-full flex py-3 gap-2 sm:gap-7 bg-black/45 justify-between items-center rounded-4xl px-3 "
              >
                <div
                  className={` text-zinc-400 gap-2 hidden group-hover:flex group-active:flex absolute font-normal top-0.5 left-5 text-[12px]`}
                >
                  <span>{items.time}</span>
                  <span
                    className={`${items.isCompleted && "line-through flex decoration-red-400 text-red-200"}`}
                  >
                    {items.finishedTime && items.finishedTime}
                  </span>
                </div>
                <div
                  onClick={() => editTodo(items.id)}
                  className="min-w-0 cursor-pointer text-[1.1rem] sm:text-xl "
                >
                  <p
                    className={`break-words ${items.isCompleted ? "line-through" : ""}`}
                  >
                    {items.task}
                  </p>
                </div>
                <div className="flex h-full gap-3 items-center">
                  <button
                    onClick={() => checkTodo(items.id)}
                    className={`btns ${items.isCompleted && "bg-green-200 shadow-none"}`}
                  >
                    {items.isCompleted ? <MdRefresh /> : <MdCheck />}
                  </button>
                  <button
                    onClick={() => deleteTodo(items.id)}
                    className="btns hover:bg-red-500 active:bg-red-500 bg-red-400 shadow-none"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="copy-right absolute bottom-2 right-2 font-medium text-purple-100">
        Made By |{" "}
        <a
          href="https://github.com/virat-pod"
          target="_blank"
          className="hover:text-purple-400 active:text-purple-400"
        >
          ViratPod
        </a>
      </div>
    </div>
  );
}

export default App;
