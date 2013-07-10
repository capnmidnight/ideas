<Query Kind="Statements" />

var r1 = 1000;
var r2 = 6800;
var c = 0.0000001;

Func<double, double, double, int> freq = (x, y, z) => 
	((int)(1.0/(Math.Log(2)*z*(x+2*y))));
	
var f = freq(r1, r2, c);

Console.WriteLine(f);

System.Console.Beep(f, 1000);