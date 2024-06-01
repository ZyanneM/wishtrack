import { useState, useEffect } from 'react';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await window.electron.ipcRenderer.invoke('getSettingValue', 'tasks') || [];
        setTasks(savedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await window.electron.ipcRenderer.invoke('setSettingValue', 'tasks', tasks);
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const deleteTask = (indexToDelete) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete));
  };

  const toggleTaskCompletion = (indexToToggle) => {
    setTasks(
      tasks.map((task, index) => 
        index === indexToToggle ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div>
      <h1>Liste des tâches</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Ajouter une nouvelle tâche"
      />
      <button onClick={addTask}>Ajouter une tâche</button>
      <div>
        {tasks.length === 0 ? (
          <p>Aucune tâche à afficher</p>
        ) : (
          <ul>
            {tasks.map((task, index) => (
              <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(index)}
                />
                {task.text}
                <button onClick={() => deleteTask(index)}>Supprimer</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Todo;
