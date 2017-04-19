var fs = require('fs')


var todoFilePath = 'db/todo.json'


// 存储 todo 数据的对象
const ModelTodo = function(form) {
    this.content = form.content || ''
    this.done = form.done || false
    this.created_time = Math.floor(new Date() / 1000)
}

const loadTodos = function() {
    var content = fs.readFileSync(todoFilePath, 'utf8')
    var todos = JSON.parse(content)
    return todos
}

var b = {
    data: loadTodos()
}

b.all = function() {
    var todos = this.data
    return todos
}

b.new = function(form) {
    var m = new ModelTodo(form)

    var d = this.data[this.data.length-1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    this.data.push(m)
    this.save()
    return m
}

/*
删除指定 id 的数据
*/
b.delete = function(id) {
    var todos = this.data
    var found = false
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        if (todo.id == id) {
            found = true
            break
        }
    }
    // 用 splice 函数删除数组中的一个元素
    // 如果没找到, i 的值就是无用值, 删除也不会报错
    // 所以不用判断也可以
    todos.splice(i, 1)
    this.save()
    return found
}

b.toggleDone = function(id, done) {
    var todos = this.data
    var found = false
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        if (todo.id == id) {
            todos[i].done = done
        }
    }
    this.save()
    return done
}

b.save = function() {
    var s = JSON.stringify(this.data, null, 2)
    fs.writeFile(todoFilePath, s, (err) => {
      if (err) {
          console.log(err)
      } else {
          console.log('保存成功')
      }
    })
}

module.exports = b
