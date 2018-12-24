/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//Create TweeElement form
function createTweetElement(tweetData) {

  const element = `
      <article class="eachtweet" data-id=${tweetData.user.name} data-tweetid=${tweetData._id}>
          <header>
            <img class="avatar" src="${tweetData.user.avatars.small}">
            <h1 class="username">${tweetData.user.name}</h1>
            <h3 class="userid">${tweetData.user.handle}</h3>
          </header>
          <p>${escape(tweetData.content.text)}</p>
          <footer>
          <time>${moment(tweetData.created_at).startOf('day').fromNow()}</time>
          <h3 class="likes">${tweetData.like ? 1 : 0}</h3><h3 class="likeword">likes: </h3>
          <img type="image" alt="Submit" class="icon flag" src="/images/flag.png">
          <img type="image" alt="Submit" class="icon like" src="/images/like.png">
          <img type="image" alt="Submit" class="icon repost" src="/images/repost.png">
        </footer>
        </article>
  `
  $('#tweets-container').prepend(element);
}

//To get test as text not jquery
function escape(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//To add tweets
function renderTweets(tweets) {
  tweets.forEach(function(data) {
    createTweetElement(data);
  })
}

loadTweets();
//load from tweet page
function loadTweets() {
  $.ajax({
    url: '/tweets',
    method: "GET",
    data: $(this),
    success: function(data) {
      renderTweets(data)
    }
})
}

//when submit tweet what happened
$( document ).ready(function() {
  $(".new-tweet").hide();
  var $form = $("form");
  $form.on("submit", function (event){
  event.preventDefault();
  if( $('textarea').val().length === 0) {
    $(".Err").html("No content to submit!")
  } if (140 - $('textarea').val().length < 0) {
    $(".Err").html("Content Too long !")
  }
    else {
      $.ajax({
        url: '/tweets',
        method: "POST",
        data: $(this).serialize(),
        success: function(data) {
          console.log('done');
          $("#tweets-container").empty();
          loadTweets()
          $('textarea').val('')
          $(".Err").html("")
          $('.counter').val('140');
        }
      });
    }
  })
//what happen when submit compose
$(".composebutton").click( function(){
  $(".Err").html("")
  $(".new-tweet").slideToggle("slow")
  if($(".new-tweet").is(":visible")) {
    $( "textarea" ).focus();
  }
  })

// $(document).on('click', '.like', function(e) {
//   let likes = $('.likes', this.parentElement);
//   let count = parseInt(likes.text());

//     if(likes.hasClass('clicked') === true) {
//       likes.text(count - 1);
//       likes.removeClass('clicked');
//     } else {
//       likes.text(count + 1);
//       likes.addClass('clicked');
//     }

// })

$(document).on('click', '.like', function(e) {
        var $target = $(this).parent().parent();
        var tweetid = $target.attr('data-tweetid');
        $.ajax({
        url: '/tweets/like/' + tweetid,
        method: "POST",

        success: function(data) {
          let likes = $(e.target).siblings('.likes');

          if(likes.hasClass('clicked') === true) {
            if(likes.text() == 0) {
              likes.text(1);
            } else {
              likes.text(0);
            }
            likes.removeClass('clicked');
          }
          else {
              if(likes.text() == 0) {
               likes.text(1);
              } else {
                likes.text(0);
              }
              likes.addClass('clicked');
            }
         }

      });
})
})
