import React, { useState, useEffect, useRef } from "react";
import { useBoard } from "../context/BoardContext";
import EditIcon from "../assets/edit.svg";

const Task = ({ task, columnId }) => {
    const { title, description, id } = task;
    const { openEditModal } = useBoard();
    const [isDragging, setIsDragging] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const taskRef = useRef(null);

    // Set new task animation
    useEffect(() => {
        setIsNew(true);
        const timer = setTimeout(() => {
            setIsNew(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleDragStart = (e) => {
        e.dataTransfer.setData("taskId", id);
        e.dataTransfer.setData("sourceColId", columnId);

        // Create a shadow preview image
        const dragImage = e.target.cloneNode(true);
        dragImage.classList.add("drag-ghost");
        dragImage.style.position = "absolute";
        dragImage.style.top = "-1000px";
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 20, 20);

        // Remove shadow previeww image
        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 0);

        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);

        // add animation class for returning to position
        if (taskRef.current) {
            taskRef.current.classList.add("task-return");
            setTimeout(() => {
                if (taskRef.current) {
                    taskRef.current.classList.remove("task-return");
                }
            }, 300);
        }
    };

    const handleClick = () => {
        openEditModal(id, columnId);
    };

    return (
        <div ref={taskRef} className={`task-card ${isDragging ? "dragging" : ""} ${isNew ? "task-new" : ""}`} draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} onClick={handleClick}>
            <div className="task-content">
                <h3 className="task-title">{title}</h3>
                <p className="task-description">{description}</p>
            </div>

            {/* Edit icon */}
            <img src={EditIcon} alt="edit" className="edit-icon" />
        </div>
    );
};

export default Task;
