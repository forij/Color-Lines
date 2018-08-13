"use strict";

const canvas = document.getElementById("game_area");
const ctx = canvas.getContext("2d");

const WIDTH = 600,
    HEIGHT = 600,
    WITH_CELLS = ( WIDTH + 1 ) / 9,
    HEIGHT_CELLS = ( HEIGHT + 1 ) / 9,
    RADIUS_CIRCLE = ( WITH_CELLS < HEIGHT_CELLS ? WITH_CELLS : HEIGHT_CELLS ) / 2 - 5;

    
const COLOR_LIST =[ 
    '#ff0000', // 1 Red
    '#00ff00', // 2 Green
    '#0000ff', // 3 Blue
    '#ff00ff', // 4 Pink
    '#00ffff', // 5 Aqua
    '#ffff00', // 6 Yellow
    '#3b0053'  // 7
];

ctx.canvas.height = HEIGHT;
ctx.canvas.width = WIDTH;

const draw_line = (ctx, x1, y1, x2, y2)=>{
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}


const draw_game_board = (ctx)=>{
    for(let i = 1; i < 9; i++){
        draw_line(ctx, WITH_CELLS * i, 0, WITH_CELLS * i,  HEIGHT);
        draw_line(ctx, 0, HEIGHT_CELLS * i, WIDTH,  HEIGHT_CELLS * i);
    }
}

const draw_circle_in_cell = (ctx, i, j, color_id, radius_circle = RADIUS_CIRCLE) => {
    const x = WITH_CELLS / 2 + i * WITH_CELLS;
    const y = HEIGHT_CELLS / 2 + j * HEIGHT_CELLS;
    ctx.beginPath();
    ctx.arc(x, y, radius_circle, 0, 2*Math.PI);
    ctx.fillStyle = COLOR_LIST[color_id];
    ctx.fill();
    ctx.stroke();
}

const transform_cord2i_j = (x, y) => {
    return [ Math.floor( x / WITH_CELLS ), Math.floor( y / HEIGHT_CELLS)]
}

const select_cell = (ctx, i, j)=>{
    const x = WITH_CELLS / 2 + i * WITH_CELLS;
    const y = HEIGHT_CELLS / 2 + j * HEIGHT_CELLS;
    ctx.beginPath();

    ctx.stroke();
}

const clear = (ctx)=>{
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
}

const rerender = (state_game_area, ctx)=>{
    clear(ctx);
    draw_game_board(ctx);
    update(state_game_area, ctx);
}

draw_game_board(ctx);
