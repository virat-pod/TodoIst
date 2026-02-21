import React from "react";

const input = (props) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-0">
        <input
          onChange={props.onChange}
          value={props.todo}
          className="bg-[#091823] outline-0 h-10.5 w-full sm:max-w-[80%]  rounded-[4px] sm:rounded-none sm:rounded-l-2xl pl-2"
          type="text"
          placeholder="Add a task"
        />
        <button
          onClick={props.onAdd}
          className="bg-amber-100 cursor-pointer w-[98%] ml-[0.5px] sm:w-auto sm:ml-0 h-9 sm:h-10.5 px-2 rounded-[4px] sm:rounded-none  sm:rounded-r-2xl font-medium text-zinc-700 self-center"
        >
          I Got This!
        </button>
      </div>
      <div className="flex items-center sm:ml-5 gap-2 pl-2 text-blue-100">
        {" "}
        Show Finished{" "}
        <input onChange={props.isCheckOnly} className="mt-1" type="checkbox" />
      </div>
    </>
  );
};

export default input;
