var domain = "https://haveibeenpwned.com/api/v2/breachedaccount/"


$("#execute-btn").click(function() {
  var emails = $("#user-input").val();
  var emailsArr = emails.split(/[,\/ -]/);
  checkEmails(emailsArr);
})

function checkEmails(emailsArr) {
  var numBreached = 0;
  var numClean = 0;
  $.each(emailsArr, function(_, email) {
    $.ajax({
      url: "https://haveibeenpwned.com/api/v2/breachedaccount/"+email,
      success: function(json){
        addHTML(json, email);
        numBreached++;},

    }).done()
      .fail(function(jqXHR){
        if (jqXHR.status == 404) {
          displayClean(email);
          numClean++;
        }
        else alert("Failed for "+email);
      });
  });
  setTimeout(function() {
    displayNumbers(numBreached, numClean);
  }, 2000);
}


function displayNumbers(numBreached, numClean) {
  $numBreached = $("<small>", {text: "Breached: "+numBreached, class: "breached-color"});
  $numClean = $("<small>", {text: "Clean: "+numClean, class: "clean-color"});
  $("#title-for-output").append(" ", $numBreached, " ", $numClean);
}

function addHTML(data, email) {
  var emailTitle = email;
  email = email.replace(/[\.\@\#]/g,"");
  buildEmailItem(email, emailTitle);
  $.each(data, function(_, obj) {
    var website = obj.Name;
    buildScaffoldFor(website, obj.Domain, email);
    $.each(obj, function(klass, item) {
      var selector = "#"+email+" ."+website+" ."+klass;
      if ($(selector).length) {
        $(selector).append(item)
      }
    })
  })
}

function displayClean(email){
  $parent = $("<a>", {class: "list-group-item disabled"});
  $emailTitle = $("<h4>", {text: email, class: "clean-color"});
  $parent.append($emailTitle);
  $("#inject-here").append($parent);
}

function buildEmailItem(email, emailTitle) {
  $parent = $("<a>", {"data-toggle": "collapse", "data-target": "#"+email, class: "list-group-item"});
  $emailTitle = $("<h4>", {text: emailTitle, class: "breached-color"});
  $div = $("<ul>", {id: email, class: "collapse list-group"});
  $parent.append($emailTitle, $div);
  $("#inject-here").append($parent);
}

function buildScaffoldFor(website, domain, email) {
  $listItem = $("<li>", {class: "list-group-item " + website})
  $title = $("<a>", {class: "Title", href: "http://"+domain, target: "_blank"});
  $count = $("<p>", {class: "PwnCount num-breach", text: "# Breached accounts: "});
  $description = $("<p>", {class: "Description"});
  $listItem.append($title, $count, $description);
  $("#"+email).append($listItem);
}
