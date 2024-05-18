<?php
session_start();
$server = "localhost";
$user = "talhaa";
$password = "WebDev2021";
$db = "tetris";
$conn = mysqli_connect($server, $user, $password, $db);

if (!$conn) {
    die("Connection error:" . mysqli_connect_error());
}
?>
<html>
<head>
<link rel="stylesheet" href="style.css">
</head>
<body>
<ul>
    <li style="float:left"><a href="index.php">Home</a></li>
    <li><a href="leaderboard.php">Leaderboard</a></li>
    <li><a href="tetris.php">Play Tetris</a></li>
</ul>
<div class="main">
    <div class="bg">
<form action="" method="post">
    <label for="fname">First Name:</label><br>
    <input type="text" id="fname" name="fname" placeholder="First name"><br>

    <label for="lname">Last name:</label><br>
    <input type="text" id="lname" name="lname" placeholder="Last name"><br>

    <label for="username">Username:</label><br>
    <input type="text" id="username" name="username" placeholder="Username"><br>

    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password" placeholder="Password"><br>

    <label for="confirmpassword">Confirm password:</label><br>
    <input type="password" id="confirmpassword" name="confirmpassword" placeholder="Confirm password"><br>

    <p>Display score on leaderboard?</p>
    <input type="radio" id="yes" name="display" value="Yes">
    <label for="yes">Yes</label><br>

    <input type="radio" id="no" name="display" value="No">
    <label for="no">No</label><br>

    <input name="submit" type="submit">
</form>
<?php
if (isset($_POST["submit"])) {
    if (empty($_POST["fname"]) || empty($_POST["lname"]) || empty($_POST["username"]) || empty($_POST["password"]) || empty($_POST["confirmpassword"]) || empty($_POST["display"])) {
        $error = "One or more of the above fields are empty.";
        echo($error);
    } elseif ($_POST["password"] != $_POST["confirmpassword"]) {
        $error = "Passwords do not match.";
        echo($error);
    } else {
        $fname = $_POST["fname"];
        $lname = $_POST["lname"];
        $username = $_POST["username"];
        $password = $_POST["password"];
        if ($_POST["display"] == "Yes") {
            $display = 1;
        } else {
            $display = 0;
        }
        $sql = "INSERT INTO Users (UserName, FirstName, LastName, Password, Display) 
        VALUES ('$username', '$fname', '$lname', '$password', '$display');";
        if (mysqli_query($conn, $sql)) {
            echo "Registration successful! You are now logged in.";
        } else {
            echo "There was an error signing you up. Please try again.";
        }
        $_SESSION["loggedin"] = true;
        $_SESSION["currentuser"] = $username;
    }
}
?>
</div>
</div>
</body>
</html>