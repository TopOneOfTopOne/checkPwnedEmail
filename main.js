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
      .fail(function(){alert("Failed for "+email)});
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

function buildEmailDiv(email, emailTitle) {
  $div = $("<div>", {id: email});
  $emailTitle = $("<h1>", {text: emailTitle});
  $div.append($emailTitle);
  $("#body").append($div);
}

function buildScaffoldFor(website, domain, email) {
  $div = $("<div>", {class: "panel panel-default panel-body " + website});
  $title = $("<h2>", {class: "Title"});
  $domain = $("<a>", {href: domain})
  $count = $("<p>", {class: "PwnCount", text: "# Breached accounts: ", id: "numBreach"});
  $description = $("<p>", {class: "Description"});
  $div.append($title.append($domain), $count, $description);
  $("#"+email).append($div);
}
