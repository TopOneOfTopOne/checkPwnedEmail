var domain = "https://haveibeenpwned.com/api/v2/breachedaccount/"
var injectedData = [];

$("#modalIntroduction").modal();

// if the execute button is clicked or user presses enter run the 
// main function
$("#execute-btn").click(main)
$("body").keypress((event) => {
  if (event.which == 13) 
	main();
})

function main() {
  var emails = $("#user-input").val();
  var emailsArr = emails.split(/[,\/-]|\s+/);
  clearInjectedData();
  checkEmails(emailsArr);
}

function checkEmails(emailsArr) {
  var numBreached = 0;
  var numClean = 0;
  $.each(emailsArr, function(_, email) {
    $.ajax({
      url: domain+email,
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
  $("#statistics").append(" ", $numBreached, " ", $numClean);
}

function addHTML(data, email) {
  var emailTitle = email;
  email = email.replace(/[\.\@\#]/g,"");
  buildEmailItem(email, emailTitle);
  // iterate over each breached website in the array
  // obj represents a breached website and its details
  $.each(data, function(_, obj) {
    var website = obj.Name;
    buildScaffoldFor(website, obj.Domain, email);
    // iterate over the object
    // klass is the key and item is the value
    $.each(obj, function(klass, item) {
      var selector = "#"+email+" ."+website+" ."+klass;
      if ($(selector).length) {
        $(selector).append(item.toString()) // it is unnecessary to call toString each time but this is a simple fix for when we want to display arrays
      }
    })
  })
  var siteBreachCount = data.length;
  $("#"+email+"siteBreachCount").append(siteBreachCount);
}

function displayClean(email){
  $parent = $("<a>", {class: ""});
  $emailTitle = $("<h4>", {text: email, class: "clean-color email-title"});
  $parent.append($emailTitle);
  $("#inject-here").append($parent);
}

function buildEmailItem(email, emailTitle) {
  $parent = $("<a>", {"data-toggle": "collapse", "data-target": "#"+email, class: ""});
  $emailTitle = $("<h4>", {text: emailTitle, class: "breached-color email-title"});
  $label = $("<span>", {class: "label label-default label-pill pull-right", id: email+"siteBreachCount"});
  $div = $("<ul>", {id: email, class: "collapse list"});
  $emailTitle.append($label)
  $parent.append($emailTitle, $div);
  $("#inject-here").append($parent);
}

function buildScaffoldFor(website, domain, email) {
  $listItem = $("<li>", {class: "" + website})
  $title = $("<a>", {class: "Title", href: "http://"+domain, target: "_blank"});
  // $count = $("<p>", {class: "PwnCount num-breach", text: "# Breached accounts: "});
  $description = $("<p>", {class: "Description"});
  $dataLost = $("<p>", {class: "DataClasses", text: "Data Lost: "})
  $listItem.append($title, $dataLost, $description);
  $("#"+email).append($listItem);
}

function clearInjectedData() {
  $("#inject-here").empty();
  $("#statistics").empty();
}
