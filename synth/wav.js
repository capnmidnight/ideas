function WAVFile(numChannels, bitsPerSample, sampleRate)
{
    this.numChannels = numChannels;
    this.sampleRate = sampleRate;
    this.bitsPerSample = bitsPerSample;
    this.blockAlign = bitsPerSample * numChannels / 8;
    this.decimalToIntegerScaleFactor = Math.pow(2, bitsPerSample) / 2;
    
    if(WAVFile.prototype.timeToSamples == undefined)
    {
        var encInt8 = function (v){ return String.fromCharCode(v & 0xff); }
        var encInt16 = function(v){ return encInt8(v) + encInt8(v >> 8); }
        var encInt32 = function(v){ return encInt16(v) + encInt16(v >> 16); }
        WAVFile.prototype.calcNumSamplesForTime = function(time)
        {
            return Math.ceil(this.sampleRate * time / 1000);
        };
        WAVFile.prototype.encode8bit = function(data)
        {
        	// 8-bit mono WAVE header. For details, see http://www.sonicspot.com/guide/wavefiles.html
        	var header = "RIFF"				// RIFF is the real file format name.
        	+ encInt32(36 + this.data.length)	// The full size of the file. 4 for "WAVE" + 4 for "fmt " + 4 for the size of the length of the format chunk + the length of the format chunk + 4 for "data" + 4 for the size of the length of the data chunk + the length of the data chunk
        	+ "WAVE"						// We're encoding WAVEforms.
        	+ "fmt " 						// Format chunk.
        	+ encInt32(16) 					// 		The length of the format chunk. Count 2 for every encInt16 and 4 for every encInt32.
        	+ encInt16(1)		 			// 		Compression format: 1 = Pulse-Code Modulation, no compression.
        	+ encInt16(2)            		// 		Number of channels. Default to stereo
        	+ encInt32(this.sampleRate)		 	// 		Sample Rate
        	+ encInt32(this.sampleRate * this.blockAlign)		// 		Average bytes per second to send to the DAC. AvgBytesPerSec = SampleRate * BlockAlign
        	+ encInt16(this.blockAlign)			// 		Block align = Significant Bits per Sample * number of channels / 8
        	+ encInt16(this.bitsPerSample)		// 		Significant bits per sample, in our case, 8-bit.
        	+ "data" 						// Data chunk:
        	+ encInt32(this.data.length);		//		The length of the data chunk. For 8-bit sound, it's the same as our number of samples.
        
        	// Output sound data
        	for (var i = 0; i < this.data.length; ++i) 
        	{
        		var sample = Math.floor((Math.min(1, Math.max(-1, this.data[i])) + 1) * this.decimalToIntegerScaleFactor);
        		header += encInt8(sample);
        	}
          
        	return 'data:audio/wav;base64,' + btoa(header);
        };
    }
    this.setSoundLength(soundLength);
}

var wav = {};
wav.timeToSamples = function(time)
{
    return Math.ceil(wav.sampleRate * time / 1000);
};

wav.setup = function(numChannels, bitsPerSample, sampleRate, soundLength)
{
    wav.numChannels = numChannels;
    wav.sampleRate = sampleRate;
    wav.bitsPerSample = bitsPerSample;
    wav.blockAlign = bitsPerSample * numChannels / 8;
    wav.decimalToIntegerScaleFactor = Math.pow(2, bitsPerSample) / 2;
    wav.soundLength = soundLength;
    wav.numSamples = wav.timeToSamples(wav.soundLength);
    wav.data = new Array(wav.numSamples*wav.numChannels);
};

wav.encode8bit = function()
{
	function encInt8(v){ return String.fromCharCode(v & 0xff); }
	function encInt16(v){ return encInt8(v) + encInt8(v >> 8); }
	function encInt32(v){ return encInt16(v) + encInt16(v >> 16); }

	// 8-bit mono WAVE header. For details, see http://www.sonicspot.com/guide/wavefiles.html
	var header = "RIFF"				// RIFF is the real file format name.
	+ encInt32(36 + wav.data.length)	// The full size of the file. 4 for "WAVE" + 4 for "fmt " + 4 for the size of the length of the format chunk + the length of the format chunk + 4 for "data" + 4 for the size of the length of the data chunk + the length of the data chunk
	+ "WAVE"						// We're encoding WAVEforms.
	+ "fmt " 						// Format chunk.
	+ encInt32(16) 					// 		The length of the format chunk. Count 2 for every encInt16 and 4 for every encInt32.
	+ encInt16(1)		 			// 		Compression format: 1 = Pulse-Code Modulation, no compression.
	+ encInt16(wav.numChannels) 		// 		Number of channels. Stereo would require interleaving that would be a bother to code for such a simple toy.
	+ encInt32(wav.sampleRate)		 	// 		Sample Rate
	+ encInt32(wav.sampleRate * wav.blockAlign)		// 		Average bytes per second to send to the DAC. AvgBytesPerSec = SampleRate * BlockAlign
	+ encInt16(wav.blockAlign)			// 		Block align = Significant Bits per Sample * number of channels / 8
	+ encInt16(wav.bitsPerSample)		// 		Significant bits per sample, in our case, 8-bit.
	+ "data" 						// Data chunk:
	+ encInt32(wav.data.length);		//		The length of the data chunk. For 8-bit sound, it's the same as our number of samples.

	// Output sound data
	for (var i = 0; i < wav.data.length; ++i) 
	{
		var sample = Math.floor((Math.min(1, Math.max(-1, wav.data[i])) + 1) * wav.decimalToIntegerScaleFactor);
		header += encInt8(sample);
	}
  
	return 'data:audio/wav;base64,' + btoa(header);
};