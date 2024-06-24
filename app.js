var coursesApi = 'http://localhost:3000/courses'
function start(){
    getCoursesApi()
    handleCreateBtn()
}
start();

//getCoursesApi
function getCoursesApi(){
    fetch(coursesApi)
        .then(function(response){
            return response.json();
        })
        .then(courses => {
            renderCourses(courses);
        })
}
//renderCourses
function renderCourses(list){
    //render list courses to Element
    var courseElement = document.querySelector('#list-courses') 
    //list is array
    var data = list.map(function(course){
        return `    
            <li class = "course-item-${course.id}"> 
                <h4 class = "name-${course.id}">${course.name}</h4>
                <p class = "description-${course.id}" >${course.description}</p>
                <button onclick="handleDeleteCourse('${course.id}')">Xóa</button>
                <button onclick="handleUpdateCourse('${course.id}')">Update</button>
            </li>
            `;
        
    });
    courseElement.innerHTML = data.join('');

}
//handle create button
function handleCreateBtn(){
    var createBtn = document.querySelector('#create');
    createBtn.onclick = function(){
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        var formValue = {
            name,
            description
        }
        if(name && description){
            createCourse(formValue, function(){
                getCoursesApi();
                // xoa value trong input
                document.querySelector('input[name="name"]').value = ''; 
                document.querySelector('input[name="description"]').value = '';
    
            })
        }
        else{
            alert('Please input the content')
        }
    }
}

//create course
function createCourse(data, callback){
    var options = {
        method : "POST",
        headers: {
            'Content-Type':'application/json'
        },
        body : JSON.stringify(data)
    }
    fetch(coursesApi, options)
        .then(function(response){
            response.json();
        })
        .then(callback)
}
//function handleDeleteCourse
function handleDeleteCourse(id){
    var options = {
        method : "DELETE",
        headers: {
            'Content-Type':'application/json'
        }
    }
    console.log(coursesApi + '/' + id);
    //handleDeleteCourse
    fetch(coursesApi + '/' + id, options)
        .then(function (response){
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(){
            var deleteElement = document.querySelector('.course-item-' + id);
            if(deleteElement){
                deleteElement.remove();
            }
        })
        .catch(function(error) {
            console.error('Error deleting course:', error);
        });
}
//function handleUpdateCourse
function handleUpdateCourse(id){
    //lay du lieu cua id voi 
    // console.log(id); 
    // lay value cua name , description
    var textName = document.querySelector('.name-' + id).innerHTML;
    var textDes = document.querySelector('.description-' + id).innerHTML;
    //dua du lieu vao formData input 
    var inputName = document.querySelector('input[name="name"]');
    var inputDes = document.querySelector('input[name="description"]');
    //gan du lieu vao input va doi create -> update
    inputName.value = textName;
    inputDes.value = textDes;
    document.querySelector('#create').innerHTML = 'Update'

    var new_inputName = document.querySelector('input[name="name"]');
    var new_inputDes = document.querySelector('input[name="description"]');
    
    //updateBtn function
    var updateBtn = document.querySelector('#create');
    updateBtn.onclick = function(){
        var formValue = {
            id : id,
            name : new_inputName.value,
            description : new_inputDes.value
        }
        //update 
        updateCourse(id, formValue, function(){
            getCoursesApi();
            // xoa value trong input
            document.querySelector('input[name="name"]').value = ''; 
            document.querySelector('input[name="description"]').value = '';
            //doi text update -> create
            document.querySelector('#create').innerHTML = 'Create'

        })
    }
}
function updateCourse(id, course, callback){

    var options = {
        method : "PUT",
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(course)
    }
    fetch(coursesApi + '/' + id, options)
        .then(function(response){
            return response.json();
        })
        .then(callback)
}