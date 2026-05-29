pipeline {
    agent any

    environment {
        // These can be overridden in Jenkins credentials or environment variables,
        // but we'll provide fallbacks here to match our compose file.
        EC2_PUBLIC_IP = sh(script: "curl -s ifconfig.me", returnStdout: true).trim()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy with Docker Compose') {
            steps {
                echo 'Building and starting all containers via Docker Compose...'
                
                // Build the images and start the containers in detached mode
                // docker-compose up --build automatically handles building Dockerfiles
                sh 'docker compose up --build -d'
            }
        }
        
        stage('Cleanup') {
            steps {
                echo 'Pruning old, unused Docker images to save space...'
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! Application is running.'
        }
        failure {
            echo 'Deployment failed. Check the logs above.'
        }
    }
}
