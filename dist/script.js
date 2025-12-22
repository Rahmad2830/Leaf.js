Leaf.defineStore("yahaha", () => {
  const [name, setName] = Leaf.signal("Rahmat")
  
  return { name }
})

Leaf.defineScope("counter", ({ $stores }) => {
  console.log($stores.yahaha.name())
  const [todos, setTodos] = Leaf.signal([])
  const [todo, setTodo] = Leaf.signal("")
  const [name, setName] = Leaf.signal("")
  const [show, setShow] = Leaf.signal("two")
  const [open, setOpen] = Leaf.signal(false)
  const route = window.location.pathname
  
  const haha = () => route === "/leaf/dist/index.html"
  
  console.log(haha())
  
  function init() {
    console.log("hello")
  }
  
  function toggle() {
    setOpen(!open())
  }
  
  let id = 0
  function add() {
    if(todo() === "") {
      alert("kosong")
      return
    }
    setTodos([...todos(), { id: id++, text: todo() }])
    setTodo("")
  }
  
  function remove(id) {
    setTodos(todos().filter(item => item.id !== id))
  }
  
  function setActive(name) {
    setShow(name)
  }
  
  const satu = () => show() === "one"
  const dua = () => show() === "two"
  const tiga = () => show() === "three"
  
  return { remove, todos, todo, setTodo, add, show, setActive, satu, dua, tiga, init, toggle, open, haha, name, setName}
})