---
title:  "Using docker behind an http proxy with authentication"
excerpt: "How to use docker behind an authenticated http proxy"
categories: 
  - Unix
tags:
  - docker
  - devops
  - golang
toc: true
toc_sticky: true
---


### Introduction

Web proxies are mostly used in corporate environments but can be useful on small offices / home offices as well. [Squid](http://www.squid-cache.org/)
is an example of a easy to install and configure proxy, that can help us achieve centralized control of the web traffic
in our home. Using an http_proxy from the client perspective is pretty simple, and comes down to specifying the proxy
address in the browser settings, but from an engineer perspective things are more interesting!

I have been playing a lot with docker lately and I had a really hard time in configuring it to use an authenticated
http(s) proxy, so I thought I 'd share my experience here.

### Environment variables

On Unix environments most applications respect the `http_proxy`, `https_proxy` environment variables. If we want to 
tell wget to use a proxy for instance, we would do something like that:

```bash
$ export https_proxy=http://<my_usename>:<my_password>@my_proxy.com
$ wget someurl.com
```

Docker, however, is a daemon and is managed by [systemd](https://wiki.archlinux.org/index.php/systemd) on the most
popular Linux distributions, so we need to configure these environment variables in a different way.

### Systemd directives

According to the [official documentation](https://docs.docker.com/config/daemon/systemd/), we should create a file 
`/etc/systemd/system/docker.service.d/http-proxy.conf` with the following contents:

```ini
[Service]
Environment="HTTP_PROXY=http://proxy.example.com:80/"
```

<p class="notice--info">
    <strong>Note:</strong> HTTP_PROXY doesn't have to be in uppercase. As per 
    <a href="https://golang.org/src/net/http/transport.go?s=13180:13237#L329">golang's documentation</a>
    the lowercase variants work as well.
</p>

This works fine, if the web proxy does not use authentication or, if it does use it, our credentials do not
contain special characters. If my password looks like this `MyAw3s0m3p^$$.!`, and I create the systemd configuration
file as instructed:

```ini
[Service]
Environment="http_proxy=http://myusername:MyAw3s0m3p^$$.!@proxy.example.com:80/"
```

docker won't be able to use the http_proxy. `docker pull` will fail miserably with an error like this:

```bash
$ docker pull hello-world
Error response from daemon: Get https://registry-1.docker.io/v2/: proxyconnect tcp: dial tcp: lookup http: no such host
```

There are two issues here. First of all, golang (which powers docker) doesn't like these special characters in the url. We
need to [urlencode](https://www.url-encode-decode.com/) this password. `http://myusername:MyAw3s0m3p^$$.!@proxy.example.com:80/`
becomes `http%3A%2F%2Fmyusername%3AMyAw3s0m3p%5E%24%24.%21%40proxy.example.com%3A80%2F`. But even the urlencoded url won't work,
cause systemd doesn't like the `%` and some other special characters in there. There is [systemd-escape](https://www.freedesktop.org/software/systemd/man/systemd-escape.html) 
which escapes strings for usage in systemd unit names, but this didn't work for me. My solution to that was to use the `EnironmentFile`
directive instead of the `Environment`. Instead of specifying the environment variables in the systemd configuration file,
we will create another file that systemd is going to read in order to load the environment variables. 

The `/etc/systemd/system/docker.service.d/http-proxy.conf` file becomes:
```ini
[Service]
EnvironmentFile=/etc/system/default/docker
```

And the `/etc/system/default/docker` file looks like this:

```
http_proxy='http%3A%2F%2Fmyusername%3AMyAw3s0m3p%5E%24%24.%21%40proxy.example.com%3A80%2F'
```

This is a good practice btw, as we can restrict the permissions to that file so that it's not readable by the world. If
we want to include passwords in our environment variables we wouldn't want some unauthorized user to be able to view our
passwords by looking at the systemd configuration file or by using `systemctld show docker` for instance. Let's do that
and restrict access to this file:

```bash
$ chgrp docker /etc/default/docker   # change group owner to docker
$ chmod o-r /etc/default/docker      # remove read access from ppl not in the docker group
```


Having made the changes above, we reload - restart the docker service and everything works as expected.

```bash
$ systemctl daemon-reload
$ systemctl restart docker
```

### Conclusion

We saw that golang needs the urls in an encoded form when special characters are included. We also noticed that systemd
cannot read these encoded urls when specified in its configuration files using the `Environment` directive, and we used
the `EnvironmentFile` instead with a new file that contains our environment variables under `/etc/default/docker`. Finally,
we restricted access to that file so that only members of the docker group can read it.