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
        stage('API Tests (Postman/Newman)') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        sh '''
                        docker build -f tests/api/Dockerfile.test -t ${API_TEST_IMAGE} tests/api
                        docker run --rm ${API_TEST_IMAGE} newman run coleccion.postman_collection.json -e entorno.postman_environment.json
                        '''
                    }
                }
            }
            post {
                unstable {
                    echo 'AVISO: No se ejecutaron pruebas de API o los archivos no estan presentes'
                    }
            }
        }
        */
        stage('E2E Tests') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        dir('tramitrack'){
                            sh '''
                            E2E_NET="tramitrack-e2e-net"
                            APP_CONTAINER="tramitrack-vue-e2e"

                            cleanup() {
                              docker rm -f ${APP_CONTAINER} >/dev/null 2>&1 || true
                              docker network rm ${E2E_NET} >/dev/null 2>&1 || true
                            }
                            trap cleanup EXIT

                            docker network create ${E2E_NET} || true
                            docker rm -f ${APP_CONTAINER} || true

                            docker run -d \
                              --name ${APP_CONTAINER} \
                              --network ${E2E_NET} \
                              ${FRONTEND_IMAGE}:build \
                              pnpm dev --host 0.0.0.0 --port 3000

                            sleep 20
                            APP_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${APP_CONTAINER})

                            docker build -f tests/e2e/Dockerfile.e2e -t ${E2E_IMAGE} .
                            docker run --rm \
                              --network ${E2E_NET} \
                              -e CYPRESS_baseUrl=http://${APP_IP}:3000 \
                              ${E2E_IMAGE}
                            '''
                        }
                    }
                }
            }
            post {
                unstable {
                    echo 'AVISO: No se ejecutaron pruebas E2E o el contenedor de Cypress fallo'
                    }
                }
        }
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
