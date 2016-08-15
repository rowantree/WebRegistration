<?php

	$msg = "";
	foreach($_REQUEST as  $key => $value)
	{
		$msg .= "$key=$value;";
	}
	echo $msg;

?>