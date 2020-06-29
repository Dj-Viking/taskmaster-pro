var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//** STARTING THE EDIT-TASKS FEATURE ******/
//checking to see if our click event is targeting the element we want
$(".list-group").on("click", "p", function(){
  console.log("<p> was clicked");
  //this refers to the object that the event is targeting its local to this function
  //its native JavaScript syntax
  console.log(this);
  //here we are using jquery syntax to store the textContent of object <p> 
  //into a new variable as just the text content contained within <p>
  var pText = $(this)
    .text()
    .trim();
  console.log("displaying textContent of <p>");
  console.log(pText);
  
  //assigning a new variable with the value of the textContent extracted
  //from the jquery object we created out of $(this) which refers to <p> textContent
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(pText);

  //replacing the <p> element with the <textarea> element
  $(this).replaceWith(textInput);
  console.log("<p> got converted into <textarea> by clicking it!!!");

  //when the <textarea> is clicked bring it into focus
  textInput.trigger("focus");
});

//this event will handle saving the edits after clicking and typing
//  which begins when user interacts
//  with anything other than the <textarea> element
//  * we need current value of the element, 
//  * the parent element's ID, 
//  * and the elements position in the list.
$(".list-group").on("blur", "textarea", function(){
  
  //get textarea's current value/text
  var text = $(this)
    .val()
    .trim();

  //get parent <ul>'s id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")//returns the ID which is replaced with "list-", followed by the category
    .replace("list-", "");//using this to find and replace text in a string, we can chain jquery and javascript operators together if we want to

  //get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  //using this method solely to save depending on whichever task the user
  //edits we can edit and save any which one they choose instead of having to
  //manually edit the code each time they choose to edit a task
  //* tasks is an empty object
  //* tasks[status] returns an array (in this case the array toDo)
  //* tasks[status][index] returns the object at the given index in the array
  //* tasks[status][index].text returns the property of the object at the given index.
  tasks[status][index].text = text;
  saveTasks();

  //still need to convert back to <p> from <textarea> which is 
  //now saving to storage after clicking out of the <textarea>
  var taskP = $("p")
    .addClass("m-1")
    .text(text);

  //replace <textarea> with <p> element
  $(this).replaceWith(taskP);//clicking out of the textarea to save the task makes some elements get deleted some how
});


// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


