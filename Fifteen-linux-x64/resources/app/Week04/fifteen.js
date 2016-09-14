//CSE 154 AD
//JIUN-CHENG WANG
//HW4
//fifteen.js
//build the puzzle and gaming features
//
//Extra Feature:
//		End-of-game Notification,
//		Game Timer

(function(){
	"use strict";
	var BLANK_SPACE = "NULL"; // const for the blank space in puzzle
	var PUZZLE_SIZE = 4; // const for the size of the puzzle
	var gameTimer = null; // use to store the timer of the game
	var highScore = Number.MAX_VALUE; // use to store the shortest time the player has achieved
	var leastStep = Number.MAX_VALUE; // used to store the least steps need to solve the puzzle

	// Things should do upon the page finish loading
	window.onload = function(){
		createPuzzle();
		document.getElementById("shufflebutton").onclick = shuffle;
	};

	// pre: puzzle should be exact 4 * 4 layout
	// post: create a puzzle in 4 * 4 format
	function createPuzzle(){
		var puzzleArea = document.getElementById("puzzlearea");
		var order = 1; // records the order of current making puzzle

		for(var i = 0; i < PUZZLE_SIZE; i++){
			for(var s = 0; s < PUZZLE_SIZE; s++){
				if(i != 3 || s != 3){ // if is not reaching the bottom right piece
					var puzzle = document.createElement("div");
					puzzle.classList.add("puzzle");
					puzzle.innerHTML = order;
					puzzle.style.left = s * 100 + "px";
					puzzle.style.top = i * 100 + "px";
					puzzle.style.backgroundPosition = s * -100 + "px " + i * -100 + "px";
				}

				order++;
				puzzleArea.appendChild(puzzle);
			}
		}
	}

	// pre: a solved puzzle is displayed
	// post: randomly move the puzzle by the rules for 1000 times to make sure the
	// 		 puzzle is solvable and fully randomized
	function shuffle(){
		clearInterval(gameTimer); // stop the timer
		gameTimer = null;
		for(var i = 0; i < 1000; i++){
			var currentPositioning = startingPosition(); // get the current layout in
														 // terms of coordinates in 2D
														 // array

			// pick which horizontal line first
			var y = Math.floor(Math.random() * currentPositioning.length);
			// then pick which element in the horizontal line
			var x = Math.floor(Math.random() * currentPositioning[y].length);

			var swap = canMove(currentPositioning, y, x);
			if(swap.length){ // if there is a space next to it
				exchange(swap, currentPositioning[y][x]);
			}
		}

		if(finished()){
			shuffle();
		}else{
			document.getElementById("output").innerHTML = ""; //clean all message
			startTimer(); // start counting down the timer
		}
	}

	// pre: give the current layout of the puzzle, puzzlePosition should be a 4 * 4 2D array,
	// 		and then give the coordinates x, y by numbers
	// post: return the coordinate of the space next to in in an array, if there is no space
	//		 next to the element, return an empty array
	function canMove(puzzlePosition, y, x){
		if(y + 1 < puzzlePosition.length && puzzlePosition[y + 1][x] === BLANK_SPACE){
		//if there is a space right above it
			return [y + 1, x];
		}else if(y - 1 > -1 && puzzlePosition[y - 1][x] === BLANK_SPACE){ // if there is a space
																		  // right below it
			return [y - 1, x];
		}else if(x + 1 < puzzlePosition[y].length && puzzlePosition[y][x + 1] === BLANK_SPACE){
		// if there is a space on its right
			return [y, x + 1];
		}else if(x - 1 > -1 && puzzlePosition[y][x - 1] === BLANK_SPACE){ // if there is a space
																		  // on its left
			return [y, x - 1];
		}


		// returns an empty array when there is no empty space around it
		return [];
	}


	// pre: when the puzzle pieces are on displaied
	// post: returns the current displayed position coordinate in terms of
	//		 a 2D array
	function startingPosition(){
		var all = document.querySelectorAll(".puzzle"); // get all the puzzle pieces
		var puzzlePosition = create2DArray(); // create an empty 4 * 4 array

		for(var i = 0; i < all.length; i++){
			puzzlePosition[parseInt(all[i].style.top) / 100][parseInt(all[i].style.left) / 100] = 
				all[i];
		}

		return puzzlePosition;
	}

	// pre: when the puzzle is displayed and at least shuffled once
	// post: if the element the mouse is pointing has a space around it,
	// 		 it will turn red, in other cases then not
	function markHover(){
		var currentPosition = startingPosition(); // get the current layout

		// loop through every puzzle element to check
		for(var i = 0; i < currentPosition.length; i++){
			for(var s = 0; s < currentPosition[i].length; s++){
				if(currentPosition[i][s] != BLANK_SPACE){ // if the element itself
														  // is not blank
					if(!canMove(currentPosition, i, s).length){ // if the position of the
																// space is not indicated
						// remove the hover effect
						currentPosition[i][s].classList.remove("hoverOn");
						// remove the mouse event
						currentPosition[i][s].onclick = BLANK_SPACE;
					}else{
						// add the hover effect
						currentPosition[i][s].classList.add("hoverOn");
						// add the mouse event
						currentPosition[i][s].onclick = swap;
					}
				}
			}
		}
	}

	// pre: this function had to be assigned to the element which is haveing a space
	//		around it.
	// post: exchange the space and the element, and then check if the puzzle is 
	//		 finished after swaping it
	function swap(){
		// find the coordinate of the space
		var space = canMove(startingPosition(), parseInt(this.style.top) / 100, 
					parseInt(this.style.left) / 100);

		document.getElementById("step_text").innerHTML = parseInt(document.getElementById("step_text").innerHTML) + 
					1 + " step(s) used"; // update current step by 1
		exchange(space, this);
		// check if the puzzle is finished
		if(finished()){
			winnerMessage();
		}
	}

	// pre: space should the array the indicates the position of the space, and it should always
	//		have two items in space. element should take the element to exchange with the 
	//		position of the space
	// post: exchange the position of the space and that of the element, and update the hover
	//		 effect control 
	function exchange(space, element){
		var currentPositioning = startingPosition(); // get current dosplaying layout
		// get the current coordinates of element
		var now = [parseInt(element.style.top) / 100, parseInt(element.style.left) / 100];

		// put element to the position of the space
		currentPositioning[space[0]][space[1]] = 
			currentPositioning[now[0]][now[1]];
		// make the original position of the element a space
		currentPositioning[now[0]][now[1]] = BLANK_SPACE;
		// reset the position of the moved element to the right coordinates
		currentPositioning[space[0]][space[1]].style.left = space[1] * 100 + "px";
		currentPositioning[space[0]][space[1]].style.top = space[0] * 100 + "px";
		// check the hover effect
		markHover();
	}

	// pre: when we only need a 4 * 4 2D array
	// post: creates a 2D array all filled up with BLANK_SPACE
	function create2DArray(){
		var array = [];

		for(var i = 0; i < PUZZLE_SIZE; i++){
			array.push([]);
			for(var s = 0; s < PUZZLE_SIZE; s++){
				array[i].push(BLANK_SPACE);
			}
		}

		return array;
	}

	// pre: should use when there are puzzles displayed on the page
	// post: returns whether is puzzle is finished by checking if each puzzle is
	// 		 on its original position
	function finished(){
		var currentPosition = startingPosition(); // get the current displaied layout
		var original = document.querySelectorAll(".puzzle");

		for(var i = 0; i < original.length; i++){
			if(original[i] != currentPosition[parseInt(i / PUZZLE_SIZE)][i % PUZZLE_SIZE]){
																		// if the current is not
																		// in the original place
				return false; // not finished
			}
		}

		return true;
	}

	// pre: should be called only when the player finished the game
	// post: show the player the time and steps he\she used, and indicate the best
	//		 moves and time before they refresh the page
	function winnerMessage(){
		var music  = new Audio("win.mp3");
		var currentStatics = stopTimer();
		var div = document.createElement("div");
		var statics = document.createElement("div");

		music.play(); // play victory music
		document.getElementById("output").innerHTML = ""; //clean all message
		div.classList.add("win");
		div.innerHTML = "Congratulations Master Puzzle Solver!!! You've used " +
			currentStatics[0] + " second(s) and " + currentStatics[1] + " move(s).";
		statics.classList.add("win");
		statics.innerHTML = "Best Time Used: " + highScore + 
			"&nbsp &nbsp &nbsp Best moves: " + leastStep;
		document.getElementById("output").appendChild(statics);
		document.getElementById("output").appendChild(div);
	}

	// pre: the player pressed the start button and the puzzle finished shffuling
	// post: start counting time in seconds, call Timer() once per sec
	function startTimer(){
		var timerText = document.createElement("div");
		var stepText = document.createElement("div");
		
		// setting up timerText
		timerText.id = "timerText";
		timerText.classList.add("statics");
		timerText.innerHTML = "0 sec(s) used &nbsp &nbsp &nbsp ";
		// setting up stepText
		stepText.id = "step_text";
		stepText.classList.add("statics");
		stepText.innerHTML = "0 step(s) used";
		// add into HTML
		document.getElementById("output").appendChild(timerText);
		document.getElementById("output").appendChild(stepText);
		gameTimer = setInterval(timer, 1000);
	}

	// pre: when the player started the game by shuffling
	// post: update the timer by one second everytime it is called
	function timer(){
		document.getElementById("timerText").innerHTML = 
			parseInt(document.getElementById("timerText").innerHTML) + 1 + 
			" sec(s) used &nbsp &nbsp &nbsp ";
	}

	// pre: when the player finished the game by finished the puzzle
	// post: stop the counting timer, check if the used time is the best score, check the 
	//		 least used step, and returns the total used steps and total used time as a array
	//		 with two elements
	function stopTimer() {
		clearInterval(gameTimer); // stop the timer
		gameTimer = null;
		if(parseInt(document.getElementById("timerText").innerHTML) < highScore){ // if the user spend
																	 			  // less time
			//replace the old one
			highScore = parseInt(document.getElementById("timerText").innerHTML);
		}

		if(parseInt(document.getElementById("step_text").innerHTML) < leastStep){ // if step used in this 
																				  // round is smaller
			// replace the old one
			leastStep = parseInt(document.getElementById("step_text").innerHTML);
		}

		//return the time used in this round
		return [parseInt(document.getElementById("timerText").innerHTML), 
				parseInt(document.getElementById("step_text").innerHTML)];
	}

})();