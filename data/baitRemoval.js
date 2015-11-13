var option;

window.addEventListener('scroll', throttle(function() {
  checkForStupidClickBait();
}, 2000));

var regexLength = regexes.length;

function checkForStupidClickBait() {
  var possibleClickBaitArticles = document.querySelectorAll('.mbs._6m6, ._6m6');
  var clickBaitArticlesLength = possibleClickBaitArticles.length;
  for (var i = 0; i < clickBaitArticlesLength; i++) {
    var currentArticle = possibleClickBaitArticles[i];

    if (currentArticle.children.length <= 1) {
      var articleTextContent = currentArticle.textContent;

      for (var j = 0; j < regexLength; j++) {
        var sensitive = regexes[j].sensitive;
        var modifiers = "gi";

        if (sensitive) {
          modifiers = "g";
        }

        var reg = new RegExp(regexes[j].regex, modifiers);
        var severity = regexes[j].severity;
        var isTheArticleSafe = articleTextContent.match(reg);

        if (isTheArticleSafe) {
          addClickBaitWarning(currentArticle);
          break;
        }
      }

      if (currentArticle.children.length <= 1) {
        markArticleAsSafe(currentArticle);
      }
    }
  }
}

var addClickBaitWarning = function (currentArticle) {
  if (option !== 'flag') {
    var articleContainer = currentArticle.closest('._4-u2');
    articleContainer.parentNode.removeChild(element);
    return;
  }

  var warning = document.createElement('div');
  warning.className = 'articleClickbait';

  var message = document.createElement('div');

  var title = document.createElement('h1');
  title.className = 'articleTitle';
  title.innerHTML = "This article is clickbait";

  var subtitle = document.createElement('p');
  subtitle.className = 'articleSubtitle';
  subtitle.innerHTML = "The sole purpose for these types of articles is to profit off of you. They have a catchy headline to get your attention and to get you to click. It's the fast food of the Internet. If this news site cared about you, they would not do this.";

  message.appendChild(title);
  message.appendChild(subtitle);
  warning.appendChild(message);

  currentArticle.appendChild(warning);

  var articleContainer = currentArticle.closest('.mtm');
  articleContainer.classList.add('clickBaitArticle');
}

var markArticleAsSafe = function (currentArticle) {
  var safe = document.createElement('div');
  safe.className = 'articleSafe';
  currentArticle.appendChild(safe);
}

// Throttle function grabbed from:
// https://remysharp.com/2010/07/21/throttling-function-calls
function throttle (fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
  deferTimer;
  return function () {
    var context = scope || this;
    var now = +new Date,
    args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

self.port.on('init', function (val) {
  option = val;
  checkForStupidClickBait();
});

self.port.on('options_updated', function (val) {
  option = val;
  checkForStupidClickBait();
});
