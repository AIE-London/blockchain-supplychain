# Setup

## Prerequisites

* Docker
* Docker Compose

We got it running on Ubuntu 14.04 Server, athought it is technically possible on any other OS (we would strongly advise against using windows).

## Download Docker Images

We found that there images *acctually* worked, unlike some others... *cough couch IBM...*

```bash
sudo docker pull hyperledger/fabric-peer:x86_64-0.6.1-preview \
  && sudo docker pull hyperledger/fabric-membersrvc:x86_64-0.6.1-preview \
  && sudo docker pull yeasy/blockchain-explorer:latest \
  && sudo docker tag hyperledger/fabric-peer:x86_64-0.6.1-preview hyperledger/fabric-peer \
  && sudo docker tag hyperledger/fabric-peer:x86_64-0.6.1-preview hyperledger/fabric-baseimage \
  && sudo docker tag hyperledger/fabric-membersrvc:x86_64-0.6.1-preview hyperledger/fabric-membersrvc
```

## Run the hyperledger fabric

```bash
sudo docker-compose -f docker-compose.yml up
```

This will keep to attached to he logstream from the relevant containers that are spun up. In order to spin up the fabric in a detached state run the following

```bash
sudo docker-compose -f docker-compose.yml up -d
```

## Check the containers

Run the following to list the running docker containers

```bash
sudo docker ps
```

The output should look something like this:

```bash
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                                             NAMES
ce4d1be53ea1        hyperledger/fabric-peer      "bash -c 'while tr..."   34 seconds ago      Up 34 seconds       7050-7059/tcp                                     fabric-cli
a13248528450        hyperledger/fabric-peer      "peer node start -..."   34 seconds ago      Up 34 seconds       7050/tcp, 7052-7059/tcp, 0.0.0.0:7051->7051/tcp   fabric-peer0
f268fec6db0b        hyperledger/fabric-orderer   "orderer"                35 seconds ago      Up 34 seconds       0.0.0.0:7050->7050/tcp                            fabric-orderer0
547515df9394        hyperledger/fabric-ca        "fabric-ca-server ..."   35 seconds ago      Up 34 seconds       7054/tcp, 0.0.0.0:8888->8888/tcp                  fabric-ca
```

As you can see we've successfuly setup a network consiting of one peer, one orderer and a ca. As well as a cli to interact with it if we wish.
