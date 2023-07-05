class Enemy{
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps =20;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        this.markedForDeletion = false;
    }
    update(deltatime){
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if(this.frameTimer > this.frameInterval){
            if(this.frameX < this.maxFrame) this.frameX ++;
            else this.frameX = 0;
            this.frameTimer = 0;
        }else{
            this.frameTimer += deltatime;
        }
        if(this.x < -this.width) this.markedForDeletion = true;
    }
    draw(context){
        if(this.game.debug)context.strokeRect(this.x,this.y,this.width,this.height);
        context.drawImage(this.image,this.width * this.frameX,0,this.width,this.height,this.x,this.y,this.width,this.height);
    }
}

export class FlyingEnemy extends Enemy{
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height =44;
        this.x = this.game.width + Math.random()* this.game.width *0.5;
        this.y = Math.random()* this.game.height * 0.5;
        this.speedX =Math.random() +1 ;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = document.getElementById('enemy_fly');
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.3;
    }
    update(deltatime){
        super.update(deltatime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

export class GroundEnemy extends Enemy{
    constructor(game){
        super();
        this.game = game;
        this.width =60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height -this.game.groundMargin;
        this.image = document.getElementById('enemy_plant');
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
    }
    update(deltatime){
        super.update(deltatime);
    }
}

export class ClimbingEnemy extends Enemy{
    constructor(game){
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random()*this.game.height*0.5;
        this.image = document.getElementById('enemy_spider_big');
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
    }
    update(deltatime){
        super.update(deltatime);
        if(this.y > this.game.height-this.height-this.game.groundMargin)this.speedY *= -1;
        if(this.y < -this.height) this.markedForDeletion = true; 
    }
    draw(context){
        super.draw(context);
        context.beginPath();
        context.moveTo(this.x + this.width/2,0);
        context.lineTo(this.x+this.width/2,this.y+this.height/2);
        context.stroke();
    }
}