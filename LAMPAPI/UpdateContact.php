<?php

	$inData = getRequestInfo();
	
	$name = $inData["Name"];
	$phone = $inData["Phone"];
	$email = $inData["Email"];
  
	//Start Connection To MariaDB Using Host, Special User, Users Password, Server Name
	$conn = new mysqli("localhost", "kingz", "imlameasf", "COP4331");

	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET Phone = ?, Email = ? WHERE Name = ?");
		$stmt->bind_param("sss", $phone, $email, $name);
		$stmt->execute();

		if ($stmt->affected_rows > 0) {
			returnWithSuccess("Record updated successfully");
		} else {
			returnWithError("No records found to update.");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithSuccess($msg)
	{
		$retValue = '{"success":"' . $msg . '"}';
		sendResultInfoAsJson($retValue);
	}

?>
