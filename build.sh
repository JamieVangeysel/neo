#!/bin/bash

echo "building image 'jamievangeysel/neo-website:latest' and pushing to docker registry"
docker buildx build --platform=linux/amd64 -t "jamievangeysel/neo-website:latest" -f Dockerfile --debug --sbom=true --provenance=true --push .
echo "Last runtime: $(date)"
