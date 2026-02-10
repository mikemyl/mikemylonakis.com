---
title: "Tmux cheatsheet"
permalink: /notebook/tmux/
excerpt: "Tmux shortcuts and commands"
toc: true
toc_sticky: true
last_modified_at: 2026-02-10T10:00:00-04:00
---
# Tmux shortcuts and commands

All shortcuts assume the default prefix `Ctrl-a` (shown as `C-a`).

## Sessions

| Action | Shortcut / Command |
|---|---|
| New session | `tmux new -s name` |
| Detach | `C-a d` |
| List sessions | `C-a s` |
| Switch to previous session | `C-a (` |
| Switch to next session | `C-a )` |
| Switch to last session | `C-a L` |
| Switch by name | `tmux switch-client -t name` |
| Rename current session | `C-a $` |

## Windows

| Action | Shortcut / Command |
|---|---|
| New window | `C-a c` |
| List / pick window | `C-a w` |
| Next window | `C-a n` |
| Previous window | `C-a p` |
| Last (most recent) window | `C-a l` |
| Switch by number | `C-a 0-9` |
| Switch by name | `:select-window -t name` |
| Rename window | `C-a ,` |
| Close window | `C-a &` |

## Panes

| Action | Shortcut / Command |
|---|---|
| Split vertical (left/right) | `C-a %` |
| Split horizontal (top/bottom) | `C-a "` |
| Navigate panes | `C-a ←↑↓→` |
| Cycle panes | `C-a o` |
| Toggle zoom (fullscreen pane) | `C-a z` |
| Resize pane | `C-a C-←↑↓→` (hold Ctrl) |
| Close pane | `C-a x` |
| Show pane numbers + jump | `C-a q` then press number |
| Convert pane to window | `C-a !` |

## Fuzzy finding with fzf

Tmux's built-in pickers (`C-a s`, `C-a w`) are functional but basic. You can wire up **fzf** for a much nicer experience.

### Setup

Add these to your `~/.tmux.conf`:

```bash
# Fuzzy switch session
bind S display-popup -E "tmux list-sessions -F '#{session_name}' | fzf --reverse | xargs tmux switch-client -t"

# Fuzzy switch window (across all sessions)
bind W display-popup -E "tmux list-windows -a -F '#{session_name}:#{window_index} #{window_name}' | fzf --reverse | cut -d' ' -f1 | xargs tmux switch-client -t"
```

Then reload with `tmux source-file ~/.tmux.conf`.

| Action | Shortcut |
|---|---|
| Fuzzy switch session | `C-a S` |
| Fuzzy switch window | `C-a W` |

> **Requires:** `fzf` installed and tmux 3.2+ (for `display-popup`). On older tmux, replace `display-popup -E` with `new-window`.