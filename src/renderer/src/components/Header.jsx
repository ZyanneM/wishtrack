import React, { useState, useEffect } from 'react'
import Todo from './Todo'

const Header = () => {
  const [todos, setTodos] = useState([]) // Initial state
  const [showInput, setShowInput] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [activeListIndex, setActiveListIndex] = useState(null) // New state

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

  const toggleActive = (index) => {
    setActiveListIndex((prevIndex) => (prevIndex === index ? null : index))
  }

  return (
    <div>
        <div className='list-container'>
      {todos.map((todoList, index) => (
        <div key={index}>
          <div className='list-btn'
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '50px',
              border: '1px solid',
              cursor: 'pointer'
            }}
            onClick={() => toggleActive(index)}
          >
            {todoList.name}
          </div>
          <div className={index === activeListIndex ? 'active' : 'inactive'}>
            <Todo id={index} tasks={todoList.tasks || []} updateTasks={updateTasks} />
          </div>
        </div>
      ))}
      {showInput && (
        <div>
          <input type="text" value={newListName} onChange={(e) => setNewListName(e.target.value)} />
          <button onClick={addNewList}>Confirm</button>
        </div>
      )}
      </div>
      <button onClick={() => setShowInput(true)}>Add new list</button>
    </div>
  )
}

export default Header
