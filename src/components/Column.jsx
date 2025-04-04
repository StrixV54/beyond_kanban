import React, { useState, useRef, useCallback } from "react";
import Task from "./Task";
import { useBoard } from "../context/BoardContext";

const Column = ({ column }) => {
    const { id, title, color, tasks } = column;
    const { moveTask } = useBoard();
    const [isDragOver, setIsDragOver] = useState(false);
    const [dropPosition, setDropPosition] = useState(-1);
    const columnRef = useRef(null);
    const lastUpdateTimeRef = useRef(0);
    const isDropInProgressRef = useRef(false);

    // Debounced function to calculate drop position to avoid glitches
    const calculateDropPosition = useCallback(
        (e) => {
            // Skip calculations if a drop is in progress
            if (isDropInProgressRef.current) return;

            // throttle updates
            const now = Date.now();
            if (now - lastUpdateTimeRef.current < 50) return;
            lastUpdateTimeRef.current = now;

            if (!columnRef.current) return;

            const columnRect = columnRef.current.getBoundingClientRect();
            const mouseY = e.clientY - columnRect.top;

            // If no tasks is present, set position to 0
            if (tasks.length === 0) {
                setDropPosition(0);
                return;
            }

            const taskElements = columnRef.current.querySelectorAll(".task-card");
            if (taskElements.length === 0) return;

            // Check if mouse is above the first task
            const firstTaskRect = taskElements[0].getBoundingClientRect();
            const firstTaskTop = firstTaskRect.top - columnRect.top;

            if (mouseY < firstTaskTop + 10) {
                setDropPosition(0);
                return;
            }

            //Check if mouse is below the last task
            const lastTaskRect = taskElements[taskElements.length - 1].getBoundingClientRect();
            const lastTaskBottom = lastTaskRect.bottom - columnRect.top;

            if (mouseY > lastTaskBottom - 10) {
                setDropPosition(tasks.length);
                return;
            }

            // loop through tasks to find the insert position
            for (let i = 0; i < taskElements.length; i++) {
                const taskRect = taskElements[i].getBoundingClientRect();
                const taskTop = taskRect.top - columnRect.top;
                const taskBottom = taskRect.bottom - columnRect.top;

                //If mouse is in the top half of a task, place it before the task
                if (mouseY >= taskTop && mouseY < taskTop + taskRect.height / 2) {
                    setDropPosition(i);
                    return;
                }

                // If mouse is in the bottom half of a task, place it after the task
                if (mouseY >= taskTop + taskRect.height / 2 && mouseY < taskBottom) {
                    setDropPosition(i + 1);
                    return;
                }

                // If mouse is between two tasks
                if (i < taskElements.length - 1) {
                    const nextTaskRect = taskElements[i + 1].getBoundingClientRect();
                    const nextTaskTop = nextTaskRect.top - columnRect.top;

                    if (mouseY >= taskBottom && mouseY < nextTaskTop) {
                        setDropPosition(i + 1);
                        return;
                    }
                }
            }
        },
        [tasks.length]
    );

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!isDragOver) {
            setIsDragOver(true);
        }

        // calculate drop position but avoid recalculation during drop
        calculateDropPosition(e);
    };

    const handleDragLeave = (e) => {
        // don't reset if dragging over child elements
        if (columnRef.current && columnRef.current.contains(e.relatedTarget)) {
            return;
        }

        setIsDragOver(false);
        setDropPosition(-1);
    };

    const handleDrop = (e) => {
        e.preventDefault();

        // set flag to preven recalculation
        isDropInProgressRef.current = true;

        const taskId = e.dataTransfer.getData("taskId");
        const sourceColId = e.dataTransfer.getData("sourceColId");

        // get current position
        const currentDropPos = dropPosition;

        // // only process if drop coming from a different column
        if (sourceColId !== id) {
            moveTask(taskId, sourceColId, id, currentDropPos);
        }

        // Reset state after a small delay to ensure the drop completes
        setTimeout(() => {
            setIsDragOver(false);
            setDropPosition(-1);
            isDropInProgressRef.current = false;
        }, 50);
    };

    // render tasks with the indicator at the right position
    const renderTasksWithIndicator = () => {
        if (tasks.length === 0) {
            return (
                <>
                    <div className="empty-column">
                        <p>No tasks yet</p>
                        <p>Drag and drop tasks here or add a new task</p>
                    </div>
                    {isDragOver && <div className="drop-indicator"></div>}
                </>
            );
        }

        // show indicator at specific position between tasks
        return tasks.map((task, idx) => (
            <React.Fragment key={task.id}>
                {idx === dropPosition && isDragOver && <div className="drop-indicator"></div>}
                <Task task={task} columnId={id} />
                {idx === tasks.length - 1 && dropPosition === tasks.length && isDragOver && <div className="drop-indicator"></div>}
            </React.Fragment>
        ));
    };

    return (
        <div className={`column ${isDragOver ? "drag-over" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} ref={columnRef}>
            <div className="column-header">
                <div className="column-label" style={{ backgroundColor: color }}>
                    <span className="column-title">{title}</span>
                </div>
                <div className="column-task-count">{tasks.length} tasks</div>
            </div>

            <div className="column-content">{renderTasksWithIndicator()}</div>
        </div>
    );
};

export default Column;
