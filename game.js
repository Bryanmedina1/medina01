// Simon Game Challenge - completed Steps 1 to 10
// Uses the supplied jQuery library and sound files.

var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var level = 0;
var started = false;
var acceptingInput = false;

function nextSequence() {
  userClickedPattern = [];
  acceptingInput = false;
  level++;

  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Show the new colour after a short pause so the level change is visible.
  setTimeout(function () {
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);

    // Allow input after the complete sequence has been displayed.
    if (gamePattern.length === 1) {
      acceptingInput = true;
    }
    showRemainingSequence(1);
  }, 350);
}

function showRemainingSequence(index) {
  if (index >= gamePattern.length) {
    acceptingInput = true;
    return;
  }

  setTimeout(function () {
    var colour = gamePattern[index];
    $("#" + colour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(colour);
    showRemainingSequence(index + 1);
  }, 650);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play().catch(function () {
    // Browsers may block audio until the user interacts with the page.
  });
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      acceptingInput = false;
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  playSound("wrong");
  $("body").addClass("game-over");
  $("#level-title").text("Game Over, Press Any Key to Restart");

  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);

  startOver();
}

function startOver() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  acceptingInput = false;
}

function handleButtonPress() {
  if (!started || !acceptingInput) {
    return;
  }

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
}

// Start the game only on the first key press (or restart after Game Over).
$(document).on("keydown", function () {
  if (!started) {
    started = true;
    nextSequence();
  }
});

// Detect clicks on all four coloured buttons.
$(".btn").on("click", handleButtonPress);

// Also allow keyboard activation when a coloured tile has focus.
$(".btn").on("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    $(this).trigger("click");
  }
});
