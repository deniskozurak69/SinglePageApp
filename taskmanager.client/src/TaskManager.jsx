import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '' });
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({ title: '', description: '', completed: false, deadline: '' });
    const [filter, setFilter] = useState({ dateA: '', dateB: '' });

    useEffect(() => {
        axios.get('/api/task')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }, []);

    const createTask = () => {
        axios.post('/api/task', newTask)
            .then(response => {
                setTasks([...tasks, response.data]);
                setNewTask({ title: '', description: '', deadline: '' });
            });
    };

    const updateTask = (task) => {
        axios.put(`/api/task/${task.id}`, task)
            .then(() => {
                setTasks(tasks.map(t => t.id === task.id ? task : t));
                setEditingTaskId(null);
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    };

    const deleteTask = (id) => {
        axios.delete(`/api/task/${id}`)
            .then(() => {
                setTasks(tasks.filter(t => t.id !== id));
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    };

    const handleEditClick = (task) => {
        setEditingTaskId(task.id);
        setEditedTask({
            title: task.title,
            description: task.description,
            completed: task.completed,
            deadline: task.deadline,
        });
    };

    const handleSaveClick = () => {
        updateTask({ ...editedTask, id: editingTaskId });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask({
            ...editedTask,
            [name]: name === "completed" ? e.target.checked : value,
        });
    };

    const filteredTasks = tasks.filter(task => {
        const taskDeadline = new Date(task.deadline);
        const dateA = filter.dateA ? new Date(filter.dateA) : null;
        const dateB = filter.dateB ? new Date(filter.dateB) : null;
        return (!dateA || taskDeadline >= dateA) && (!dateB || taskDeadline <= dateB);
    });

    return (
        <div>
            <div className="filter">
                <input
                    type="date"
                    placeholder="Date A"
                    value={filter.dateA}
                    onChange={e => setFilter({ ...filter, dateA: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Date B"
                    value={filter.dateB}
                    onChange={e => setFilter({ ...filter, dateB: e.target.value })}
                />
                <button onClick={() => setFilter({ dateA: '', dateB: '' })}>Reset Filter</button>
            </div>
            <h1>Task Manager</h1>
            <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
                type="date"
                placeholder="Deadline"
                value={newTask.deadline}
                onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
            />
            <button onClick={createTask}>Create Task</button>

            <ul>
                {filteredTasks.map(task => (
                    <li key={task.id} className="task-item">
                        {editingTaskId === task.id ? (
                            <>
                                <input
                                    type="text"
                                    name="title"
                                    value={editedTask.title}
                                    onChange={handleInputChange}
                                    placeholder="Title"
                                />
                                <input
                                    type="text"
                                    name="description"
                                    value={editedTask.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                />
                                <input
                                    type="date"
                                    name="deadline"
                                    value={editedTask.deadline}
                                    onChange={handleInputChange}
                                />
                                <label>
                                    Completed:
                                    <input
                                        type="checkbox"
                                        name="completed"
                                        checked={editedTask.completed}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <button onClick={handleSaveClick}>Save</button>
                            </>
                        ) : (
                            <>
                                <span className="task-title">{task.title}</span>
                                <span className="task-description">{task.description}</span>
                                <span className="task-deadline">{task.deadline}</span>
                                <span className="task-status">
                                    {task.completed ? 'completed' : 'uncompleted'}
                                </span>
                                <button onClick={() => handleEditClick(task)}>Update</button>
                                <button onClick={() => deleteTask(task.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;