#!/bin/bash

echo "building image 'jamievangeysel/neo-website' and pushing to docker"
docker build -t jamievangeysel/neo-website ./ && docker push jamievangeysel/neo-website
echo "Last runtime: $(date)"

docker image prune --filter label=stage=build --force
echo "removed build stage image"