defineScope("counter", () => {
  const [todos, setTodos] = signal(["andei"])
  const [todo, setTodo] = signal("")
  
  function add() {
    if(todo() === "") {
      alert("kosong")
      return
    }
    setTodos([...todos(), todo()])
    setTodo("")
  }
  
  function remove(id) {
    setTodos(todos().filter((_, i) => i !== id))
  }
  
  return {
    remove,
    todos,
    todo,
    setTodo,
    add
  }
})