let timer = 60;
let timerId;

function detectGameEnd({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.getElementById("verdict").style.visibility = "visible";
  if (player.health === enemy.health) {
    document.getElementById("verdict").textContent = "Tie";
  } else if (player.health > enemy.health) {
    document.getElementById("verdict").textContent = "Player wins";
  } else if (player.health < enemy.health) {
    document.getElementById("verdict").textContent = "Enemy wins";
  }
}

function decreaseTimer() {
  let timerElement = document.getElementById("timer");
  // let interval = setInterval(function () {
  //   timerElement.textContent = timer--;

  //   if (timer < 0) {
  //     detectGameEnd({ player, enemy });
  //     clearInterval(interval);
  //   }
  // }, 1000);
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    timerElement.textContent = timer;
  }

  if (timer === 0) {
    detectGameEnd({ player, enemy, timerId });
  }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.width + rectangle2.position.x &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <=
      rectangle2.height + rectangle2.position.y &&
    rectangle1.isAttacking
  );
}
