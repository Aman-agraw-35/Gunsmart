pipeline {
  agent any

  environment {
    IMAGE_NAME = "amanagraw35/nextjs-app"
    EC2_HOST = "3.91.84.218"
    EC2_USER = "ubuntu"
    REMOTE_PATH = "/home/ubuntu/gunsandammo"
    CONTAINER_NAME = "nextjs-app-container"
    APP_PORT = "3000"
  }

  options {
    skipDefaultCheckout(true)
    timeout(time: 30, unit: 'MINUTES')
  }

  stages {
    stage('Cleanup Jenkins Workspace') {
      steps {
        sh '''
          rm -rf ${WORKSPACE}/* || true
          docker builder prune -f || true
          docker image prune -f || true
          docker container prune -f || true
        '''
      }
    }

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
    sh '''
      echo "Available space before build:"
      df -h /

      export DOCKER_BUILDKIT=0
      docker build -t $IMAGE_NAME .

      echo "Built image size:"
      docker images $IMAGE_NAME --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}"

      docker builder prune -f || true
    '''
  }
}


    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $IMAGE_NAME
            docker logout
            docker rmi $IMAGE_NAME || true
          '''
        }
      }
    }

    stage('Deploy to EC2 via SSH') {
      steps {
        sshagent(['ec2-ssh']) {
          sh '''
            ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
              docker stop $CONTAINER_NAME || true
              docker rm $CONTAINER_NAME || true
              docker image prune -f || true
              docker pull $IMAGE_NAME:latest
              docker run -d \
                --name $CONTAINER_NAME \
                -p $APP_PORT:3000 \
                --restart unless-stopped \
                --memory=512m \
                --memory-swap=1g \
                $IMAGE_NAME:latest
              sleep 5
              docker ps | grep $CONTAINER_NAME || exit 1
            '
          '''
        }
      }
    }

    stage('Health Check') {
      steps {
        sshagent(['ec2-ssh']) {
          sh '''
            sleep 10
            ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "
              curl -f http://localhost:$APP_PORT || exit 1
              echo '✅ Application is responding!'
            "
          '''
        }
      }
    }
  }

  post {
    always {
      sh '''
        docker system prune -f || true
        rm -f .env.production || true
      '''
    }

    failure {
      echo '❌ Build failed.'
      sshagent(['ec2-ssh']) {
        sh '''
          echo "Attempting EC2 cleanup..."
          ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "
            docker stop $CONTAINER_NAME || true
            docker rm $CONTAINER_NAME || true
          " || echo "Cleanup failed or not needed."
        '''
      }
    }

    success {
      echo '✅ Build and deployment successful!'
      echo "App should be live at: http://${EC2_HOST}:${APP_PORT}"
    }
  }
}
