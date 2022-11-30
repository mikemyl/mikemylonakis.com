---
title:  "DIY DynDns using GoDaddy's REST API"
excerpt: "How to set up your own dynamic DNS using a GoDaddy domain and its REST API"
header:
    teaser: /assets/images/posts/godaddy.webp
categories:
  - Networking
tags:
  - raspberrypi
  - automation
toc: true
toc_sticky: true
last_modified_at: 2021-06-10T07:06:41-02:00
---

![no-alignment]({{ site.url }}{{ site.baseurl }}/assets/images/posts/godaddy.webp)


## Introduction

For those of us who want to remotely access some device in our home network, there are really two 
options - either pay a premium for a static IP address, or use what is called
[Dynamic DNS](https://en.wikipedia.org/wiki/Dynamic_DNS). This
is because our public IP address can ( and will ) change for several reasons, so if we want to
access our home network we need to know what's the most recent IP that has been allocated to us.
Although there are several Dynamic DNS providers, their free tier usually includes ads and has
restrictions around the domain name format ( i.e. can only be something.mooo.com or
something.xyz.com - can't be our own domain ), the number of domains per user etc. In this post
I am showing how to utilize our own domain, [GoDaddy's REST API](https://developer.godaddy.com/)
and a raspberry pi, in order to have
our domain or a  [subdomain](https://en.wikipedia.org/wiki/Subdomain), point to our dynamic IP address. 

The idea is simple - we 'll first figure out what's our current public IP address and then use our domain
provider's REST API to update our domain to point to that IP. Then we 'll make sure that we
do these steps on a regular basis ( e.g. every 5 mins ) so that , when our dynamic IP changes, in
the worst case scenario we will say a stale IP address for 5 minutes at most.

## Using the REST API to create and update the Sub Domain

### Register for an API key

Before using the REST API, we must create an API key.
[developer.godaddy.com](https://developer.godaddy.com/) should have all the updated info on how to
get up and running with it. In the end we should have a key and its associated secret,
and we ll use them in the script that will be updating our domain.

### Use the go script to update the Domain

The go script that we 're going to use in order to update our public ip address can be found in 
[mikemylonakis.com/godydns](https://github.com/mikemylonakis.com/godyndns/). We can grab the latest binaries for our OS-architecture from
the [releases](https://github.com/mikemylonakis.com/godyndns/releases) and then we can run it like this:

```bash
$ ./godaddy-dyndns --api-key=<godaddy_api_key> --secret-key=<godaddy_secret_key> --domain=<godaddy_subdomain>
``` 

Upon successful completion, the script should print something like this:

```bash
$ ./godaddy-dydns --api-key=<GODADDY_API_KEY> --secret-key=<GODADDY_SECRET_KEY> --domain=<GODADDY_SUBDOMAIN>  
2020/07/19 13:47:51 Getting my public IP address from  http://ipinfo.io/ip ...
2020/07/19 13:47:52 My public IP is:<redacted>
2020/07/19 13:47:52 <redacted> is pointing to <redacted>. Will update it to point to <redacted>
```

Assuming everything worked correctly,  if we try to run that script again we should get a message
that the subdomain is already pointing to the right IP address. Something like that:
 
```bash
$ ./godaddy-dydns --api-key=<GODADDY_API_KEY> --secret-key=<GODADDY_SECRET_KEY> --domain=<GODADDY_SUBDOMAIN>  
2020/07/19 15:47:56 Getting my public IP address from  http://ipinfo.io/ip ...
2020/07/19 15:47:57 My public IP is:<redacted>
2020/07/19 15:47:58 <redacted> is already pointing to <redacted>. Won't update..
```  


### Create a systemd timer

Now let's make sure this script runs periodically so that our public IP stays up to date. In order
to do that:

1. Copy the script into `/usr/local/bin` :

    ```bash
$ sudo cp godaddy-dyndns /usr/local/bin/
    ```

2. Create the timer file `/etc/systemd/system/five-minute-timer.timer` with the following contents:

    ```ini
    [Unit]
    Description=Five Minute Timer
    
    [Timer]
    OnBootSec=5min
    OnCalendar=*:0/5
    Unit=five-minute-timer.service
    
    [Install]
    WantedBy=timers.target
    ```

3. Create the service unit file `/etc/systemd/system/five-minute-timer.service` with the
 following contents:
    
    ```ini
    [Unit]
    Description=Five Minute Timer Service
    
    [Service]
    Type=oneshot
    Environment=GODADDY_API_KEY=<godaddy-api-key> 
    Environment=GODADDY_SECRET_KEY=<godaddy-secret-key> 
    Environment=GODADDY_DOMAIN=<godaddy-subdomain> 
    ExecStart=/usr/local/bin/godaddy-dyndns
    
    [Install]
    WantedBy=multi-user.target
    ```

4. Start and enable the timer:

    ```bash
$ systemctl enable five-minute-timer.timer && systemctl start five-minute-timer.timer
    ```

5. Verify that the timer runs every 5 minutes and check the logs:

    ```bash
$ systemctl list-timers
$ journalctl -u five-minute-timer.service
    ```

## Conclusion

In this post we saw a free, DIY alternative to the paid Dynamic DNS services such as [FreeDNS](https://freedns.afraid.org/) ,
[Dyn](https://account.dyn.com/) and others. Using a raspberry pi, a utility script
from [mikemylonakis.com/godyndns](https://github.com/mikemylonakis.com/godyndns/) and a systemd timer we were able to 
stay up to date with our latest public IP address and update a domain, which we will be using
to access our home network. 
