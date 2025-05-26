---
title: "CSS Flex Box"
permalink: /notebook/css-flex-box/
excerpt: "Css Flex Box Cheat Sheet"
toc: true
toc_sticky: true
last_modified_at: 2025-02-02T10:00:00-04:00
---

Notes from the [Flexbox Zombies](https://mastery.games/flexboxzombies) course.

```css
.container {
    display: flex;
    flex-direction: row;
}
```

### Justify Content

.container {
display: flex;
justify-content: flex-start;
}

Controls the main axis. The main axis is defined by the flex-direction property. Default is row.

- `space-between` 
- `space-around`
- `flex-start`
- `flex-end`
- `center`

### Align Items

.container {
display: flex;
align-items: flex-start;
}

Controls the cross axis (that's the axis perpendicular to the main axis). The main axis is defined by the flex-direction
property.

- `flex-start` aligns items at the start of the cross axis. If the flex-direction is row (the default), it aligns items
  at the start
  of the vertical axis (that is, the first row). If the flex-direction is column, it aligns items at the start of the
  horizontal axis (that is, the first column).
- `flex-end` aligns items at the end of the cross axis. If the flex-direction is row, it aligns items at the end of the
  vertical axis (that is, the last row). If the flex-direction is column, it aligns items at the end of the
  horizontal axis (that is, the last column).
- `stretch` stretches the items to fill the container. If the flex-direction is row, it stretches the items to fill the
  vertical axis. If the flex-direction is column, it stretches the items to fill the horizontal axis.
- `center` aligns items at the center of the cross axis. If the flex-direction is row, it aligns items at the center of
  the vertical axis. If the flex-direction is column, it aligns items at the center of the horizontal axis.
- `baseline` aligns items at the baseline of the cross axis.

  Note that `align-self` overrides `align-items` for an individual item.

### Stretching

```css
.container {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
}
``` 
Streching is the ability to stretch an item to fill the available space. It's the default behavior of flex boxes.
The flex-direction row is also the default direction. So that's equivalent to:

```css
.container {
    display: flex;
}
```