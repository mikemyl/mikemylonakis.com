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