---
title:  "Setting up the Unix Password Manager on Android with YubiKey 5 NFC"
excerpt: "How to set up the Unix Password manager on android using a YubiKey 5 NFC"
header:
    teaser: /assets/images/posts/yubikey.webp
categories: 
  - Cryptography
tags:
  - yubikey
  - openpgp
  - crypto
  - gpg
toc: true
toc_sticky: true
---

![no-alignment]({{ site.url }}{{ site.baseurl }}/assets/images/posts/yubikey.webp)

## Introduction

Having used the [unix password manager]({% post_url 2018-01-30-unix-pass %}) for a while I managed to have a simple,
secure and powerful password manager that makes my passwords available on every computer that I use.
However, there is still something that's missing: making my passwords available on my Android phone. 

In this post I will address this issue by describing how to utilize the new [YubiKey 5 NFC](https://www.yubico.com/product/yubikey-5-nfc/),
an Android phone with NFC reader and the apps
[Openkeychain](https://www.openkeychain.org/) and [Password Store](https://play.google.com/store/apps/details?id=com.zeapo.pwdstore&hl=en_US) 
in order to bring the power of the Unix Password Manager into Android. Let's start!

## Setting up the YubiKey

First of all, let me explain why a YubiKey is needed. So if we want to use the Unix password manager on an Android phone,
we need to be able to decrypt the files that contain our passwords. Now we can do that by copying the private encryption
key into the Android phone but IMHO, putting the private key in an phone is not a very good idea. That's were YubiKey comes into
the picture. Using the new [YubiKey 5 NFC](https://www.yubico.com/product/yubikey-5-nfc/) or the older
[YubiKey Neo](https://support.yubico.com/support/solutions/articles/15000006494-yubikey-neo) we can have them store our
private key(s), making them available to the phone only when needed, via NFC.

Setting up the YubiKey with OpenPGP is quite easy, following the instructions on [Yubico's](https://support.yubico.com/support/solutions/articles/15000006420-using-your-yubikey-with-openpgp)
website. Assuming that we have an encryption subkey with id `1F077BAE` ( have a look on my [previous post]({% post_url 2018-01-30-unix-pass %}#create-a-pgp-key) ):

1.  Create a backup of the encryption key and keep it in a safe location, in case the YubiKey is lost or stolen:
   
    ```bash
    $ gpg --output 1F077BAE-bak.asc --export-secret-subkeys --armor 1F077BAE!
    ```

    <p class="notice--info">
        <strong>Note</strong>: This will export only the encryption key, as if it is decoupled from its main key. Don't forget the "!" in the end.
    </p>
   
2.  With the YubiKey plugged in:

    ```bash
    $ gpg --edit-key 1F077BAE
    $ key 1                     # Depending on the number of subkeys, the number 1 may be different
    $ keytocard                 # Key password and YubiKey admin pin are needed for this step
    ```

Here's a asciinema of what's described above:

<script id="asciicast-QEi40F3mFUzpAFPAoIFkdD05p" src="https://asciinema.org/a/QEi40F3mFUzpAFPAoIFkdD05p.js" data-rows="25" data-theme="asciinema" async></script>
    
<p class="notice--info">
    <strong>Note</strong>: I obviously didn't replace my existing key in the YubiKey thus the bad password in the end :smile:
</p>

## Setting up the phone

We are going to need two apps:

* [Openkeychain](https://f-droid.org/en/packages/org.sufficientlysecure.keychain/), which is a gpg toolchain for Android. This is need so that the encryption key can be loaded from YubiKey.
* [Password Store](https://f-droid.org/en/packages/com.zeapo.pwdstore/), which is the Unix Password Manager implemented on Android.


### Setting up OpenKeyChain

The setup is really easy here. Having the app installed, we just open it and move the YubiKey near the NFC reader,
 we 're then asked for the YubiKey pin, and the key is imported successfully. 


### Setting up Password store

For this step, we 're going to need our password-store in a git repository (see [here]({% post_url 2018-01-30-unix-pass %}#adding-a-remote) how to add one).

We open the Password Store app, go to Settings->Crypto->Select OpenPGP Provider and select OpenKeychain. Then we add the
git remote url for the password-store, and as soon as it's cloned we 're good to go! 


## Conclusion

Utilizing the Unix Password Store in an Android phone is easy and secure using an NFC-enabled YubiKey. The android app
for the Password Store is intuitive and easy to use, supports full text searching and adding / updating passwords. And 
as an extra bonus we can use our YubiKey to add an extra layer of security to our 2-factor-authentication using the 
[Yubico Authenticator App](https://www.yubico.com/products/services-software/download/yubico-authenticator/) as an 
alternative to Google Authenticator. 

Happy decrypting !

