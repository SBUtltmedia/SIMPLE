<?php 
        $p = $_GET['p'];
        if ($p == "processor" ||
            $p == "home" || 
            $p == "online_examples" ||
            $p == "preparing_your_photo" ||
            $p == "simpl_uploader" ||
            $p == "downloads") {
                $file_name = "includes/pages/" . $p . ".php";}
        else {
                $file_name = "includes/pages/home.php";
      }
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xml:lang="en">

<head>
<title>SIMPLE</title>
<meta http-equiv="Content-Language" content="en-gb" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<link rel="stylesheet" type="text/css" href="includes/style.css" />
</head>
<body>
<div id="container">
 <div id="header">
  <ul id="navul">
   <li class="navli"><a class="navlink" href="?p=home">Home</a></li>
   <li class="navli"><a class="navlink" href="?p=online_examples">Online Examples</a></li> 
   <li class="navli"><a class="navlink" href="?p=preparing_your_photo">Preparing Your Photo</a></li>
   <li class="navli"><a class="navlink" href="?p=simpl_uploader">SIMPLE Uploader</a></li>
   <li class="navli"><a class="navlink" href="?p=downloads">Downloads</a></li>
  </ul>
 </div>
<div id="slideshow">
<img src="includes/SIMPLbanner760x60.png" width="760" height="60">
</div>
<div id="main">
  <?php include($file_name) ?>
</div>
</div>
</body>
</html>
