var log = console.log.bind(console)

var e = function(selector) {
    return document.querySelector(selector)
}

var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if(r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

const toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

const removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

var todoTemplate = function(todo) {
    var content = todo.content
    var id = todo.id
    var done = todo.done
    var status = ''
    var describe = '未完成'
    var d = new Date(todo.created_time * 1000)
    var time = d.toLocaleString()
    var doneButton = '完成'
    if (done) {
        status = 'done'
        describe = '完成'
        doneButton = '未完成'
    }
    var t = `
            <div class="todos ${status}" data-id=${id}>
                <span class="todo_content">${content}</span>
                <span class="state">${describe}</span>
                <div class="control_buttons">
                    <button class="button_done" type="button">${doneButton}</button>
                    <button class="button_delete" type="button">删除</button>
                </div>
            </div>
        `
    return t
}

var insertTodoAll = function(todos) {
    var html = ''
    for (var i = 0; i < todos.length; i++) {
        var b = todos[i]
        log('todos', b)
        var t = todoTemplate(b)
        html += t
    }
    var div = document.querySelector('.container')
    div.innerHTML = html
}

var todoAll = function() {
    var request = {
        method: 'GET',
        url: '/api/todo/all',
        contentType: 'application/json',
        callback: function(response) {
            console.log('todoAll响应', response)
            var todos = JSON.parse(response)
            window.todos = todos
            insertTodoAll(todos)
        }
    }
    ajax(request)
}

var todoNew = function(form) {
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/todo/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var res = JSON.parse(response)
        }
    }
    ajax(request)
}

var todoDelete = function(form) {
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/todo/delete',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var res = JSON.parse(response)
        }
    }
    ajax(request)
}

var todoToggleDone = function(form) {
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/todo/toggleDone',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var res = JSON.parse(response)
        }
    }
    ajax(request)
}

// 绑定完成删除事件的按钮
var bindEventOperate = function() {
    var all = document.querySelector('.all')
    all.addEventListener('click', function(event) {
        var target = event.target
        if (target.classList.contains('button_delete')) {
            //如果是删除按钮
            // closest()方法，往上层节点找到第一个包含参数（元素选择器）的节点
            var p = target.closest('.todos')

            var id = p.dataset.id
            var form = {
                id,
            }
            todoDelete(form)
            todoAll()

        } else if (target.classList.contains('button_done')) {
            //如果是完成按钮
            var p = target.closest('.todos')
            //切换一个 class
            toggleClass(p, 'done')
            var done = false
            var state = p.querySelector('.state')
            //改变完成状态描述
            if (state.innerText == '未完成') {
                state.innerText = '完成'
                done = true
                target.innerText = '未完成'
            } else {
                state.innerText = '未完成'
                target.innerText = '完成'
            }
            var id = p.dataset.id
            var form = {
                id,
                done
            }
            todoToggleDone(form)
        }

    })
}


// 绑定添加新事项得按钮
var bindEventAdd = function() {
    var button = e('.button_addtodo')
    button.addEventListener('click', function(event){
        console.log('click new')
        // 得到用户填写的数据
        var form = {
            content: e('.new_todo_input').value,
        }
        if(form.content == '') {
            swal(
                '提示',
                '输入内容不能为空',
                'error'
            )
        } else {
            todoNew(form)
            swal(
                '提示',
                '发表成功',
                'success'
            )
            e('.new_todo_input').value = ''
        }
        todoAll()
    })
}

var bindEvents = function() {
    bindEventAdd()
    bindEventOperate()
}

var __main = function() {
    todoAll()
    bindEvents()
}

__main()
