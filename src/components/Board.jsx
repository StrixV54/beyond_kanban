import React from "react";
import { useBoard } from "../context/BoardContext";
import Column from "./Column";
import AddTaskButton from "./AddTaskButton";

const Board = () => {
    const { columns } = useBoard();

    return (
        <div className="board">
            <div className="board-header">
                <AddTaskButton />
            </div>

            <div className="board-content">
                {columns.map((column) => (
                    <Column key={column.id} column={column} />
                ))}
            </div>
        </div>
    );
};

export default Board;
