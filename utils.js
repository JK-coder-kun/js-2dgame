export function drawStatusText(context,input,player){
    context.style = 'black';
    context.font = '30px Helvetica';
    context.fillText("Currnet Status :" + input.lastKey,20,50);
    context.fillText("Active State :"+ player.currentState.state,20,90);
}