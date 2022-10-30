let NUMBER = 13; //число отрисовываемых задач 
let count = 2;  //start id creating todo

//получение и отрисовка списка задач
// async function getListTasks() {
//   let result = await fetch('https://jsonplaceholder.typicode.com/todos');

// }

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
          id: 6,
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
  x.onclick = async function () {
    if (await deleteTask(newTaskJson) === {}) {      //запрос на удаление, если успешно - удаление, если нет - вывод ошибки
      console.log('DELETED');
      el.removeChild(icon);
      el.removeChild(x);
      list.removeChild(el);
    } else console.log('ERROR! Task don`t deleted!');
  }

  const el = document.createElement("li");
  el.innerText = newTaskJson.title + ' by ' + newTaskJson.user;
  //el.className = 'todo-item';
  el.appendChild(x);
  el.appendChild(icon);


  const list = document.getElementById('todo-list');
  list.appendChild(el);
  count +=1;
}

//запрос на изменение статуса задачи
async function checkBox(TaskJson) {
  let response = await fetch('https://jsonplaceholder.typicode.com/todos/'+count, {
  method: 'PUT',
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
  if (result.completed === true) {
    return result;
  } 
}


async function deleteTask(TaskJson) {
  let response = await fetch('https://jsonplaceholder.typicode.com/todos/'+count, {
    method: 'DELETE',
    // body: JSON.stringify({
    //   userId: TaskJson.userId,
    //   id: TaskJson.id,
    //   title: TaskJson.title,
    //   completed: TaskJson.completed,
    // }),
    // headers: {
    //   'Content-type': 'application/json; charset=UTF-8',
    // },
  });

  let result = await response.json();
  console.log(result);
  if (Object.entries(result) === 0) {
    console.log('TRY');
    return result;
  } else return 0;

}

showListUser();
makeRequest();