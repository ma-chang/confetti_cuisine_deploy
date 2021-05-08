$(document).ready(()=> {
  const socket = io();

  $("#chatForm").submit(() => {
    let text = $("#chat-input").val();
    let userId = $("#chat-user-id").val();
    let userName = $("#chat-user-name").val();
    socket.emit("message", {
      content: text,
      userId: userId,
      userName: userName
    });
    $("#chat-input").val("");
    return false;
  });

  socket.on("message", message => {
    displayMessage(message);
    console.log("displayMessage1");
  });

  socket.on("load all messages", data => {
    data.forEach(message => {
      displayMessage(message);
    });
    console.log("displayMessage2");
  });

  socket.on("message", message => {
    displayMessage(message);
    for (let i = 0; i < 2; i++) {
      $(".chat-icon")
        .fadeOut(200)
        .fadeIn(200);
    }
  });

  let displayMessage = message => {
    console.log("displayMessage work");
    $("#chat").prepend(
      $("<li>").html(`
        <div class='message ${getCurrentUserClass(message.user)}'>
        <span class="user-name">
          ${message.userName}:
        </span>
          ${message.content}
        </div>
      `)
    );
    console.log("message sent");
  };

  let getCurrentUserClass = id => {
    let userId = $("#chat-user-id").val();
    if (userId === id) return "current-user";
    else return "";
  }


  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get(`/api/courses`, (results = {}) => {
      let data = results.data;
      console.log(`data: ${data}`);
      if (!data || !data.courses) return;
      data.courses.forEach(course => {
        $('.modal-body').append(
          `<div>
            <span class="course-title">
              ${course.title}
            </span>
            <span class="course-cost">
              ${course.cost}
            </span>
            <button class="${course.join ? "joined-button" : "join-button"} btn btn-info btn-sm" data-id="${course._id}">
              ${course.join ? "Joined" : "Join"}
            </button>
            <div class="course-description">
              ${course.description}
            </div>
          </div>`
        );
      });
    }).then(() => {
      addJoinButtonListener();
    });
  })
});

let addJoinButtonListener = () => {
  $(".join-button").click(event => {
    let $button = $(event.target);
    let courseId = $button.data("id");
    console.log(`/api/courses/${courseId}/join`);
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) {
        $button
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text("Try again")
      }
    });
  });
};
