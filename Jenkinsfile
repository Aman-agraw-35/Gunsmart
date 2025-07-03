pipeline {
  agent any

  environment {
    IMAGE_NAME = "amanagraw35/nextjs-app"
  }

  stages {
    stage('Clone') {
      steps {
        git credentialsId: 'github-creds', url: 'https://github.com/amanagraw35/gunsandammo.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $IMAGE_NAME .'
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $IMAGE_NAME
          '''
        }
      }
    }

    stage('Deploy with Compose') {
      steps {
        sshagent(['ec2-ssh']) {
          sh '''
            ssh -o StrictHostKeyChecking=no ubuntu@<EC2_PUBLIC_IP> '
              cd /home/ubuntu/gunsandammo &&
              docker-compose pull &&
              docker-compose down &&
              docker-compose up -d
            '
          '''
        }
      }
    }
  }
}
