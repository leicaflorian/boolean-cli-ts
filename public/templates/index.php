<?php
  // Your php code here
?>

<!DOCTYPE html>
<html lang="it">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon" href="imgs/favicon.ico" type="image/x-icon">
  <link rel="icon" href="imgs/favicon.ico" type="image/x-icon">

  <title>{{title}}</title>

  {{#libraries.length}} {{! Show all if any library to add !}}
  <!-- Third party libraries -->
  {{#libraries}}
  {{#isLink}}
  <link rel="stylesheet" href="{{{src}}}">
  {{/isLink}}
  {{#isScript}}
  <script src="{{{src}}}"></script>
  {{/isScript}}
  {{/libraries}}
  {{/libraries.length}}

  {{#css}}
  <!-- Custom css -->
  <link rel="stylesheet" href="css/{{cssFileName}}">
  {{/css}}
</head>

<body>

{{#hasVue}}
<div id="app">
  {{#hasBS}}
  <main class="container pb-5">
    <h1 class="my-5">{{title}}</h1>
    <!-- your code -->
  </main>
  {{/hasBS}}
  {{^hasBS}}
  <!-- your code -->
  {{/hasBS}}
</div>
{{/hasVue}}
{{^hasVue}}
{{#hasBS}}
<main class="container pb-5">
  <h1 class="my-5">{{title}}</h1>
  <!-- your code -->
</main>
{{/hasBS}}
{{^hasBS}}
<!-- your code -->
{{/hasBS}}
{{/hasVue}}

{{#js}}
<script src="js/{{jsFileName}}"></script>
{{/js}}
</body>

</html>
