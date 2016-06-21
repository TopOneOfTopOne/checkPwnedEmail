var domain = "https://haveibeenpwned.com/api/v2/breachedaccount/"


$("#execute-btn").click(function() {
  var emails = $("#user-input").val();
  var emailsArr = emails.split(/[,\/ -]/);
  checkEmails(emailsArr);
})

function checkEmails(emailsArr) {
  $.each(emailsArr, function(_, email) {
    var data;
    var url = "https://haveibeenpwned.com/api/v2/breachedaccount/"+email
    $.ajax({
      url: url
    }).done(function(json){addHTML(json, email)})
      .fail(function(jqXHR){
        if (jqXHR.status == 404) displayClean(email);
        else alert("Failed for "+email);
      });
  })
}

function addHTML(data, email) {
  var emailTitle = email;
  email = email.replace(/[\.\@\#]/g,"");
  buildEmailDiv(email, emailTitle);
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
  $emailTitle = $("<h1>", {text: email, class: "clean-email-title"});
  $("#body").append($emailTitle);
}

function buildEmailDiv(email, emailTitle) {
  $div = $("<div>", {id: email, class: "collapse"});
  $emailTitle = $("<h1>", {text: emailTitle, class: "breached-email-title"});
  $button = $("<button>", {class: "btn btn-info", text: "Show breached sites", "data-toggle": "collapse", "data-target": "#"+email})
  $("#body").append($emailTitle, $div, $button);
}

function buildScaffoldFor(website, domain, email) {
  $div = $("<div>", {class: "panel panel-default panel-body " + website});
  $title = $("<h2>", {class: "Title"});
  $domain = $("<a>", {href: domain})
  $count = $("<p>", {class: "PwnCount num-breach", text: "# Breached accounts: "});
  $description = $("<p>", {class: "Description"});
  $div.append($title.append($domain), $count, $description);
  $("#"+email).append($div);
}
