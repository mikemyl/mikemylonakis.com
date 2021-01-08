

function parseJwt (base64Payload) {
    var base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    try {
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        var a = ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        return '%' + a;
    }).join(''));
        ret = JSON.parse(jsonPayload);
    } catch (e) {
        return undefined;
    }
    return ret;
}

CodeMirror.defineSimpleMode("jwtmode", {
    start: [
        {regex: /(^[A-Za-z0-9-_=]+)(\.)([A-Za-z0-9-_=]+)(\.?)([A-Za-z0-9-_.+/=]*$)/, token: ["jwt-header", null, "jwt-payload", null, "jwt-signature"], sol:true}
    ]
});

var defaultJwtIn = document.createElement("div", {});
defaultJwtIn.innerHTML = "<span class='ping-text'>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>.<span class='blue-text'>eyJzdWIiOiJmb28iLCJuYW1lIjoiTWlrZSIsImlhdCI6MTU4NjQ1NDA4OX0</span>.<span class='orange-text'>imk7ygr-4hCWAPheI-hlNG70lbYAPAX_d1hSwZcTGjc</span>";

var defaultHeaader = document.createElement("div", {});
defaultHeaader.innerHTML = `<div class="CodeMirror-code" role="presentation"><pre class=" CodeMirror-line " role="presentation"><span style="padding-right: 0.1px;" role="presentation">{</span></pre><pre class=" CodeMirror-line " role="presentation"><span style="padding-right: 0.1px;" role="presentation"> &nbsp;<span class="cm-string cm-property">"alg"</span>: <span class="cm-string">"HS256"</span>,</span></pre><pre class=" CodeMirror-line " role="presentation"><span style="padding-right: 0.1px;" role="presentation"> &nbsp;<span class="cm-string cm-property">"typ"</span>: <span class="cm-string">"JWT"</span></span></pre><pre class=" CodeMirror-line " role="presentation"><span style="padding-right: 0.1px;" role="presentation">}</span></pre></div>`

var defaultPayload = document.createElement("div", {});
defaultPayload.innerHTML = `<div class="CodeMirror-code" role="presentation" style=""><pre class=" CodeMirror-line " role="presentation"><span style="padding-right: 0.1px;" role="presentation">{</span></pre><pre class=" CodeMirror-line " role="presentation"><span style="padding-right: 0.1px;" role="presentation">  <span class="cm-string cm-property">"sub"</span>: <span class="cm-string">"foo"</span>,</span></pre><pre class=" CodeMirror-line " role="presentation"><span style="padding-right: 0.1px;" role="presentation">  <span class="cm-string cm-property">"name"</span>: <span class="cm-string">"Mike"</span>,</span></pre><pre class=" CodeMirror-line " role="presentation"><span style="padding-right: 0.1px;" role="presentation">  <span class="cm-string cm-property">"iat"</span>: <span class="cm-number">158645408</span> <span class="cm-comment jwt-comment">// Thu, 09 Apr 2020 17:41:29 GMT9</span></span></pre><pre class=" CodeMirror-line " role="presentation"><span style="padding-right: 0.1px;" role="presentation">}</span></pre></div>`;

var signature= ' Cannot verify the Signature without the key';

var jwtIn = document.getElementById("jwt-in");
var jwtHeader = document.getElementById("jwt-header");
var jwtPayload = document.getElementById("jwt-payload");
var jwtSignature = document.getElementById("jwt-signature");
var jwtInEditor = CodeMirror.fromTextArea(jwtIn, {theme: 'dracula', mode: 'jwtmode', viewportMargin: Infinity, autofocus: true, placeholder: defaultJwtIn, lineWrapping: true, minLines: 4 });
var jwtHeaderEditor = CodeMirror.fromTextArea(jwtHeader, {readOnly: true, theme: 'dracula', mode: "application/json",matchBrackets: true, viewportMargin: Infinity, placeholder: defaultHeaader, lineWrapping: true});
var jwtPayloadEditor = CodeMirror.fromTextArea(jwtPayload, {readOnly: true, theme: 'dracula', mode: "application/json",matchBrackets: true, viewportMargin: Infinity, placeholder: defaultPayload});
var jwtSignatureEditor = CodeMirror.fromTextArea(jwtSignature, {readOnly: 'nocursor', theme: 'dracula', mode: 'javascript', viewportMargin: Infinity, placeholder: signature, });

