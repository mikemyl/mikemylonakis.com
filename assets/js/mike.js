$(".language-bash .highlight span.nv").each(function (index) {
    console.log($(this).text());
    if ($(this).text() === "$ " || $(this).text() === "# ") {
        $(this).css({
                "user-select": "none",
                "-moz-user-select": "none",
                "-webkit-user-select": "none",
                "-ms-user-select": "none"
            }
        )
    }
});

document.addEventListener("gumshoeActivate", function (event) {
  const target = event.target;
  const targetLink = target.querySelector(":scope > a[href]");
  if (!targetLink)
    // Precautionary check, so that we don't fall into unexpected errors
    return;
  const hash = targetLink.getAttribute("href");
  history.replaceState({}, "", hash);
});
