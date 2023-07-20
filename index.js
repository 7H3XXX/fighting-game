const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.width);
const gravity = 0.7;

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "./img/background.png",
});
const shop = new Sprite({
  position: { x: 600, y: 128 },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: 400, y: 10 },
  velocity: { x: 0, y: 10 },
  offset: { x: 0, y: 0 },
  framesMax: 8,
  scale: 2.5,
  imageSrc: "./img/samuraiMack/Idle.png",
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 80,
      y: 50,
    },
    width: 176,
    height: 50,
  },
});
const enemy = new Fighter({
  position: { x: 600, y: 60 },
  color: "blue",
  offset: { x: -50, y: 0 },
  velocity: { x: 0, y: 2 },
  framesMax: 4,
  scale: 2.5,
  imageSrc: "./img/kenji/Idle.png",
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -172,
      y: 50,
    },
    width: 172,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};
let lastKey;

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchFrames("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchFrames("run");
  } else {
    player.switchFrames("idle");
  }

  if (player.velocity.y < 0) {
    player.switchFrames("jump");
  }
  if (player.velocity.y > 0) {
    player.switchFrames("fall");
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchFrames("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchFrames("run");
  } else {
    enemy.switchFrames("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchFrames("jump");
  }
  if (enemy.velocity.y > 0) {
    enemy.switchFrames("fall");
  }

  //detect collision for player, where enemy gets hit
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.framesCurrent === 4
  ) {
    player.isAttacking = false;
    enemy.takeHit();
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  //if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //detect collision for enemy, where player gets hit
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    player.takeHit();

    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (player.health <= 0 || enemy.health <= 0) {
    detectGameEnd({ player, enemy, timerId });
  }
}

animate();
decreaseTimer();

window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch (e.key) {
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (e.key) {
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      keys.a.pressed = false;

      break;
    case "d":
      keys.d.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;

      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});
