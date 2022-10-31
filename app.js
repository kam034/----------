//import {random} from './lodash';

const app = {
  NUMBER: 13, //число отрисовываемых задач
  count: 200, //счетчик для собственный задач  
}



//получение и отрисовка списка задач
async function getListTasks() {
  try {
    let request = await fetch('https://jsonplaceholder.typicode.com/todos');
    let result = await request.json();
    for (let p=0; p < app.NUMBER; p++) {
      result[p].user = 'Ervin Howell';
      console.log(result[p]);
      rendering(result[p]);
    }
  }
  catch (error) {
    alert('List of tasks don`t loaded!');
  }
}


//запрос списка юзеров и отрисовка их на страницу
function showListUser() {     
  let users = document.getElementById('user-todo');
  fetch('https://jsonplaceholder.typicode.com/users')
  .then(function(result) {
    return result.json();
  })
  .then(function(usersJson) {
    usersJson.forEach(element => {
      let el = document.createElement('option');
      el.innerText = element.name;
      users.appendChild(el);
    });
  })
}

//запрос на добавление todo
function makeRequest() {      
  let input = document.querySelector('input');
  const button = document.querySelector('button');
  let select = document.querySelector('select');
  button.onclick = function () {
    if (input.value !== '' && select.value !== 'select user') {
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          userId: 1,
          id: app.count,
          title: input.value,
          complited: false,
          user: select.value
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(function (result) {
        return result.json();
      })
      .then(function (newTaskJson) {
        console.log('ID', newTaskJson.id)
        input.value = '';
        select.value = 'select user';
        rendering(newTaskJson);            //отрисовываем страницу, если пришел ответ с сервера
      })
      .catch(function(error) {
        alert('Task not added!')            //если нет, выдаем ошибку
      })
    }
  }
}

//отрисовка страницы после добавления новой задачи
function rendering(newTaskJson) {    
  const icon = document.createElement("i");
  icon.innerText = 'check_box_outline_blank';
  icon.className = 'material-icons';
  icon.style.float = 'left';
  icon.style.marginRight = '10px';
  icon.style.color = 'blue';
  icon.onclick = async function () {    //обработчик на клик - запрос на изменение статуса
    let request = await checkBox(newTaskJson);
    console.log(request)
    if (request.completed===true) {
      icon.innerText = 'check_box'; 
      icon.style.color = 'blue';
    } else console.log('ERROR! Status don`t changed!');
  } 

  const x = document.createElement("div")
  x.className = 'material-icons';
  x.innerText = 'close';
  x.style.float = 'right';
  x.style.color = 'red'; 
  x.onclick = async function () {   //запрос на удаление, если успешно - удаление, если нет - вывод ошибки
    let request = await deleteTask(newTaskJson);
    if (isEmpty(request)) {      
      el.removeChild(icon);
      el.removeChild(x);
      list.removeChild(el);
    } else if (request === 0) console.log('ERROR! Task don`t deleted!');
  }

  const text = document.createElement("p");
  text.innerText = newTaskJson.title + ' by ' + newTaskJson.user;
  text.style.marginLeft = '34px';
  text.style.maxWidth = '430px'

  const el = document.createElement("li"); 
  el.appendChild(icon);
  el.appendChild(x);
  //el.className = 'todo-item';
  el.appendChild(text);
  
  

  const list = document.getElementById('todo-list');
  list.prepend(el);
  app.count++;
}

//запрос на изменение статуса задачи
async function checkBox(TaskJson) {
  let response = await fetch('https://jsonplaceholder.typicode.com/todos/'+TaskJson.id, {
  method: 'PATCH',
  body: JSON.stringify({
    userId: TaskJson.userId,
    id: TaskJson.id,
    title: TaskJson.title,
    completed: true,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
  });

  let result = await response.json();
  console.log(response);
  if (result.completed === true) {
    return result;
  } 
}

//запрос на удаление задачи
async function deleteTask(TaskJson) {
  let response = await fetch('https://jsonplaceholder.typicode.com/todos/'+TaskJson.id, {
    method: 'DELETE',
  });

  let result = await response.json();
  if (isEmpty(result)) {
    return result;
  } else return 0;
}

//проверка на пустоту объекта
function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}

showListUser();
getListTasks();
makeRequest();