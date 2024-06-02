import React, { useState } from 'react'

const Todo = ({ id, tasks: initialTasks, updateTasks }) => {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim() !== '') {
      const updatedTasks = [...tasks, { text: newTask, completed: false }];
      setTasks(updatedTasks);
      updateTasks(id, updatedTasks); // Pass updatedTasks here
      setNewTask('');
    }
  };

  const deleteTask = (indexToDelete) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete)
    setTasks(updatedTasks)
    updateTasks(updatedTasks)
  }

  const toggleTaskCompletion = (indexToToggle) => {
    const updatedTasks = tasks.map((task, index) =>
      index === indexToToggle ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    updateTasks(updatedTasks)
  }

  return (
    <div>
      {tasks.map((task, index) => (
        <div key={index}>
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.text}
          </span>
          <button onClick={() => toggleTaskCompletion(index)}>Toggle completion</button>
          <button onClick={() => deleteTask(index)}>Delete task</button>
        </div>
      ))}
      <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
      <button onClick={addTask}>Add task</button>
    </div>
  )
}

export default Todo
