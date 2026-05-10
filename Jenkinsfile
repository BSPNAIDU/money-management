pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t money-management .'
            }
        }

        stage('Run Docker Container') {
            steps {
                bat 'docker stop money-management-container || exit 0'
                bat 'docker rm money-management-container || exit 0'
                bat 'docker run -d -p 3001:3000 --name money-management-container money-management'
            }
        }

    }
}