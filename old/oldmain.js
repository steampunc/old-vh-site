

var value_list = ["Authentic", "Curious", "Responsibile"]; // "Knowledgable", "Wise", "Active", "Positive", "Loving"];

var drag_ordered_values = [];
var started_quiz = false;

var value_graph = new Digraph();

shuffleArray(value_list);

function getCombinations(items) {
	var result = [];
	for (var i = 0; i < items.length; i++) {
		for (var j = 0; j < i; j++) {
			if (i != j) {
				result.push([items[i], items[j]]);
			}
		}

	}
	return result;
}

var value_comparisons = getCombinations(value_list);
shuffleArray(value_comparisons);


function PopulateList(val_list, list_object) {
	list_object.empty();
	for (var i = 0; i < val_list.length; i++) {
		list_object.append("<li id=value>" + val_list[i] + "</li>");
	}
}

function AnimatedLeaveScreen(type) {

	var pos = 0;
	var id = setInterval(frame, 5);
	function frame() {
		if (pos == 35) {
			clearInterval(id);
			$("#left-centered").hide();
			$("#right-centered").hide();
			MoveToNextQuery(type);
		} else {
			pos++; 
			switch (type) {
				case "L":
					$("#left-centered").css({"top": "50%", "left": (50 - pos) + "%"}); 
					break;
				case "R":
					$("#right-centered").css({"top": "50%", "left": 50 +pos + "%"}); 
					break;
				case "D":
					$("#left-centered").css({"top": 50 + pos + "%", "left": "50%"}); 
					$("#right-centered").css({"top": 50 + pos + "%", "left": "50%"}); 
					break;
				case "U":
					$("#left-centered").css({"top": 50 - pos + "%", "left": "50%"}); 
					$("#right-centered").css({"top": 50 - pos + "%", "left": "50%"}); 
					break;

			}
		}
	}
}

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

function PerformAnalysis() {
	var canvas = document.getElementById("graphdisplay");	
	value_graph.display(canvas);
	ordered_values = {}
	for (let node of value_graph.getNodes()) {
		ordered_values[node] = value_graph.getEdges(node).length;
	}

	var node_elements = Object.keys(ordered_values).map(function(key) {
		return [key, ordered_values[key]];
	});	

	node_elements.sort(function(val1, val2) {
		return val1[1] - val2[1]; 
	});

	var ordered_nodes = [];
	for (let node of node_elements) {
		ordered_nodes.push(node[0]);
	}

	PopulateList(ordered_nodes, $("#new-list"));
	PopulateList(drag_ordered_values, $("#old-list"));

	var value_list_graph = new Digraph();
	for (var i = 0; i < drag_ordered_values.length; i++) {
		for (var j = i + 1; j < drag_ordered_values.length; j++) {
			value_list_graph.addEdge(value_list[j], value_list[i]);
		}
	}

	var percent_similar = value_list_graph.compare(value_graph) * 100;
	
	$("#larger").text("Your hierarchy similarity is " + percent_similar + "%"); 

}

var old_comparisons = []

function MoveToNextQuery(user_choice) {
	switch (user_choice) {
		case "L":
			value_graph.addEdge(current_comparison[1], current_comparison[0]);
			break;
		case "R":
			value_graph.addEdge(current_comparison[0], current_comparison[1]);
			break;
		case "D":
			break;
		default:
			break;

	}	

	if (value_comparisons.length == 0) {
		started_quiz = false;

		$( "#quiz-body" ).hide();
		$( "#post-quiz" ).show();
		PerformAnalysis();

	} else {
		current_comparison = value_comparisons[0];
		if (user_choice == "U") {
			console.log(value_comparisons.length);
			value_comparisons.push(old_comparisons.pop());
			console.log(value_comparisons.length);

		} else {
			
			old_comparisons.push(current_comparison);
		}

		shuffleArray(current_comparison);
		value_comparisons.shift();
		//shuffleArray(value_comparisons);


		$( "#counter").text("You have " + value_comparisons.length + " left.");
		$( "#left-value" ).text(current_comparison[0]);
		$( "#right-value" ).text(current_comparison[1]);	
		$("#left-centered").css({"top": "50%", "left": "50%"}); 
		$("#right-centered").css({"top": "50%", "left": "50%"}); 
		$("#left-centered").show();
		$("#right-centered").show();
	}
}


$(document).ready(function() {
	// Load list for initial part
	var vh_list = $( "#sortable" );
	vh_list.sortable();
	vh_list.disableSelection();

	$( "#quiz-instructions" ).hide();
	$( "#quiz-body" ).hide();
	$( "#post-quiz" ).hide();
	$( "#ordering-env" ).show();


	$( "#move-to-quiz-instructions" ).click(function() {
		$( "#ordering-env").hide();
		values = vh_list.children()
		for (var i = 0; i < values.length; i++) {
			drag_ordered_values.push(values[i].innerHTML);
		}
		console.log(drag_ordered_values);

		$( "#quiz-instructions").show();
	});

	$( "#start-quiz" ).click(function() {
		$( "#quiz-instructions").hide();
		$( "#quiz-body").show();
		console.log("Starting quiz");
		started_quiz = true;
		MoveToNextQuery("");

	});

	$( "#reset" ).click(function() {
		if (confirm("Are you sure? You will lose all your progress.")) {
			location.reload();
		}
	});

	PopulateList(value_list, vh_list);

} );

$(document).keydown(function(e) {
	if (started_quiz) {
		switch(e.which) {
			case 37: 
				AnimatedLeaveScreen("L");
				break;
			case 38:
				AnimatedLeaveScreen("U");
				break;
			case 39: 
				AnimatedLeaveScreen("R");
				break;
			case 40: 
				AnimatedLeaveScreen("D");
				break;
			case 72: AnimatedLeaveScreen("L");
				break;
			case 74: AnimatedLeaveScreen("D");
				break;
			case 75:
				AnimatedLeaveScreen("U");
				break;
			case 76: AnimatedLeaveScreen("R");
				break;


			default: return; // exit this handler for other keys
		}
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
});
