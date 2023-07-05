import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy,ClimbingEnemy,GroundEnemy } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game{
        constructor(gameWidth,gameHeight){
            this.width = gameWidth;
            this.height = gameHeight;
            this.groundMargin = 40;
            this.speed = 0;
            this.maxSpeed = 4;
            this.particles = [];
            this.player = new Player(this);
            this.input  = new InputHandler(this);
            this.background = new Background(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.maxParticles = 50;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 20000;
            this.gameOver = false;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.lives = 5;
        }
        update(deltatime){
            this.time += deltatime;
            if(this.time > this.maxTime){
                this.gameOver = true;
            }
            this.player.update(this.input.keys,deltatime);
            this.background.update();
            //handle Enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltatime;
            }
            this.enemies.forEach(enemy=>{
                enemy.update(deltatime);
            });
            //handle messages
            this.floatingMessages.forEach(floatingMessage=>{
                floatingMessage.update();
            });
            //handle particles
            this.particles.forEach((particle,index)=>{
                particle.update();
            });
            if(this.particles.length > this.maxParticles){
                this.particles=this.particles.slice(this.maxParticles);
            }
             //handle collisions
            this.collisions.forEach((collision,index)=>{
            collision.update(deltatime);
            });
            this.collisions = this.collisions.filter(collision=>!collision.markedForDeletion);
            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);
            this.particles = this.particles.filter(particle=>!particle.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message=>!message.markedForDeletion);
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            });
            this.particles.forEach(particle=>{
                particle.draw(context);
            });
            this.collisions.forEach((collision)=>{
                collision.draw(context);
            });
            this.floatingMessages.forEach(floatingMessage=>{
                floatingMessage.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy(){
            if(this.speed > 0 && Math.random() > 0.5) this.enemies.push(new GroundEnemy(this));
            else if(this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));        }
    }

    const game = new Game(canvas.width,canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const deltatime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltatime);
        game.draw(ctx);
        if(!game.gameOver)requestAnimationFrame(animate);
    }
    animate(0);
});