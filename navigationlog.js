var point=0;

function add_point()
{
	var numFields = document.getElementById("logTable").rows[0].cells.length;
	var cell = new Array();
	var table = document.getElementById("logTable");
	var row = table.insertRow(-1);
	
	for (var i=0; i<numFields; i++)
	{
		cell[i] = row.insertCell(i);
	}

	i = 0;
	cell[i++].innerHTML = "<input type=\"text\" id=\"name" + point + "\" size=\"20\" maxlength=\"20\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"altitude" + point + "\" size=\"5\" maxlength=\"5\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"windDir" + point + "\" size=\"3\" maxlength=\"3\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"windVel" + point + "\" size=\"3\" maxlength=\"3\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"tas" + point + "\" size=\"3\" maxlength=\"3\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"tc" + point + "\" size=\"3\" maxlength=\"3\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"wca" + point + "\" size=\"3\" readonly>";
	cell[i++].innerHTML = "<input type=\"text\" id=\"th" + point + "\" size=\"3\" readonly>";
	cell[i++].innerHTML = "<input type=\"text\" id=\"var" + point + "\" size=\"3\" maxlength=\"3\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"mh" + point + "\" size=\"3\" readonly>";
	cell[i++].innerHTML = "<input type=\"text\" id=\"dev" + point + "\" size=\"3\" maxlength=\"3\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"ch" + point + "\" size=\"3\" readonly style=\"background:#ff0\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"dist" + point + "\" size=\"4\" maxlength=\"4\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"gs" + point + "\" size=\"3\" readonly>";
	cell[i++].innerHTML = "<input type=\"text\" id=\"time" + point + "\" size=\"5\" readonly style=\"background:#ff0\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"gph" + point + "\" size=\"3\" maxlength=\"3\">";
	cell[i++].innerHTML = "<input type=\"text\" id=\"fuel" + point + "\" size=\"3\" readonly>";

	point++;
}

function calculate()
{
	/* auto-complete the missing cells */
	for (var i=1; i<point; i++)
	{
		/* altitude */
		if (document.getElementById('altitude'+i).value == '')
			document.getElementById('altitude'+i).value = document.getElementById('altitude'+(i-1)).value;

		/* wind direction */
		if (document.getElementById('windDir'+i).value == '')
			document.getElementById('windDir'+i).value = document.getElementById('windDir'+(i-1)).value;

		/* wind velocity */
		if (document.getElementById('windVel'+i).value == '')
			document.getElementById('windVel'+i).value = document.getElementById('windVel'+(i-1)).value;

		/* true airspeed */
		if (document.getElementById('tas'+i).value == '')
			document.getElementById('tas'+i).value = document.getElementById('tas'+(i-1)).value;

		/* true course */
		if (document.getElementById('tc'+i).value == '')
			document.getElementById('tc'+i).value = document.getElementById('tc'+(i-1)).value;

		/* magnetic variation */
		if (document.getElementById('var'+i).value == '')
			document.getElementById('var'+i).value = document.getElementById('var'+(i-1)).value;

		/* magnetic deviation */
		if (document.getElementById('dev'+i).value == '')
			document.getElementById('dev'+i).value = document.getElementById('dev'+(i-1)).value;

		/* gallons per hour */
		if (document.getElementById('gph'+i).value == '')
			document.getElementById('gph'+i).value = document.getElementById('gph'+(i-1)).value;
	}

	/* calculate the navigation info */
	for (var i=0; i<point; i++)
	{
		var wind_dir = Number(document.getElementById('windDir'+i).value);
		var wind_vel = Number(document.getElementById('windVel'+i).value);
		var true_airspeed = Number(document.getElementById('tas'+i).value);
		var true_course = Number(document.getElementById('tc'+i).value);

		var wind_angle = 90-(wind_dir+180);
		var course_angle = 90-true_course;
		var cos_var = Math.cos(Math.PI*(wind_angle-course_angle)/180);
		var ground_speed = wind_vel * cos_var + Math.sqrt(wind_vel*wind_vel*(cos_var*cos_var-1)+true_airspeed*true_airspeed);
		var true_heading1 = (450-180*Math.acos((ground_speed * Math.cos(Math.PI*course_angle/180) - wind_vel * Math.cos(Math.PI*wind_angle/180))/true_airspeed)/Math.PI)%360;
		var true_heading2 = 90+180*Math.acos((ground_speed * Math.cos(Math.PI*course_angle/180) - wind_vel * Math.cos(Math.PI*wind_angle/180))/true_airspeed)/Math.PI;
		
		if (Math.abs(true_heading1-true_course) < Math.abs(true_heading2-true_course))
			true_heading = true_heading1;
		else
			true_heading = true_heading2;

		var wca = true_heading - true_course;
		var magnetic_variation = Number(document.getElementById('var'+i).value);
		var magnetic_heading = true_heading + magnetic_variation;
		var magnetic_deviation = Number(document.getElementById('dev'+i).value);
		var compass_heading = magnetic_heading + magnetic_deviation;
		var distance = Number(document.getElementById('dist'+i).value);
		var time = 60*distance/ground_speed;
		var gallons_per_hour = Number(document.getElementById('gph'+i).value);
		var fuel = gallons_per_hour*time/60;

		document.getElementById('wca'+i).value = Math.round(wca);
		document.getElementById('th'+i).value = Math.round(true_heading);
		document.getElementById('mh'+i).value = Math.round(magnetic_heading);
		document.getElementById('ch'+i).value = Math.round(compass_heading);
		document.getElementById('gs'+i).value = Math.round(ground_speed);
		document.getElementById('time'+i).value = String('0'+Math.floor(time)).slice(-2) + '\':' + String('0'+Math.round((time-Math.floor(time))*60)).slice(-2) + '\"';
		document.getElementById('fuel'+i).value = Math.round(fuel*100)/100;
	}
}