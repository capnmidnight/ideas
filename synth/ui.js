function load()
{
    audio.setup();
    
	//UI variables
	var scope = document.getElementById("scope");
	scope.style.width = scope.width + "px";
	scope.style.height = scope.height + "px";
	
	function makeDisplay(name, up, down, by)
	{
    	var display = document.getElementById(name);
    	document.addEventListener("keydown", function(event)
    	{
        	if(event.keyCode == up)
        	    eval("audio." + name + " += " + by);
        	else if(event.keyCode == down)
        	    eval("audio." + name + " -= " + by);
        	display.innerText = eval("audio." + name);
    	});
	}
	
	makeDisplay("bpm", 81, 65, 10);
	makeDisplay("power", 87, 83, 1);
	makeDisplay("volume", 69, 68, 10);
	makeDisplay("samplen", 82, 70, 10);
	makeDisplay("fadeFactor", 84, 71, 10);
	makeDisplay("harmonics", 89, 72, 1);
	makeDisplay("harmonicsOffset", 85, 74, 1);
	makeDisplay("noteCount", 73, 75, 10);

	
	document.addEventListener("keydown", function(event)
	{
		switch(event.keyCode)
		{
			case 32: //Spacebar
				audio.playing = !audio.playing
				if(audio.playing)
				{
					audio.voices[0].src = audio.makeClip();
					audio.voices[0].play();
				}
			break;
			default:
				console.log(event.keyCode);
			break;	
		}
	});

	var noteDisplay = document.getElementById("note");
    scope.addEventListener("mousemove", function(event)
	{
		var nx = Math.floor((event.clientX - scope.offsetLeft) * audio.noteCount / (scope.width + 10));
		var ny = Math.floor((event.clientY - scope.offsetTop) * audio.noteCount / (scope.height + 10));
		audio.leftNote = nx;
		audio.rightNote = ny;
		noteDisplay.innerText = nx + ", " + ny;
	});

	audio.onplay = function()
	{
		var g = scope.getContext("2d");
		g.fillStyle = "#000000";
		g.fillRect(0, 0, scope.width, scope.height);
		g.strokeStyle = "#00ff00";
		g.beginPath();
		g.moveTo(0, scope.height / 4);
		var sw = scope.width / wav.numSamples;
		for(var i = 0; i < wav.numSamples; ++i)
		{
			g.lineTo(i * sw, (wav.data[2*i] + 1) * scope.height / 4);
		}
		g.stroke();
		g.strokeStyle = "#00ffff";
		g.beginPath();
		g.moveTo(0, 3 * scope.height / 4);
		for(var i = 0; i < wav.numSamples; ++i)
		{
			g.lineTo(i * sw, (wav.data[2*i+1] + 3) * scope.height / 4);
		}
		g.stroke();

		g.strokeStyle = "#7f7f7f";
		var nw = scope.width / audio.noteCount;
		var nh = scope.height / audio.noteCount;
		for(var i = 0; i < audio.noteCount; i += 2)
		{
			g.strokeRect(i * nw, -1, nw, scope.height+2);
			g.strokeRect(-1, i * nh, scope.width+2, nh);
		}
        
        g.fillStyle = "rgba(255, 255, 255, 0.5)";
        g.fillRect(audio.leftNote * nw, 0, nw, scope.height);
        g.fillRect(0, audio.rightNote * nh, scope.width, nh);
	}
	audio.onplay();
}