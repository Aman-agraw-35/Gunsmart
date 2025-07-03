pipeline {
  agent any

  environment {
    IMAGE_NAME = "amanagraw35/nextjs-app"
    EC2_HOST = "3.91.84.218"
    EC2_USER = "ubuntu"
    REMOTE_PATH = "/home/ubuntu/gunsandammo"
  }

  stages {
    stage('Clone') {
      steps {
        git branch: 'main', credentialsId: 'github-creds', url: 'https://github.com/Aman-agraw-35/Gunsmart.git'
      }
    }

    stage('Inject .env.production') {
      steps {
        withCredentials([file(credentialsId: 'env-production', variable: 'ENV_FILE')]) {
          sh 'cp "$ENV_FILE" .env.production'
        }
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
            ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
              cd $REMOTE_PATH &&
              git pull origin main &&
              docker-compose pull &&
              docker-compose down &&
              docker-compose up -d
            '
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'rm -f .env.production'
    }
  }
}
