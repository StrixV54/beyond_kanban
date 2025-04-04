import React, { useState, useEffect } from "react";
import { useBoard } from "../context/BoardContext";

const EditTaskModal = () => {
    const { editingTask, closeEditModal, editTask } = useBoard();
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
    });

    // Update form when editingTask changes
    useEffect(() => {
        if (editingTask) {
            setTaskData({
                title: editingTask.title,
                description: editingTask.description,
            });
        }
    }, [editingTask]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!taskData.title.trim()) return;

        editTask(editingTask.id, editingTask.columnId, {
            title: taskData.title,
            description: taskData.description,
        });

        closeEditModal();
    };

    if (!editingTask) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-new">
                <button className="close-icon-button" onClick={closeEditModal}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L11 11M1 11L11 1" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="modal-content">
                    <h2 className="modal-title">Edit Task</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Title</label>
                            <div className="input-container">
                                <input type="text" name="title" value={taskData.title} onChange={handleChange} placeholder="Task title" className="input-field" required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Description</label>
                            <div className="input-container textarea-container">
                                <textarea name="description" value={taskData.description} onChange={handleChange} placeholder="Task description" className="input-field textarea-field" rows="4" />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="submit-button">
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
