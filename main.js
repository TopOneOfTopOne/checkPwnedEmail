var domain = "https://haveibeenpwned.com/api/v2/breachedaccount/"

$.ajax({
  url: "https://haveibeenpwned.com/api/v2/breachedaccount/test@example.com",

}).done(handleRes)
  .fail(function(){alert("Failed")});

function handleRes(data) {
  $.each(data, function(_, obj) {
    var name = obj.Name;
    buildScaffoldFor(name, obj.Domain);
    $.each(obj, function(klass, item) {
      var selector = "#"+name+" ."+klass;
      if ($(selector).length) {
        $(selector).append(item)
      }
    })
  })
}
function buildScaffoldFor(name, domain) {
  $div = $("<div>", {id: name, class: "panel panel-default panel-body"});
  $title = $("<h2>", {class: "Title"});
  $domain = $("<a>", {href: domain})
  $count = $("<p>", {class: "PwnCount", text: "# Breached accounts: ", id: "numBreach"});
  $description = $("<p>", {class: "Description"});
  $div.append($title.append($domain), $count, $description);
  $("#body").append($div);
}
