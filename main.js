var domain = "https://haveibeenpwned.com/api/v2/breachedaccount/"


$("#execute-btn").click(function() {
  var emails = $("#user-input").val();
  var emailsArr = emails.split(/[.,\/ -]/);
  checkEmails(emailsArr);
})

function checkEmails(emailsArr) {
  $.each(emailsArr, function(_, email) {
    var data;
    $.ajax({
      url: "https://haveibeenpwned.com/api/v2/breachedaccount/"+email,
    }).done(function(json){data=json})
      .fail(function(){alert("Failed for "+email)});
    addHTML(data, email);
  })
}

function addHTML(data, email) {
  buildEmailDiv(email);
  $.each(data, function(_, obj) {
    var website = obj.Name;
    buildScaffoldFor(website, obj.Domain, email);
    $.each(obj, function(klass, item) {
      var selector = "#"+email+" ."+name+" ."+klass;
      if ($(selector).length) {
        $(selector).append(item)
      }
    })
  })
}

function buildEmailDiv(email) {
  $div = $("<div>", {id: email});
  $emailTitle = $("<h1>", {text: email});
  $div.append($emailTitle);
  $("#body").append($div);
}

function buildScaffoldFor(website, domain, email) {
  $div = $("<div>", {id: website, class: "panel panel-default panel-body"});
  $title = $("<h2>", {class: "Title"});
  $domain = $("<a>", {href: domain})
  $count = $("<p>", {class: "PwnCount", text: "# Breached accounts: ", id: "numBreach"});
  $description = $("<p>", {class: "Description"});
  $div.append($title.append($domain), $count, $description);
  $("#"+email).append($div);
}
