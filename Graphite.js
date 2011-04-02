/*-----------------------------------------------------------------------------
 * taken from mosey-limechat-theme (A limechat theme by Tad Thorley)
-----------------------------------------------------------------------------*/

String.prototype.startsWith = function(str) {
  return this.indexOf(str) == 0;
}

String.prototype.includes = function(str) {
  return this.indexOf(str) >= 0;
}

function markDuplicateTimestamp(node) {
  var prev_time_node = node.previousSibling.firstChild;
  var curr_time_node = node.firstChild;
  if(prev_time_node.innerHTML == curr_time_node.innerHTML)
    curr_time_node.className += " duptime";
}

// limechat doesn't mark topic events or their messages
// as topic types and I think they should be
function markTopicEvent(node) {
  if(node.className.includes("event")) {
    var message_node = node.lastChild;
    if(message_node.innerText.startsWith("Topic")) {
      node.setAttribute("type", "topic");
      message_node.setAttribute("type", "topic");
    }
  }
}

function toggleEvents() {
  var elements = document.getElementsByClassName("event");
  for(i in elements)
    elements[i].style.display = (elements[i].style.display != 'none' ? 'none' : 'block');
}

// Matches URLs with common protocol types or those starting with 'www.' or
// 'ftp.'. Allows (matched) parentheses in a URL, like Wikipedia uses, or
// putting the whole URL in parens (in which case, don't include them in the
// link). Ignores trailing periods, commas, colons, etc.
url_finder = /\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/ig ;

function linkifyUrls(text) {
  return text.replace(url_finder, "<a href=\"$&\">$&</a>");
}

function createTopic() {
  topic = document.createElement('div');
  topic.id = "topic";
  document.body.appendChild(topic);
  return topic;
}

function doTopic(node) {
  markTopicEvent(node);
  var message_node = node.lastChild;
  if(message_node.getAttribute("type") == "topic") {
    var topictxt = message_node.innerText.match(/opic: (.*)$/)[1];
    if(topictxt != "") {
      var topic = document.getElementById('topic') || createTopic();
      topic.innerHTML = linkifyUrls(topictxt);
    }
  }
}

function doInlineImages() {
  //TODO: better handling of inline images
}

function processNode(ev) {
  var inserted_node = ev.target;
  if(document.body.className.includes("normal")) {
    markDuplicateTimestamp(inserted_node);
    doTopic(inserted_node);
    doInlineImages();
  }
}

document.addEventListener("DOMNodeInserted", processNode, false);
