<?php
	$inData = getRequestInfo();
	
	//Parameters To Post Into MariaDB
	$name = $inData["Name"];
	$phone = $inData["Phone"];
	$email = $inData["Email"];
  
	//Start Connection To MariaDB Using Host, Special User, Users Password, Server Name
	$conn = new mysqli("localhost", "kingz", "imlameasf", "COP4331");

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (`Name`, Phone, Email) VALUES(?, ?, ?)");
		$stmt->bind_param("sss", $name, $phone, $email);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>