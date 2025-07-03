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
    // Fail the build early if any command fails
    skipDefaultCheckout(true)
    timeout(time: 30, unit: 'MINUTES')  // Optional: Timeout for the whole job
  }

  stages {
    stage('Clone') {
      steps {
        script {
          try {
            git branch: 'main', credentialsId: 'github-creds', url: 'https://github.com/Aman-agraw-35/Gunsmart.git'
          } catch (e) {
            error "❌ Git clone failed: ${e.message}"
          }
        }
      }
    }

    stage('Inject .env.production') {
      steps {
        script {
          try {
            withCredentials([file(credentialsId: 'env-production', variable: 'ENV_FILE')]) {
              sh 'cp "$ENV_FILE" .env.production'
            }
          } catch (e) {
            error "❌ Failed to inject .env.production: ${e.message}"
          }
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          try {
            sh 'docker build -t $IMAGE_NAME .'
          } catch (e) {
            error "❌ Docker build failed: ${e.message}"
          }
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          try {
            withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
              sh '''
                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                docker push $IMAGE_NAME
                docker logout
              '''
            }
          } catch (e) {
            error "❌ Failed to push image to Docker Hub: ${e.message}"
          }
        }
      }
    }

    stage('Create PEM File') {
      steps {
        script {
          try {
            withCredentials([string(credentialsId: 'ec2-pem-key', variable: 'PEM_CONTENT')]) {
              sh '''
                echo "$PEM_CONTENT" > /tmp/kk.pem
                chmod 400 /tmp/kk.pem
              '''
            }
          } catch (e) {
            error "❌ Failed to create PEM file: ${e.message}"
          }
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        script {
          try {
            sh '''
              # Test SSH connection first
              ssh -o StrictHostKeyChecking=no -i /tmp/kk.pem $EC2_USER@$EC2_HOST "echo 'SSH connection successful'"
              
              # Stop and remove existing container if it exists
              ssh -o StrictHostKeyChecking=no -i /tmp/kk.pem $EC2_USER@$EC2_HOST "
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                docker image prune -f || true
              "
              
              # Pull latest image and run container
              ssh -o StrictHostKeyChecking=no -i /tmp/kk.pem $EC2_USER@$EC2_HOST "
                docker pull $IMAGE_NAME:latest
                docker run -d \\
                  --name $CONTAINER_NAME \\
                  -p $APP_PORT:3000 \\
                  --restart unless-stopped \\
                  $IMAGE_NAME:latest
              "
              
              # Verify deployment
              sleep 10
              ssh -o StrictHostKeyChecking=no -i /tmp/kk.pem $EC2_USER@$EC2_HOST "
                docker ps | grep $CONTAINER_NAME || exit 1
                echo 'Container is running successfully'
              "
            '''
          } catch (e) {
            error "❌ Deployment to EC2 failed: ${e.message}"
          }
        }
      }
    }

    stage('Health Check') {
      steps {
        script {
          try {
            sh '''
              # Wait for application to start
              sleep 15
              
              # Check if the application is responding
              ssh -o StrictHostKeyChecking=no -i /tmp/kk.pem $EC2_USER@$EC2_HOST "
                curl -f http://localhost:$APP_PORT || exit 1
                echo 'Application health check passed'
              "
            '''
          } catch (e) {
            error "❌ Health check failed: ${e.message}"
          }
        }
      }
    }
  }

  post {
    always {
      script {
        // Cleanup files safely
        sh 'rm -f /tmp/kk.pem || true'
        sh 'rm -f .env.production || true'
        
        // Clean up Docker resources on Jenkins agent
        sh '''
          docker system prune -f || true
          docker logout || true
        '''
      }
    }

    failure {
      echo '🚨 Build failed. Check logs above.'
      script {
        // Optional: Send notification or rollback
        echo 'Consider implementing rollback mechanism here'
      }
    }

    success {
      echo '✅ Build and deployment completed successfully.'
      echo "🚀 Application should be accessible at http://${EC2_HOST}:${APP_PORT}"
    }
  }
}