import React, { useState } from "react";
import { useBoard } from "../context/BoardContext";

const AddTaskButton = () => {
    const { columns, addTask } = useBoard();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        columnId: columns[0].id,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newTask.title.trim()) return;

        const taskToAdd = {
            id: `t${Date.now()}`,
            title: newTask.title,
            description: newTask.description,
        };

        addTask(newTask.columnId, taskToAdd);

        setNewTask({
            title: "",
            description: "",
            columnId: columns[0].id,
        });
        setIsModalOpen(false);
    };

    return (
        <>
            <button className="add-task-button" onClick={() => setIsModalOpen(true)}>
                <span>Add Task</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1V15M1 8H15" stroke="#F7FAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-new">
                        <button className="close-icon-button" onClick={() => setIsModalOpen(false)}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L11 11M1 11L11 1" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="modal-content">
                            <h2 className="modal-title">Create New Task</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label className="input-label">Title</label>
                                    <div className="input-container">
                                        <input type="text" name="title" value={newTask.title} onChange={handleChange} placeholder="" className="input-field" required />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Description</label>
                                    <div className="input-container textarea-container">
                                        <textarea name="description" value={newTask.description} onChange={handleChange} placeholder="" className="input-field textarea-field" rows="4" />
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="submit" className="submit-button">
                                        <span>Add Task</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddTaskButton;
