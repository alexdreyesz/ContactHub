<?php

    // Test this on my pc. I used Bruno to test it and it is working as of now. Will tweak to our server when integrated.
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

    //retrieve data from front end
    $inData = getRequestData();

    //parameters to post into db
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
    else{
        //prepare is used to, the way i see it, in the databases query language. In this case, we are inserting into the database
        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, `Login`, Email, `Password`) VALUES (?, ?, ?, ?, ?)");
        //bind attaches our values to the query. The lowercase S's just say all these values are strings. 
        $stmt->bind_param("sssss", $firstName, $lastName, $login, $email, $password);

        if($stmt->execute()){
            //inserts the id into the db with the user
            $userID = $stmt->insert_id;
            echo json_encode(["userID" => $userID, "message" => "SUCCESS!!"]);
        }
        else{
            //DEBUGGING!!!!
            if($conn->errno == 1062){
                // error 1062 in mysql is a duplicate error, spent hours figuring this out -_-
                returnWithError("Duplicate Entry.. Which one?? IDK!");
            }
            else{
                returnWithError("Error:L Something Went Wrong" . $stmt->error);
            }
        }

        $stmt->close();
        $conn->close();
    }



?> 