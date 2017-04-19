const todo = require('../model/todo')


var all = {
    path: '/api/todo/all',
    method: 'get',
    func: function(request, response) {
        var todos = todo.all()
        var r = JSON.stringify(todos)
        response.send(r)
    }
}

var add = {
    path: '/api/todo/add',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        var b = todo.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

var deleteTodo = {
    path: '/api/todo/delete',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        var success = todo.delete(form.id)
        var result = {
            success: success,
        }
        var r = JSON.stringify(result)
        response.send(r)
    }
}


var toggleDone = {
    path: '/api/todo/toggleDone',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        var success = todo.toggleDone(form.id, form.done)
        var result = {
            success: success,
        }
        var r = JSON.stringify(result)
        response.send(r)
    }
}

var routes = [
    all,
    add,
    deleteTodo,
    toggleDone,
]

module.exports.routes = routes
