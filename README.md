
# Setup

## Prerequsites

* Docker
* Docker Compose

We got it running on Ubuntu 14.04 Server, athought it is technically possible on any other OS (we would strongly advise against using windows).

## Download Docker Images

We found that there images *acctually* worked, unlike some others... *cough couch IBM...*

```sudo docker pull hyperledger/fabric-peer:x86_64-0.6.1-preview \
  && sudo docker pull hyperledger/fabric-membersrvc:x86_64-0.6.1-preview \
  && sudo docker pull yeasy/blockchain-explorer:latest \
  && sudo docker tag hyperledger/fabric-peer:x86_64-0.6.1-preview hyperledger/fabric-peer \
  && sudo docker tag hyperledger/fabric-peer:x86_64-0.6.1-preview hyperledger/fabric-baseimage \
  && sudo docker tag hyperledger/fabric-membersrvc:x86_64-0.6.1-preview hyperledger/fabric-membersrvc```