jwtSignatureEditor.setSize(null, '45px');

function parseUnixTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000)
    return date.toUTCString();
}

function setJwtHeader(input) {
    if (input === "") {
        jwtHeaderEditor.setValue("");
        return;
    }
    var headerPart = input.split('.')[0];
    var header = undefined;
    if (headerPart !== undefined) {
        header = parseJwt(headerPart);
    }
    if (header === undefined) {
        var ret = "Not a valid JWT header";
        jwtHeaderEditor.setValue(ret);
        jwtHeaderEditor.markText({line: 0, ch: 0}, {line: 0, ch: ret.length}, {className: 'red-bg'});
    }
    else {
        jwtHeaderEditor.setValue(JSON.stringify(header, null, 2));
    }
}

function setJwtPayload(input) {
    if (input === "") {
        jwtPayloadEditor.setValue("");
        return;
    }
    var payloadPart = input.split('.')[1];
    var payload = undefined;
    var ret = undefined;
    if (payloadPart !== undefined) {
        payload = parseJwt(payloadPart);
    }
    if (payload) {
        var iat = payload.iat;
        var exp = payload.exp;
        ret = JSON.stringify(payload, null, 2);
        jwtPayloadEditor.setValue(ret);
        var index = 0;
        jwtPayloadEditor.doc.eachLine( function (line) {
            var text = line.text;
            if (iat !== undefined && text.includes(iat)) {
                const dateTime = parseUnixTimestamp(iat);
                jwtPayloadEditor.replaceRange(" // " + dateTime, {line: index, ch: text.length}, {line: index, ch: text.length});
                const newText = line.text;
                jwtPayloadEditor.markText({line: index, ch: text.length}, {line: index, ch: newText.length}, {className: 'jwt-comment'})
                jwtPayloadEditor.markText({line: index, ch: text.length}, {line: index, ch: newText.length}, {atomic: true, selectLeft: true})
            }
            if (exp !== undefined && text.includes(exp)) {
                const dateTime = parseUnixTimestamp(exp);
                jwtPayloadEditor.replaceRange(" // " + dateTime, {line: index, ch: text.length}, {line: index, ch: text.length});
                const newText = line.text;
                jwtPayloadEditor.markText({line: index, ch: text.length}, {line: index, ch: newText.length}, {className: 'jwt-comment'})
                jwtPayloadEditor.markText({line: index, ch: text.length}, {line: index, ch: newText.length}, {atomic: true, selectLeft: true})
            }
            index++;
        })
    }
    else if (payloadPart) {
        ret = "Not a valid JWT payload";
        jwtPayloadEditor.setValue(ret);
        jwtPayloadEditor.markText({line: 0, ch: 0}, {line: 0, ch: ret.length}, {className: 'red-bg'});
    }
    else {
        ret = "N/A";
        jwtPayloadEditor.setValue(ret);
        jwtPayloadEditor.markText({line: 0, ch: 0}, {line: 0, ch: ret.length}, {className: 'red-bg'});
    }
}

jwtInEditor.on("change", function () {
    var text = jwtInEditor.getValue();
    if (text.includes("\n")) {
        jwtInEditor.setValue(jwtInEditor.getValue().replace("\n",""));
    }
    setJwtHeader(text);
    setJwtPayload(text);
});

document.getElementById("page-title").innerHTML = "<span class='ping-text'>J</span><span class='blue-text'>W</span><span class='orange-text'>T</span> decoder";
