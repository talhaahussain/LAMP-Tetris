<?php
session_start();
$server = "localhost";
$user = "talhaa";
$password = "WebDev2021";
$db = "tetris";
$conn = mysqli_connect($server, $user, $password, $db);

if (!$conn) {
    die("Connection error: " . mysqli_connect_error());
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
    <div class="form">
    <?php
    if (isset($_SESSION["loggedin"])) {
        echo "<h1>Welcome to Tetris!</h1>";
        echo "<p>";
        echo '<form action="/tetris.php"> <input type="submit" value="Click here to play!"> </form>';
    } else {
        echo '<form action="" method="post">

        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" placeholder="username"><br>
    
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" placeholder="password"><br>

        <input name="submit" type="submit">
        </form>';

        if (isset($_POST["username"]) && isset($_POST["password"])) {
            $username = $_POST["username"];
            $password = $_POST["password"];
            $sql = "SELECT * FROM Users WHERE username='$username' AND password='$password'";
            $results = mysqli_query($conn, $sql);
            if (isset($results) && mysqli_num_rows($results) == 0) {
                echo "Incorrect login details entered.";
                unset($_POST["username"]);
                unset($_POST["password"]);
            } else if (isset($results)) {
                $_SESSION["loggedin"] = true;
                $_SESSION["currentuser"] = $username;
                unset($_POST["username"]);
                unset($_POST["password"]);
                header("Refresh: 0");
            }
        }
        echo '<p>Don\'t have a user account? <a href="/register.php">Register now.</a>';
    }
    ?>
</div>
</div>
</body>
</html>