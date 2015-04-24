audio = {
    NUM_VOICES: 2,
    numChannels: 2,
    bitsPerSample: 8,
    sampleRate: 44100,
    voices: [],
    bpm: 190,
	power: 1,
	volume: 100,
	samplen: 100,
	fadeFactor: 100,
	harmonics: 1,
	harmonicsOffset: 20,
	noteCount: 40,
    times:[0,0],
    playing:false,
	fadeLength:0,
	leftNote:0,
	rightNote:0,
	onplay:null
};

audio.setup = function()
{
    function makeLoadNext(n)
	{
		return function()
		{
			if(audio.playing)
			{
				audio.times[n] = Date.now();
				audio.voices[n].src = audio.makeClip();
				setTimeout(function()
				{
					audio.voices[n].play();
				}, wav.soundLength/2);
			}
		};
	}
	function makePlay(n)
	{
		return function()
		{
			var time = Math.max(1, wav.soundLength - Date.now() + audio.times[n]);
			setTimeout(function()
			{
				audio.voices[n].play();
				if(audio.onplay != null)
				    audio.onplay();
			}, time);
		};
	}
	
	for(var i = 0; i < audio.NUM_VOICES; ++i)
	{
		audio.voices[i] = document.createElement("audio");
		audio.voices[i].id = "sound" + (i + 1);
		document.body.appendChild(audio.voices[i]);
		audio.voices[i].addEventListener("playing", makeLoadNext(audio.NUM_VOICES - i - 1));
		audio.voices[i].addEventListener("canplay", makePlay(i));
	}
}

audio.pianoFrequency = function(n)
{
	return 440 * Math.pow(2, (n - audio.noteCount / 2) / 12);
};

audio.makeSineSample = function(t, dt, n)
{
	var ratio = n * Math.PI / audio.sampleRate;
	var x = 0;
	if(t >= 0 && t < dt)
	{
		for(var h = 1; h <= audio.harmonics; ++h)
		x += Math.sin((t/h + h*audio.harmonicsOffset) * ratio);
		x /= audio.harmonics;
		x = (x<0?-1:1) * Math.pow(Math.abs(x), 1/audio.power);
		x *= Math.min(1, (Math.pow(2, t/audio.fadeLength)-1)/3)
		* Math.min(1, (Math.pow(2, (dt - t)/audio.fadeLength)-1)/3)
		* audio.volume * 0.95 / 100;
	}
	return x;
};

audio.makeClip = function()
{
    wav.setup(
        audio.numChannels,
        audio.bitsPerSample,
        audio.sampleRate,
        60000 / audio.bpm // sound length
    );
    audio.fadeLength = wav.numSamples * 0.125 * audio.fadeFactor / 100;
	var ret = null;
	var skip = (100 - audio.samplen) * wav.numSamples / 100;
	var fx = audio.pianoFrequency(audio.leftNote);
	var fy = audio.pianoFrequency(audio.rightNote);
	for(var t = 0; t < wav.numSamples; ++t)
	{
		var a = 2*t;
		var b = a+1;
		wav.data[a] = audio.makeSineSample(t - skip/2, wav.numSamples - skip, fx);
		wav.data[b] = audio.makeSineSample(t - skip/2, wav.numSamples - skip, fy);
	}
	ret = wav.encode8bit();
	return ret;
};