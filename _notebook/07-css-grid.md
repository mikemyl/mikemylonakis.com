---
title:  "CSS Grid"
permalink: /notebook/css-grid/
excerpt: "Css Grid Cheat Sheet"
toc: true
toc_sticky: true
last_modified_at: 2025-01-17T10:00:00-04:00
---

Notes from the [Grid Critters](https://mastery.games/gridcritters) course.

```css
.container {
    display: grid;
    grid-template-columns: 1fr [side-start] 100px 100px 100px [side-end];
    grid-template-rows: 1fr [bottom-start] 100px 100px 100px [bottom-end];
}
```

- `grid-template-columns` and `grid-template-rows` define the grid tracks
- `fr` is a unit that represents a fraction of the available space.
- `[]` is a named grid line. It can be used to reference the line in the grid-template-areas property.
- `[side-start]` and `[side-end]` are named grid lines. The `-start` and `-end` are special, in that they let us
    define a range like that:
   ```css
      .container {
        display: grid;
        grid-template-columns: 1fr [side-start] 100px 100px 100px [side-end];
      }
      .content {
        grid-column: side;
        /* That's equivalent to */
        grid-column: side-start / side-end;
        /* that's equivalent to */
        grid-column: 1 / 4;
        /* that's equivalent to */
        grid-column: 1 / span 4;
        /* that's equivalent to */
        grid-column: 1 / -1;
        /* that's equivalent to */
        grid-column-start: 1;
        grid-column-end: 4;
        /* that's equivalent to */
        grid-column-start: side-start;
        grid-column-end: side-end;
  
        /* Exactly the same applies to grid-row */
      }
   ```
- `grid-area` is a shorthand for `grid-row-start`, `grid-column-start`, `grid-row-end`, and `grid-column-end`.
   Or alternatively, a shorthand for `grid-row` and `grid-column`.
- If we give the same name to both the row and column, we can use that single name in the `grid-area` property to place  
  the item in the grid.
  ```css
  .container {
    display: grid;
    grid-template-columns: 1fr [center-start] 1fr 1fr [center-end] 1fr;
    grid-template-rows: 1fr [center-start] 1fr 1fr [center-end] 1fr;
  }
  .content {
    grid-area: center;
    /* That's equivalent to */
    grid-area: center / center;
    /* that's equivalent to */
    grid-area: center-start / center-start / center-end / center-end;
    /* that's equivalent to */  
  }
  ```
- `grid-template-areas` lets us give names to the grid cells. If we don't want to give a name to a cell, we can use the `.` character.
    ```css
    .container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      grid-template-areas:
        ".   .    ."
        ". center ."
        ".   .    .";
    /* The above still names the grid lines (for both rows and columns) - center-start, center-end. This is how it creates that cell area */
    }
    .content {
      grid-area: center;
    }
    ```
