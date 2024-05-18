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
    <div class="bg">
    <?php
    $sql = "SELECT Username, Score FROM Scores ORDER BY Score DESC;";
    $results = mysqli_query($conn, $sql);
    if (isset($results)) {
        echo "<table class='leaderboardtable'><tr><th class='leaderboardheader'>Username</th><th class='leaderboardheader'>Score</th></tr>";
        while ($row = mysqli_fetch_assoc($results)) {
            echo "<tr><td class='leaderboardcell'>".$row["Username"]."</td><td class='leaderboardcell'>".$row["Score"]."</td></tr>";
        }
        echo "</table>";
    }
    ?>
    </div>
</div>
</body>
</html>