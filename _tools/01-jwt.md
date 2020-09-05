---
title:  "JWT decoder"
permalink: /tools/jwt/
excerpt: "JSON Web Token viewer"
classes: wide
last_modified_at: 2020-04-16T01:10:31-02:00
---
<link rel="stylesheet" href="{{site.baseurl}}/assets/js/mike/codemirror/lib/codemirror.css">
<link rel="stylesheet" href="{{site.baseurl}}/assets/js/mike/codemirror/theme/night.css">
<link rel="stylesheet" href="{{site.baseurl}}/assets/js/mike/codemirror/addon/lint/lint.css">
<script type="text/javascript" src="{{site.baseurl}}/assets/js/mike/codemirror/lib/codemirror.js"></script>
<script type="text/javascript" src="{{site.baseurl}}/assets/js/mike/codemirror/mode/javascript/javascript.js"></script>
<script type="text/javascript" src="{{site.baseurl}}/assets/js/mike/codemirror/addon/display/placeholder.js"></script>
<script type="text/javascript" src="{{site.baseurl}}/assets/js/mike/codemirror/addon/mode/simple.js"></script>
<script type="text/javascript" src="{{site.baseurl}}/assets/js/mike/codemirror/addon/selection/mark-selection.js"></script>

<div class="jwt-left-split">
    <h2>Encoded JWT</h2>
    <textarea id="jwt-in" rows="13"></textarea>
</div>


<div class="jwt-right-split">
    <h2 class="ping-text">Header</h2>
    <textarea id="jwt-header" rows="4" name="jwt-header"></textarea>
</div>

<div class="jwt-right-split">
    <h2 class="blue-text">Payload</h2>
    <textarea id="jwt-payload" rows="5" name="jwt-payload"></textarea>
</div>

<!--  <div style="display: none"  class="jwt-right-split"> -->
<div class="jwt-right-split">
    <h2 class="orange-text">Signature</h2>
    <textarea id="jwt-signature" rows="2" name="jwt-signature" placeholder="<Paste the base64 encoded key used to sign / verify the jwt>"></textarea>
</div>

<script type="text/javascript" src="{{site.baseurl}}/assets/js/mike/jwt.js"></script>