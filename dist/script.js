Leaf.defineScope("counter", () => {
  const [todos, setTodos] = Leaf.signal([])
  const [todo, setTodo] = Leaf.signal("")
  const [show, setShow] = Leaf.signal("one")
  
  function init() {
    console.log("hello")
  }
  
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
  
  function setActive(name) {
    setShow(name)
  }
  
  const satu = () => show() === "one"
  const dua = () => show() === "two"
  const tiga = () => show() === "three"
  
  return { remove, todos, todo, setTodo, add, show, setActive, satu, dua, tiga, init }
})