<?php

	$inData = getRequestInfo();

	error_log(json_encode($inData));
	
	$searchResults = "";
	$searchCount = 0;

	//Start Connection To MariaDB Using Host, Special User, Users Password, Server Name
	$conn = new mysqli("localhost", "kingz", "imlameasf", "COP4331");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT Name, Phone, Email FROM Contacts WHERE Name LIKE ? AND UserId = ?");
		$contactName = "%" . $inData["Name"] . "%";
		$stmt->bind_param("si", $contactName, $inData["UserId"]);
		$stmt->execute();

		$result = $stmt->get_result();

		$searchResults = "";
		$searchCount = 0;

		while ($row = $result->fetch_assoc()) {
			if ($searchCount > 0) {
				$searchResults .= ",";
			}
			$searchCount++;

			// Add Name, Phone, and Email to the results
			$searchResults .= '{"Name":"' . $row["Name"] . '", "Phone":"' . $row["Phone"] . '", "Email":"' . $row["Email"] . '"}';
		}

		if ($searchCount == 0) {
			returnWithError("No Records Found");
		} else {
			returnWithInfo($searchResults);
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>