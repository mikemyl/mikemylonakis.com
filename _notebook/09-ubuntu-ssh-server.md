---
title: "Ubuntu ssh server"
permalink: /notebook/ubuntu-ssh-server/
excerpt: "Changing the default ssh port on the latest Ubuntu"
toc: true
toc_sticky: true
last_modified_at: 2025-03-31T10:00:00-04:00
---

Apparently, ubuntu is using systemd-sockets for quite some time, so the way to change the default ssh port has changed.

Here's how do it:

- `touch /etc/systemd/system/ssh.socket.d/listen.conf`
- ```
  cat <<EOF > /etc/systemd/system/ssh.socket.d/listen.conf
  [Socket]
  ListenStream=
  ListenStream=14453
  EOF
  ```
  

That first `ListenStream=` is necessary to remove teh default port (22). If you don't do that, the ssh deamon will listen
on both port 22 and 14453 (in this example).

Source: https://serverfault.com/a/1159600