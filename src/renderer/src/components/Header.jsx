import React, { useState, useEffect } from 'react'
import Todo from './Todo'

const Header = () => {
  const [todos, setTodos] = useState([]) // Initial state
  const [showInput, setShowInput] = useState(false)
  const [newListName, setNewListName] = useState('')

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await window.electron.ipcRenderer.invoke('getSettingValue', 'todos')
        console.log('Loaded todos:', savedTodos) // Add this line
        setTodos(savedTodos)
      } catch (error) {
        console.error('Error loading todos:', error)
      }
    }
    loadTodos()
  }, [])

  useEffect(() => {
    const saveTodos = async () => {
      try {
        console.log('Saving todos:', todos) // Add this line
        await window.electron.ipcRenderer.invoke('setSettingValue', 'todos', todos)
      } catch (error) {
        console.error('Error saving todos:', error)
      }
    }
    saveTodos()
  }, [todos])

  const addNewList = () => {
    if (newListName.trim() !== '') {
      setTodos([...todos, { name: newListName, tasks: [] }])
      setNewListName('')
      setShowInput(false)
    }
  }

  const updateTasks = (index, tasks) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo, i) => {
        if (i === index) {
          return { ...todo, tasks: tasks }
        } else {
          return todo
        }
      })
    )
  }

  return (
    <div>
      {todos.map((todoList, index) => (
        <div key={index}>
          <h2>{todoList.name}</h2>
          <Todo id={index} tasks={todoList.tasks || []} updateTasks={updateTasks} />
        </div>
      ))}
      {showInput && (
        <div>
          <input type="text" value={newListName} onChange={(e) => setNewListName(e.target.value)} />
          <button onClick={addNewList}>Confirm</button>
        </div>
      )}
      <button onClick={() => setShowInput(true)}>Add new list</button>
    </div>
  )
}

export default Header
