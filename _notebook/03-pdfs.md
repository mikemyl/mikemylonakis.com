---
title:  "PDF manipulation"
permalink: /notebook/pdfs/
excerpt: "PDF file manipulation (combine, compress, remove password)"
toc: true
toc_sticky: true
last_modified_at: 2019-08-1T12:20:31-04:00
---

## Combine images into a PDF file

Fist install ImageMagick ( `pacman -S imagemagick` on Arch Linux )

```bash
$ convert image1.jpg image2.jpg image3.jpg out.pdf
```

## Compress a PDF file

Fist install the ghostscript utility ( `pacman -S ghostscript` on Arch Linux )

```bash 
$ gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/printer -dNOPAUSE -dQUIET -dBATCH -sOutputFile=out.pdf in.pdf
```

<div class="notice--primary">
    <strong>Note</strong>: The compression factor can be adjusted with the -dPDFSETTINGS
     parameter like this:
     <ul>
        <li>/screen selects low-resolution output similar to the Acrobat Distiller "Screen Optimized" setting.</li>
        <li>/ebook selects medium-resolution output similar to the Acrobat Distiller "eBook" setting.</li>
        <li>/printer selects output similar to the Acrobat Distiller "Print Optimized" setting.</li>
        <li>/prepress selects output similar to Acrobat Distiller "Prepress Optimized" setting.</li>
        <li>/default selects output intended to be useful across a wide variety of uses, possibly at the  expense of a larger output file.</li>
     </ul>
</div>

## Encrypt / Decrypt PDF files

Fist install qpdf ( `pacman -S qpdf` on Arch Linux )

```bash
$ qpdf --password=pdf_password --decrypt password-protected.pdf out.pdf 
$ qpdf --encrypt user_password pdf_password key_length -- in.pdf out.pdf
```

## Extract pages from PDF file

Fist install qpdf ( `pacman -S qpdf` on Arch Linux )

```bash
$ qpdf --empty --pages in.pdf first-last -- out.pdf
```

## Combine multiple PDF files

Fist install qpdf ( `pacman -S qpdf` on Arch Linux )

```bash
$ qpdf --empty --pages first.pdf second.pdf third.pdf -- out.pdf
```