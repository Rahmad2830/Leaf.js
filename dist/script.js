Leaf.defineStore("yahaha", () => {
  const [name, setName] = Leaf.signal("Rahmat")
  
  return { name }
})

Leaf.defineScope("counter", ({ $stores }) => {
  console.log($stores.yahaha.name())
  const [todos, setTodos] = Leaf.signal([])
  const [todo, setTodo] = Leaf.signal("")
  const [show, setShow] = Leaf.signal("one")
  const [open, setOpen] = Leaf.signal(false)
  
  function init() {
    console.log("hello")
  }
  
  function toggle() {
    setOpen(!open())
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
  
  return { remove, todos, todo, setTodo, add, show, setActive, satu, dua, tiga, init, toggle, open }
})