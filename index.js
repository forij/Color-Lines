"use strict";

const el_game_label = document.getElementById('game_label');
const el_score = document.getElementById('score');

const text_game_label = 'Color Lines'

const randrange = (min, max) => {
    return min + Math.floor( Math.random() * ( max - min ) );
}

for(let i = 0; i < text_game_label.length; i++){
    let el_span = document.createElement('span');
    el_span.innerHTML = text_game_label[i];
    el_span.style.color = `rgb( ${randrange(0,256)}, ${randrange(0,256)}, ${randrange(0,256)})`;
    el_game_label.append(el_span);
}

let state_game_area = [
    /*0  1  2  3  4  5  6  7  8*/
/*0*/[0, 0, 0, 0, 0, 0, 0, 0, 0],
/*1*/[0, 0, 0, 0, 0, 0, 0, 0, 0],
/*2*/[0, 0, 0, 0, 0, 0, 0, 0, 0],
/*3*/[0, 0, 0, 0, 0, 0, 0, 0, 0],
/*4*/[0, 0, 0, 0, 0, 0, 0, 0, 0],
/*5*/[0, 0, 0, 0, 0, 0, 0, 0, 0],
/*6*/[0, 0, 0, 0, 0, 0, 0, 0, 0],
/*7*/[0, 0, 0, 0, 0, 0, 0, 0, 0],
/*8*/[1, 0, 0, 0, 0, 0, 0, 0, 0],
]

const get_cell_around = ( i, j) =>{
    let buff = []
    for(let k_j = - 1; k_j < 2; k_j++ ){
        for(let k_i = -1; k_i < 2; k_i++ ){
                if( j + k_j >= 0 && j + k_j <= 8 ){
                    if( i + k_i >= 0 && i + k_i <= 8){
                        if( !(j + k_j == j && i + k_i== i)){ 
                            buff.push( [i + k_i, j + k_j] );
                        } 
                    }
                }
        }
    }
    return buff;
}

const get_way = (state, i1, j1, i2, j2) => {
    let _state = state.map( el=> el.map( el=>el ) );
    for(let j = 0; j < 9; j++){
        for(let i = 0; i < 9; i++){
            _state[i][j] = _state[i][j] != 0 ? -1 : 0;
        }
    }

    _state[i1][j1] = -2;
    _state[i2][j2] = -3;

    let queue = [[i1, j1, 0]];
    let way = [];

    const min_point = (point_list) => {
        let min = false;
        for(let i = 0; i < point_list.length; i++){
            if( _state[point_list[i][0]][point_list[i][1]] == -2 ){
                return point_list[i]
            }
            if( ![-3, -1, 0].includes( _state[point_list[i][0]][point_list[i][1]] ) ){
                if(min == false){
                    min = [ _state[point_list[i][0]][point_list[i][1]], point_list[i] ]
                }else if( min[0] >  _state[point_list[i][0]][point_list[i][1]] ){
                    min =  [ _state[point_list[i][0]][point_list[i][1]], point_list[i] ]
                }
            }
        }
        return min[1]
    }

    while( queue.length > 0 ){
        let current_cells = queue.shift();
        let around_cell = get_cell_around( current_cells['0'], current_cells['1']);
        for(let counter = 0; counter < around_cell.length; counter++){
            if(  _state[around_cell[counter][0]][around_cell[counter][1] ] == -3 ){
                way = [ [i2,j2], [current_cells[0], current_cells[1]] ]
                let first_point = false;
                while( _state[way[way.length - 1][0] ][way[way.length - 1][1] ] != -2 ){
                    around_cell = get_cell_around( way[way.length - 1][0], way[way.length - 1][1]);
                    let min_p = min_point(around_cell);
                    way.push(min_p);
                }
                return way;
            }else if( _state[around_cell[counter][0]][around_cell[counter][1] ] == 0 ){
                _state[around_cell[counter][0]][around_cell[counter][1] ] = current_cells[2] + 1;
                queue.push([ ...around_cell[counter], current_cells[2] + 1] );
            }
        }
    }
    return false;
}


const update = (_state, ctx) =>{
    for(let j = 0; j < 9; j++){
        for(let i = 0; i < 9; i++){
            if( _state[i][j] != 0){
                draw_circle_in_cell(ctx, i, j, _state[i][j] - 1);
            }
        }
    }
}

const get_empty_cell = (state) => {
    let empty_cells = [];
    for(let j = 0; j < 9; j++){
        for(let i = 0; i < 9; i++){
            if( state[i][j] == 0){
                empty_cells.push([i, j]);
            }
        }
    }
    return empty_cells;
}

