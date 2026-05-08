pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'YOUR_GITHUB_REPOSITORY_LINK'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t money-management .'
            }
        }

        stage('Run Docker Container') {
            steps {

                sh 'docker stop money-management-container || true'
                sh 'docker rm money-management-container || true'

                sh 'docker run -d -p 3000:3000 --name money-management-container money-management'
            }
        }
    }
}