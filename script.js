let grid = [];
let solution = [];
let selectedCell = null;

const puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
];

const puzzleSolution = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
];

function createGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.className = 'cell';
            cell.type = 'text';
            cell.maxLength = 1;
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            if (puzzle[i][j] !== 0) {
                cell.value = puzzle[i][j];
                cell.classList.add('given');
                cell.readOnly = true;
            }
            
            cell.addEventListener('input', handleInput);
            cell.addEventListener('focus', handleFocus);
            cell.addEventListener('keydown', handleKeydown);
            
            gridElement.appendChild(cell);
            grid[i][j] = cell;
        }
    }
}

function handleInput(e) {
    const value = e.target.value;
    if (!/^[1-9]$/.test(value)) {
        e.target.value = '';
        return;
    }
    
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    if (isValidMove(row, col, parseInt(value))) {
        e.target.classList.remove('error');
    } else {
        e.target.classList.add('error');
    }
    
    highlightRelated(row, col);
}

function handleFocus(e) {
    selectedCell = e.target;
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    highlightRelated(row, col);
}

function handleKeydown(e) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
        if (!e.target.classList.contains('given')) {
            e.target.value = '';
            e.target.classList.remove('error');
        }
    }
}

function highlightRelated(row, col) {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('highlight');
    });
    
    for (let i = 0; i < 9; i++) {
        grid[row][i].classList.add('highlight');
        grid[i][col].classList.add('highlight');
    }
    
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            grid[i][j].classList.add('highlight');
        }
    }
}

function isValidMove(row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (i !== col && grid[row][i].value == num) return false;
        if (i !== row && grid[i][col].value == num) return false;
    }
    
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if ((i !== row || j !== col) && grid[i][j].value == num) return false;
        }
    }
    
    return true;
}

function checkSolution() {
    let isComplete = true;
    let hasErrors = false;
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = grid[i][j];
            const value = cell.value;
            
            if (!value) {
                isComplete = false;
            } else if (parseInt(value) !== puzzleSolution[i][j]) {
                hasErrors = true;
                cell.classList.add('error');
            } else {
                cell.classList.remove('error');
            }
        }
    }
    
    const status = document.getElementById('status');
    if (isComplete && !hasErrors) {
        status.textContent = '🎉 Congratulations! You solved it!';
        status.style.color = '#4caf50';
    } else if (hasErrors) {
        status.textContent = '❌ Some numbers are incorrect';
        status.style.color = '#f44336';
    } else {
        status.textContent = '⏳ Keep going...';
        status.style.color = '#ff9800';
    }
}

function newGame() {
    createGrid();
    document.getElementById('status').textContent = '';
}

function clearBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!grid[i][j].classList.contains('given')) {
                grid[i][j].value = '';
                grid[i][j].classList.remove('error');
            }
        }
    }
    document.getElementById('status').textContent = '';
}

createGrid();
