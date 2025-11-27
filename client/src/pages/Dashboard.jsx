import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, completed

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const { data } = await api.post('/tasks', {
                title: newTask,
                status: 'pending'
            });
            setTasks([...tasks, data]);
            setNewTask('');
            toast.success('Task added');
        } catch (error) {
            toast.error('Failed to add task');
        }
    };

    const updateTask = async (id, updates) => {
        try {
            const { data } = await api.put(`/tasks/${id}`, updates);
            setTasks(tasks.map(task => task._id === id ? data : task));
            if (editingTask && editingTask._id === id) {
                setEditingTask(null);
            }
            toast.success('Task updated');
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.status === 'completed';
        if (filter === 'pending') return task.status === 'pending' || task.status === 'in-progress';
        return true;
    });

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">My Tasks</h1>

            {/* Add Task Form */}
            <form onSubmit={addTask} className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                    type="text"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base font-medium"
                >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Add Task</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
                <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-full font-medium transition-colors ${
                        filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-full font-medium transition-colors ${
                        filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-full font-medium transition-colors ${
                        filter === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            {/* Task List */}
            <div className="space-y-3 sm:space-y-4">
                {filteredTasks.map(task => (
                    <div key={task._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 group hover:shadow-md transition-shadow">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                            <button
                                onClick={() => updateTask(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                                className={`flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors ${
                                    task.status === 'completed' ? 'text-green-500' : ''
                                }`}
                                title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                            >
                                {task.status === 'completed' ? (
                                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                ) : (
                                    <Circle className="w-5 h-5 sm:w-6 sm:h-6" />
                                )}
                            </button>

                            {editingTask?._id === task._id ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updateTask(task._id, { title: editingTask.title });
                                    }}
                                    className="flex-1 flex gap-2"
                                >
                                    <input
                                        type="text"
                                        value={editingTask.title}
                                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                        className="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none"
                                        autoFocus
                                    />
                                    <button type="submit" className="text-green-600 text-xs sm:text-sm font-medium hover:text-green-700">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingTask(null)}
                                        className="text-gray-500 text-xs sm:text-sm font-medium hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <span
                                    className={`text-sm sm:text-base break-words ${
                                        task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'
                                    }`}
                                >
                                    {task.title}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                                onClick={() => setEditingTask(task)}
                                className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Edit task"
                            >
                                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={() => deleteTask(task._id)}
                                className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete task"
                            >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredTasks.length === 0 && (
                    <div className="text-center py-10 sm:py-16 text-gray-500">
                        <p className="text-base sm:text-lg">No tasks found. Start by adding one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
