#!/bin/bash
AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID="784084668816"
REPO_NAME="ondc-nazara-staging"

echo "Logging into Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

IMAGE_URI=$(jq -r '.[0].imageUri' /home/ubuntu/imagedefinitions.json)
CONTAINER_NAME=ondc-nazara-frontend

echo "Stopping existing container..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "Pulling latest image from ECR..."
docker pull  $IMAGE_URI

echo "Running new container..."
docker run -d --name $CONTAINER_NAME -p 80:3000 $IMAGE_URI
 