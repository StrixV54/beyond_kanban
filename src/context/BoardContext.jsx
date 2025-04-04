import { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const initialColumns = [
    {
        id: "todo",
        title: "To Do",
        color: "#f9cece",
        tasks: [
            { id: "t1", title: "User Research", description: "Gather insights through research to improve UX." },
            { id: "t2", title: "Wireframe Creation", description: "Craft basic wireframes to define user flow." },
            { id: "t3", title: "Visual Design", description: "Design high-fidelity visuals based on wireframes." },
            { id: "t4", title: "Card Title", description: "A description of a task." },
        ],
    },
    {
        id: "in-progress",
        title: "In Progress",
        color: "#e0cef2",
        tasks: [
            { id: "t5", title: "Wireframing & Prototyping", description: "Creating low and high-fidelity UI structures." },
            { id: "t6", title: "Visual Design Enhancement", description: "Refining typography, colors, and layout." },
            { id: "t7", title: "Interaction Design", description: "Defining microinteractions and animations." },
            { id: "t8", title: "Wireframe comments", description: "Evaluating design effectiveness with users." },
        ],
    },
    {
        id: "completed",
        title: "Completed",
        color: "#cef2ce",
        tasks: [
            { id: "t9", title: "User Research & Insights", description: "Conducting surveys, interviews, and usability tests." },
            { id: "t10", title: "Usability Testing", description: "Evaluating design effectiveness with users." },
            { id: "t11", title: "Responsive Design Optimization", description: "Adapting UI across all devices." },
            { id: "t12", title: "Interaction Design", description: "Evaluating design effectiveness with users." },
        ],
    },
];

const BoardContext = createContext();

export function BoardProvider({ children }) {
    const [columns, setColumns] = useLocalStorage("kanban-columns", initialColumns);
    const [editingTask, setEditingTask] = useState(null);

    const addTask = (columnId, newTask) => {
        setColumns((prev) =>
            prev.map((col) => {
                if (col.id === columnId) {
                    return {
                        ...col,
                        tasks: [...col.tasks, newTask],
                    };
                }
                return col;
            })
        );
    };

    const moveTask = (taskId, sourceColId, destColId, insertIndex = -1) => {
        setColumns((prev) => {
            const sourceCol = prev.find((col) => col.id === sourceColId);
            const taskToMove = sourceCol.tasks.find((task) => task.id === taskId);

            // Remove the task from source column
            const newSourceCol = {
                ...sourceCol,
                tasks: sourceCol.tasks.filter((task) => task.id !== taskId),
            };

            // Add the task to destination column at the specified position
            return prev.map((col) => {
                if (col.id === sourceColId) return newSourceCol;
                if (col.id === destColId) {
                    const newTasks = [...col.tasks];

                    // If insertIndex is valid, insert at that position
                    if (insertIndex >= 0 && insertIndex <= newTasks.length) {
                        newTasks.splice(insertIndex, 0, taskToMove);
                    } else {
                        // Otherwise, add to the end
                        newTasks.push(taskToMove);
                    }

                    return {
                        ...col,
                        tasks: newTasks,
                    };
                }
                return col;
            });
        });
    };

    const editTask = (taskId, columnId, updatedTask) => {
        setColumns((prev) =>
            prev.map((col) => {
                if (col.id === columnId) {
                    return {
                        ...col,
                        tasks: col.tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
                    };
                }
                return col;
            })
        );
    };

    const findTask = (taskId) => {
        for (const column of columns) {
            const task = column.tasks.find((t) => t.id === taskId);
            if (task) {
                return { task, columnId: column.id };
            }
        }
        return null;
    };

    const openEditModal = (taskId, columnId) => {
        const task = columns.find((col) => col.id === columnId)?.tasks.find((t) => t.id === taskId);
        if (task) {
            setEditingTask({ ...task, columnId });
        }
    };

    const closeEditModal = () => {
        setEditingTask(null);
    };

    return (
        <BoardContext.Provider
            value={{
                columns,
                addTask,
                moveTask,
                editTask,
                findTask,
                editingTask,
                openEditModal,
                closeEditModal,
            }}
        >
            {children}
        </BoardContext.Provider>
    );
}

export const useBoard = () => useContext(BoardContext);

export default BoardContext;
