pipeline {
  agent any

  environment {
    IMAGE_NAME = "amanagraw35/nextjs-app"
    EC2_HOST = "3.91.84.218"
    EC2_USER = "ubuntu"
    REMOTE_PATH = "/home/ubuntu/gunsandammo"
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
  }

  post {
    always {
      script {
        // Cleanup files safely
        sh 'rm -f /tmp/kk.pem || true'
        sh 'rm -f .env.production || true'
      }
    }

    failure {
      echo '🚨 Build failed. Check logs above.'
    }

    success {
      echo '✅ Build completed successfully.'
    }
  }
}
