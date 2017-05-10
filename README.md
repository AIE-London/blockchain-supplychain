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
