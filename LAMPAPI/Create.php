<?php

    $inData = getRequestData();

    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $login = $inData["Login"];
    $email = $inData["Email"];
    $password = $inData["Password"];

    //start connection to DB using host(server), db user, db password, db name
    $conn = new mysqli("localhost", "kingz", "imlameasf", "COP4331");

    if($conn->connect_error){
        returnWithError("Couldnt Connect to DB: " . $conn->connect_error);
    } 
    else
    {
        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, `Login`, Email, `Password`) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $firstName, $lastName, $login, $email, $password);

        if($stmt->execute()){
            $userID = $stmt->insert_id;
            echo json_encode(["userID" => $userID, "message" => "SUCCESS!!"]);
        }
        else{
            returnWithError("Error From Table!");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestData(){
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInforAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err){
        $retValue = json_encode(["error" => $err]);
        sendResultInforAsJson($retValue);
        exit();
    }

?> 