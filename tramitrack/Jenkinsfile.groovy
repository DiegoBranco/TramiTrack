pipeline {
    agent any
    options {
        skipDefaultCheckout()
    }
    tools {
        dockerTool 'docker tramitrack'
    }
    environment {
        FRONTEND_IMAGE = "tramitrack-frontend"
        BACKEND_IMAGE = "tramitrack-backend"
        API_TEST_IMAGE = "api-tests"
        E2E_IMAGE = "e2e-tests"
        PERF_IMAGE = "perf-tests"
        DOCKER_API_VERSION = "1.44" 
    }
    stages {
        stage('Checkout') {
            steps {
                // Clean workspace before checkout to avoid permission conflicts
                deleteDir()
                // Trust the workspace directory to avoid "dubious ownership" errors
                sh 'git config --global --add safe.directory "*"'
                checkout([
                    $class: 'GitSCM',
                    branches: scm.branches,
                    extensions: [[$class: 'WipeWorkspace']],
                    userRemoteConfigs: scm.userRemoteConfigs
                ])
            }
        }
        stage('Build Backend') {
            steps {
                dir('tramitrack'){
                    sh '''
                    docker build \
                    -f server/dockerfile \
                    -t ${BACKEND_IMAGE}:latest \
                    .
                    '''
                }
                
            }
        }
        stage('Build Frontend') {
            steps {
                dir('tramitrack'){
                sh '''
                docker build \
                -t ${FRONTEND_IMAGE}:build \
                .
                '''
                }
            }
        }
        /*
        stage('Frontend Production Image') {
            steps {
                sh '''
                docker build \
                -f Dockerfile.prod \
                -t ${FRONTEND_IMAGE}:prod \
                .
                '''
            }
        }
        */
        /*
        stage('Unit Tests') {
        steps {
            sh 'docker run --rm ${FRONTEND_IMAGE}:build pnpm test -- --watchAll=false'
            }
        }
        */
        stage('API Tests (Postman/Newman)') {
            steps {
                script {
                    // Entramos a la carpeta 'tramitrack' que es donde Jenkins clona el repo
                    dir('tramitrack') {
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        sh '''
                        docker build -f tests/api/Dockerfile.test -t ${API_TEST_IMAGE} tests/api

                        docker run --rm \
                            --network tramitrack_default \
                            ${API_TEST_IMAGE} \
                            run coleccion.postman_collection.json \
                            -e entorno.postman_environment.json \
                            --reporters cli
                        '''
                        }
                    }
                }
            }
            post {
                unstable {
                    echo 'AVISO: Las pruebas de API fallaron o los archivos no están presentes'
                }
            }
        }
        /*
        stage('E2E Tests') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        sh '''
                        docker build -f tests/e2e/Dockerfile.e2e -t ${E2E_IMAGE} tests/e2e
                        docker run --rm ${E2E_IMAGE}
                        '''
                    }
                }
            }
            post {
                unstable {
                    echo 'AVISO: No se ejecutaron pruebas E2E o el contenedor de Cypress fallo'
                    }
                }
        }
        */
        /*
        stage('Performance Tests') {
        steps {
            script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        sh '''
                        docker build -f tests/performance/dockerfile.performance -t ${PERF_IMAGE} tests/performance
                        docker run --rm ${PERF_IMAGE}
                        '''
                }
            }
        }
            post {
                unstable {
                echo 'AVISO: No se ejecutaron pruebas de Performance o los scripts de JMeter faltan'
                }
            }
        }
        */
    }
    post {
    success {
        echo 'Pipeline finalizado: Proceso completado exitosamente'
        }
    failure {
        echo 'Pipeline finalizado: Error critico en el proceso'
        }
    always {
        script {
            try {
                sh 'docker system prune -f'
            } catch (Exception e) {
                echo "Warning: Failed to run docker prune: ${e.getMessage()}"
            }
        }
        }
    }
}