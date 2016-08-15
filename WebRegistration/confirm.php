<?php

/*
	This is a comment
*/

	echo "<table border=1>";
	foreach( $_POST as $key => $value )
	{
		echo "<tr><th>$key</th><td>$value</td></tr>";
	}
	echo "</table>";


?>
