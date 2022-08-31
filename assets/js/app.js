window.onload = function () {
  const canvas = document.createElement("canvas");
  const affichage = document.createElement("div");
  const tige = document.createElement("div");
  const pieds = document.createElement("div");
  pieds.textContent = "enjoy your game";
  canvas.id = "canvas";
  affichage.id = "affichage";
  tige.id = "tige";
  pieds.id = "pieds";
  canvas.width = 900;
  canvas.height = 600;
  document.body.appendChild(affichage);
  document.body.appendChild(canvas);
  document.body.appendChild(tige);
  document.body.appendChild(pieds);
  const widthCanvas = canvas.width;
  const heightCanvas = canvas.height;
  const ctx = canvas.getContext("2d");
  let collision = false;
  let score = 0;
  let vie = 3;
  let niveau = 0;
  let codeTouche = 0;
  let afficherBonus = false;
  let pause = false;

  document.addEventListener("keydown", interaction);

  //Propriété du serpent
  const colorSerp = "black";
  const tailleSerp = 15;
  const nombreBlockParWidth = widthCanvas / tailleSerp;
  const nombreBlockParHeight = heightCanvas / tailleSerp;
  let xSerp = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
  let ySerp = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  let deplX = 0;
  let deplY = 0;
  let tailleBody = 5;
  let bodySerp = [];

  //Propriété pomme
  const colorPomme = "red";
  const rayonPomme = tailleSerp / 2;
  let xPomme = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
  let yPomme = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  let tempsPomme = 0;
  let tempsMaxPomme = 60;

  //Propriété Bonus
  const colorBonus = "green";
  let xBonus = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
  let yBonus = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  let tempsBonus = 0;

  const intervalID = setInterval(game, 100);
  afficher();

  // Fonction qui lance le Jeu
  function game() {
    dessinerSerp();
    dessinerPomme();
    detectionCollision();
    verifMangerPomme();
    gestionVie();
    gestionAffichageBonus();
  }

  // Fonction qui gère la position du serpent
  function gerePositionSerp() {
    xSerp = xSerp + deplX * tailleSerp;
    ySerp = ySerp + deplY * tailleSerp;
    bodySerp.push({ x: xSerp, y: ySerp });
    while (bodySerp.length > tailleBody) {
      bodySerp.shift();
    }
  }
  // Fonction qui déssine le serpent
  function dessinerSerp() {
    ctx.clearRect(0, 0, widthCanvas, heightCanvas);
    gerePositionSerp();
    ctx.fillStyle = colorSerp;
    for (let i = 0; i < bodySerp.length; i++) {
      ctx.fillRect(bodySerp[i].x, bodySerp[i].y, tailleSerp - 1, tailleSerp - 1);
    }
  }

  //Fonction qui dessine la pomme
  function dessinerPomme() {
    ctx.beginPath();
    ctx.arc(xPomme + rayonPomme, yPomme + rayonPomme, rayonPomme, 0, 2 * Math.PI);
    ctx.fillStyle = colorPomme;
    ctx.fill();
    ctx.font = "10px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("v", xPomme + 1, yPomme + 2);
    ctx.closePath();
  }

  //Fonction qui dessine le bonus
  function dessinerBonus() {
    ctx.font = "12px Arial";
    ctx.fillStyle = colorBonus;
    ctx.fillText("🤎", xBonus - 1, yBonus + 12);
  }

  // Fonction qui réinitialise la position de la pomme
  function initPositionPomme() {
    xPomme = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
    yPomme = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  }

  // Fonction qui réinitialise le serpent
  function initPositionSerpent() {
    xSerp = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
    ySerp = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  }

  // Fonction qui réinitialise le bonus
  function initPositionBonus() {
    xBonus = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
    yBonus = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  }

  // Fonction qui détecte les collisions
  function detectionCollision() {

    //Collision avec le serpent
    if (bodySerp.length > 5) {
      for (let i = 0; i < bodySerp.length - 1; i++) {
        if (bodySerp[i].x == bodySerp[bodySerp.length - 1].x &&
          bodySerp[i].y == bodySerp[bodySerp.length - 1].y) {
          collision = true;
          break;
        }
      }
    }

    //Collision avec le Canvas
    if (xSerp < 0 || ySerp < 0 || xSerp + tailleSerp > widthCanvas || ySerp + tailleSerp > heightCanvas) {
      collision = true;
    }
  }

  //Fonction qui verifie si la pomme est mangée
  function verifMangerPomme() {
    if (xPomme == xSerp && yPomme == ySerp) {
      initPositionPomme();
      score += 10 + 3 * bodySerp.length;
      tailleBody += 5;
      niveau = Math.trunc(score / 300);
      tempsPomme = 0;
      afficher();
    } else if (tempsPomme++ > tempsMaxPomme) {
      initPositionPomme();
      tempsPomme = 0;
    }
  }

  // Fonction qui affiche le score, la vie et le niveau
  function afficher() {
    const message = "Score : " + score + " | Vie : " + vie + " | Niveau : " + niveau;
    document.getElementById("affichage").textContent = message;
  }

  // fonction qui réinitialise la pomme et le serpent
  function gestionVie() {
    if (pause) {
      collision = false;
      return;
    }
    if (collision) {
      vie--;
      collision = false;
      tailleBody = 5;
      initPositionPomme();
      initPositionSerpent();
      afficher();
      bodySerp = [bodySerp[bodySerp.length - 1]];
      if (vie == 0) {
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", widthCanvas / 2 - 130, heightCanvas / 2);
        ctx.font = "15px Arial";
        ctx.fillText("Score : " + score + " points", widthCanvas / 2 - 130, heightCanvas * 2 / 3 - 50);
        ctx.fillText("Appuyer sur la touche ENTRÉE pour rejouer !", widthCanvas / 2 - 130, heightCanvas * 3 / 4 - 70);
        clearTimeout(intervalID);
      }
    }
  }

  // Fonction qui gère le bonus
  function gestionAffichageBonus() {
    if (tempsBonus++ > 50) {
      tempsBonus = 0;
      if (Math.random() > 0.7) {
        //on affche le bonus
        initPositionBonus();
        afficherBonus = true;
      } else {
        //on n'affiche pas le bonus
        xBonus = 1000;
        yBonus = 1000;
        afficherBonus = false;
      }
    }
    if (afficherBonus) {
      dessinerBonus();
    }

    // Test si le serpent mange le bonus
    if (xSerp == xBonus && ySerp == yBonus) {
      vie++;
      afficher();
      xBonus = 1000;
      yBonus = 1000;
      afficherBonus = false;
    }
  }

  //Fonction qui déplace le serpent
  function interaction(event) {
    switch (event.keyCode) {
      case 37:
        pause = false;
        //Gauche
        if (codeTouche == 39) {
          break;
        }
        deplX = -1;
        deplY = 0;
        codeTouche = event.keyCode;
        break;
      case 38:
        pause = false;
        //Haut
        if (codeTouche == 40) {
          break;
        }
        deplX = 0;
        deplY = -1;
        codeTouche = event.keyCode;
        break;
      case 39:
        pause = false;
        //Droite
        if (codeTouche == 37) {
          break;
        }
        deplX = 1;
        deplY = 0;
        codeTouche = event.keyCode;
        break;
      case 40:
        pause = false;
        //Bas
        if (codeTouche == 38) {
          break;
        }
        deplX = 0;
        deplY = 1;
        codeTouche = event.keyCode;
        break;
      case 32:
        pause = true;
        //Pause
        deplX = 0;
        deplY = 0;
        codeTouche = event.keyCode;
        break;
      case 13:
        //rejouer
        document.location.reload(true);
        break;
      default:
    }
  }
}
