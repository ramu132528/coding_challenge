import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskPage.css'; 

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'LOW',
    status: 'PENDING'
  });

  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState({});

  const [searchId, setSearchId] = useState('');
  const [searchedTask, setSearchedTask] = useState(null);
  const [searchError, setSearchError] = useState('');

  const BASE_URL = "http://localhost:8080/api/tasks";

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchId.trim() === '') {
      setSearchedTask(null);
      setSearchError('');
    }
  }, [searchId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchTaskById = async () => {
    if (!searchId.trim()) return;

    try {
      const res = await axios.get(`${BASE_URL}/${searchId}`);
      setSearchedTask(res.data);
      setSearchError('');
    } catch (err) {
      setSearchedTask(null);
      setSearchError('Task not found for ID: ' + searchId);
    }
  };

  const handleAddChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      await axios.post(BASE_URL, newTask, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'LOW',
        status: 'PENDING'
      });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Check backend API or CORS settings.");
    }
  };

  const deleteTask = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditTaskId(task.taskId);
    setEditTask({ ...task });
  };

  const updateTask = async () => {
    await axios.put(`${BASE_URL}/${editTaskId}`, editTask);
    setEditTaskId(null);
    setEditTask({});
    fetchTasks();
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'secondary';
      case 'IN_PROGRESS': return 'primary';
      case 'COMPLETED': return 'success';
      default: return 'dark';
    }
  };

  const displayedTasks = showAll ? tasks : tasks.slice(0, 3);

  return (
    <div className="task-page">
      <div className="container">
        <h1 className="mb-4 text-center">✨ Task Manager ✨</h1>

        {/* Search Task */}
        <div className="card shadow mb-4 p-4">
          <h4 className="mb-3">🔍 Search Task by ID</h4>
          <div className="input-group mb-2">
            <input
              type="number"
              placeholder="Enter Task ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-info" onClick={fetchTaskById}>Search</button>
          </div>
          {searchedTask && (
            <div className="card p-3 mt-2">
              <h5>{searchedTask.title}</h5>
              <p>{searchedTask.description}</p>
              <p><strong>Due:</strong> {searchedTask.dueDate}</p>
              <span className={`badge bg-${getPriorityBadge(searchedTask.priority)} me-2`}>
                {searchedTask.priority}
              </span>
              <span className={`badge bg-${getStatusBadge(searchedTask.status)}`}>
                {searchedTask.status}
              </span>
            </div>
          )}
          {searchError && (
            <div className="text-danger">{searchError}</div>
          )}
        </div>

        {/* Add New Task */}
        <div className="card shadow mb-5 p-4">
          <h4 className="mb-3">➕ Add New Task</h4>
          <div className="row g-2">
            <div className="col-md-3">
              <input
                name="title"
                placeholder="Title"
                className="form-control"
                value={newTask.title}
                onChange={handleAddChange}
              />
            </div>
            <div className="col-md-3">
              <input
                name="description"
                placeholder="Description"
                className="form-control"
                value={newTask.description}
                onChange={handleAddChange}
              />
            </div>
            <div className="col-md-2">
              <input
                name="dueDate"
                type="date"
                className="form-control"
                value={newTask.dueDate}
                onChange={handleAddChange}
              />
            </div>
            <div className="col-md-2">
              <select
                name="priority"
                className="form-select"
                value={newTask.priority}
                onChange={handleAddChange}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                name="status"
                className="form-select"
                value={newTask.status}
                onChange={handleAddChange}
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
          <button className="btn btn-success mt-3" onClick={addTask}>✅ Add Task</button>
        </div>

        {/* Task List */}
        <h4 className="mb-3">📋 Tasks</h4>
        <div className="mb-4">
          <button className="btn btn-primary" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less Tasks' : 'Show All Tasks'}
          </button>
        </div>

        {displayedTasks.length === 0 && (
          <div className="text-center">🚫 No tasks found. Add one above!</div>
        )}

        <div className="row">
          {displayedTasks.map(task => (
            <div className="col-md-6 mb-4" key={task.taskId}>
              <div className="card bg-light text-dark shadow-sm border-0">
                <div className="card-body">
                  {editTaskId === task.taskId ? (
                    <>
                      <input
                        name="title"
                        className="form-control mb-2"
                        value={editTask.title}
                        onChange={handleEditChange}
                      />
                      <textarea
                        name="description"
                        className="form-control mb-2"
                        value={editTask.description}
                        onChange={handleEditChange}
                      />
                      <input
                        name="dueDate"
                        type="date"
                        className="form-control mb-2"
                        value={editTask.dueDate}
                        onChange={handleEditChange}
                      />
                      <select
                        name="priority"
                        className="form-select mb-2"
                        value={editTask.priority}
                        onChange={handleEditChange}
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                      <select
                        name="status"
                        className="form-select mb-2"
                        value={editTask.status}
                        onChange={handleEditChange}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                      <button className="btn btn-success btn-sm me-2" onClick={updateTask}>💾 Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditTaskId(null)}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      <h5>{task.title}</h5>
                      <p>{task.description}</p>
                      <p><strong>Due:</strong> {task.dueDate}</p>
                      <span className={`badge bg-${getPriorityBadge(task.priority)} me-2`}>
                        {task.priority}
                      </span>
                      <span className={`badge bg-${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                      <div className="mt-3">
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEdit(task)}>✏️ Edit</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteTask(task.taskId)}>🗑️ Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
