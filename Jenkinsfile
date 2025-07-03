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

    stage('Create PEM File') {
      steps {
        withCredentials([string(credentialsId: 'ec2-pem-key', variable: 'PEM_CONTENT')]) {
          sh '''
            echo "$PEM_CONTENT" > /tmp/kk.pem
            chmod 400 /tmp/kk.pem
          '''
        }
      }
    }

    stage('Deploy with Compose') {
      steps {
        sh '''
          ssh -i /tmp/kk.pem -o StrictHostKeyChecking=no ubuntu@54.210.92.203 '
            cd /home/ubuntu/gunsandammo &&
            git pull &&
            docker-compose pull &&
            docker-compose down &&
            docker-compose up -d
          '
        '''
      }
    }
  }
}