const add_rand_circle = (state)=>{
    let empty_cells = get_empty_cell(state);
    
    if(empty_cells.length  == 0){
        return false;
    }else{
        let rand_cell = []
        let count_add_circle = empty_cells.length < 3 ? empty_cells.length : 3;
        for(let i = 0; i < count_add_circle; i++){
            let rand_index = randrange(0, empty_cells.length - 1);
            rand_cell.push( empty_cells[rand_index] );
            empty_cells[rand_index] = empty_cells[0];
            empty_cells.shift();
        }

        rand_cell.forEach( (cell) => state[cell[0] ][cell[1] ] = randrange(1, 7) );

        return rand_cell;
    }
}

let score = 0;

const remove_col = (state) => {
    let empty_cells = [];
    let remove_cell = false;
    for(let j = 0; j < 9; j++){
        let line = [];
        for(let i = 0; i < 9; i++){
            if( line.length == 0 ){
                line.push( [i, j] );
            }else{
                if( state[i][j] == state[line[line.length - 1][0] ][line[line.length - 1][1] ] ){
                    line.push( [i, j] );
                }else{
                    if(state[line[line.length - 1][0] ][line[line.length - 1][1] ] > 0 && line.length >= 5){
                        score += line.length;
                        line.forEach( (cell) => state[cell[0] ][cell[1] ] = 0 );
                        remove_cell = true;
                    }
                    line = [];
                    line.push( [i, j] );
                }
            }
        }
        if(state[line[line.length - 1][0] ][line[line.length - 1][1] ] > 0 && line.length >= 5){
            score += line.length;
            line.forEach( (cell) => state[cell[0] ][cell[1] ] = 0 );
            remove_cell = true;
        }
    }
    return remove_cell;
}

const remove_line = (state) => {
    let empty_cells = [];
    let remove_cell = false;
    for(let i = 0; i < 9; i++){
        let line = [];
        for(let j = 0; j < 9; j++){
            if( line.length == 0 ){
                line.push( [i, j] );
            }else{
                if( state[i][j] == state[line[line.length - 1][0] ][line[line.length - 1][1] ] ){
                    line.push( [i, j] );
                }else{
                    if(state[line[line.length - 1][0] ][line[line.length - 1][1] ] > 0 && line.length >= 5){
                        score += line.length;
                        line.forEach( (cell) => state[cell[0] ][cell[1] ] = 0 );
                        remove_cell = true;
                    }
                    line = [];
                    line.push( [i, j] );
                }
            }
        }
        if(state[line[line.length - 1][0] ][line[line.length - 1][1] ] > 0 && line.length >= 5){
            score += line.length;
            line.forEach( (cell) => state[cell[0] ][cell[1] ] = 0 );
            remove_cell = true;
        }
    }
    return remove_cell;
}

add_rand_circle(state_game_area);

update( state_game_area, ctx );

let old_selected = false;

canvas.addEventListener('click', (e)=>{
    let current_cell = transform_cord2i_j(e.offsetX, e.offsetY);
    if( old_selected == false ){
        if( state_game_area[current_cell[0] ][current_cell[1] ] != 0 ){
            old_selected = transform_cord2i_j(e.offsetX, e.offsetY);
        }
    }else{
        if(current_cell[0] == old_selected[0] && current_cell[1] == old_selected[1]){
            old_selected = false;
        }else{
            if(state_game_area[old_selected[0] ][old_selected[1] ] != 0 && state_game_area[current_cell[0] ][current_cell[1] ] == 0){
                let way = get_way(state_game_area, old_selected[0], old_selected[1], current_cell[0], current_cell[1]);
                if( way == false){
                    old_selected = false;
                }else{
                    state_game_area[current_cell[0] ][current_cell[1] ] = state_game_area[old_selected[0] ][old_selected[1] ]
                    state_game_area[old_selected[0] ][old_selected[1] ] = 0;
                    old_selected = false;

                    if( !  ( remove_col(state_game_area) || remove_line(state_game_area) ) ){
                        add_rand_circle(state_game_area);
                        remove_col(state_game_area);
                        remove_line(state_game_area);
                    }
                }
            }
        }
    }
    rerender(state_game_area, ctx);

    el_score.innerHTML = `Score: ${score}`

    if( get_empty_cell(state_game_area).length == 0 ){
        alert(`Game over \n ${score}`);
    }
} );