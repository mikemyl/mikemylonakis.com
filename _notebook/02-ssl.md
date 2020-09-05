---
title:  "SSL certificates"
permalink: /notebook/ssl/
excerpt: "SSL certificate commands"
toc: true
toc_sticky: true
last_modified_at: 2019-08-1T12:20:31-04:00
---

### Cert generation

#### With new key - openssl

```bash
$ export C="GB" ST="London" L="London" O="Org" OU="Org Unit" CN="example.com" 
$ openssl req -nodes -newkey rsa:2048 -keyout $CN.key -out $CN.csr -subj "/C=$C/ST=$ST/L=$L/O=$O/OU=$OU/CN=$CN"
```

#### With existing key - openssl

```bash
$ export C="GB" ST="London" L="London" O="Org" OU="Org Unit" CN="example.com" 
$ openssl req -new -key $CN.key -out $CN.csr -subj "/C=$C/ST=$ST/L=$L/O=$O/OU=$OU/CN=$CN"
```

#### Self signed - openssl

```bash
$ export C="GB" ST="London" L="London" O="Org" OU="Org Unit" CN="example.com" 
$ openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout $CN.key -out $CN.crt -subj "/C=$C/ST=$ST/L=$L/O=$O/OU=$OU/CN=$CN"
```

#### With new key - keystore

```bash
$ export DNAME="C=GB, ST=London, L=London, O=Org, OU=OrgUnit, CN=domain.com"
$ keytool -genkey -noprompt -alias domain.com -dname "$DNAME" -keyalg RSA -keysize 2048 -keystore keystore.jks -storepass changeit -keypass changeit
$ keytool -certreq -alias domain.com -keyalg RSA -file domain.com.csr -keystore keystore.jks
```

#### Self signed - keystore

```bash
$ export DNAME="C=GB, ST=London, L=London, O=Org, OU=OrgUnit, CN=domain.com"
$ keytool -genkey -noprompt -keyalg RSA -alias domain.com -dname "$DNAME" -keystore keystore.jks -storepass password -validity 360 -keysize 2048
```

### Conversions

#### PKCS#8 (version + key) to PKCS#1 (key)

```bash
$ openssl rsa -in pkcs8.key -out pkcs1.key
``` 

#### PKCS#1 to PKCS#8 

```bash
$ openssl pkcs8 -topk8 -nocrypt -in pkcs1.key -out pkcs8.key
``` 

#### Openssl key+cert to keystore

```bash
$ openssl pkcs12 -export -in my.crt -inkey my.key -chain -CAfile my-ca-file.crt -name "my-domain.com" -out my.p12
$ keytool -importkeystore -deststorepass changeit -destkeystore keystore.jks -deststoretype JKS -srckeystore my.p12 -srcstoretype PKCS12
```

#### Keystore to openssl cert

```bash
$ keytool -importkeystore -srckeystore keystore.jks -srcstorepass changeit -srckeypass changeit -srcalias domain.com -destalias domain.com -destkeystore cert.p12 -deststoretype PKCS12 -deststorepass changeit -destkeypass changeit
$ openssl pkcs12 -in cert.p12 -nocerts -out my.key
$ openssl pkcs12 -in cert.p12 -clcerts -nokeys -out my.crt
```

### Checks

#### List hostnames - openssl

```bash
$ export URL=google.com:443
$ true | openssl s_client -connect $URL 2> /dev/null | openssl x509 -noout -text | grep "DNS" | sed 's/DNS:\([^,]*\)/\n\1/g'
```

#### List hostnames - openssl (file)

```bash
$ export FILE=url.crt
$ openssl x509 -noout -text -in $FILE | grep "DNS" | sed 's/DNS:\([^,]*\)/\n\1/g'
```

#### List all certs - keystore

```bash
$ keytool -list -v -keystore keystore.jks
```

### Other

#### Import cert - keystore

```bash
$ export FILE=cert.pem KEYSTORE=keystore.jks
$ keytool -import -trustcacerts -file $FILE -alias domain.com -keystore $KEYSTORE
```

#### Import key, cert - keystore

```bash
$ openssl pkcs12 -export -in my.crt -inkey my.key -chain -CAfile my-ca-file.crt -name "my-domain.com" -out my.p12
$ keytool -importkeystore -deststorepass changeit -destkeystore keystore.jks -deststoretype JKS -srckeystore my.p12 -srcstoretype PKCS12
```

#### Change a keystore password

```bash
$ keytool -storepasswd -new newpass -keystore keystore.jks
```

#### Export cert from keystore

```bash
$ keytool -export -alias domain.com -file domain.com.crt -keystore keystore.jks
```