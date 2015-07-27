# Networking Play App

Simple illustration of multiple processes finding their own IP address, registering with a router and receiving proxied requests.

The app makes no assumptions about DNS or other forms of service discovery. Each process looks up its own IP by comparing to `CIDR_BLOCK` which must be set as an environment variable.

Workers will try to register at endpoint provided in `REGISTRY` variable. They only try once.

The web process plays the role of router and registry. It expects to run only one instance.

If booted correctly, you can put and get values in each worker by addressing them directly through the web front end:

```
$ curl -X PUT http://thisapp/node/0/mykey -d 'value=my-first'
my-first
$ curl -X PUT http://thisapp/node/1/mykey -d 'value=my-second'
my-second
$ curl http://thisapp/node/0/mykey
my-first
$ curl http://thisapp/node/1/mykey
my-second
```
