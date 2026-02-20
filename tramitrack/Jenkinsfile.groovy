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
        UNIT_TEST_IMAGE = "unit-tests"
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
        
        stage('Unit Tests') {
           agent {
        dockerfile {
            filename 'tests/unit/Dockerfile.unit'
            dir 'tramitrack'
            // Esto le dice a Jenkins que no borre la imagen inmediatamente
            reuseNode true 
        }
    }
    steps {
        sh 'pnpm exec jest --config=jest.config.cjs'
    }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'tramitrack/junit.xml'
                }
                failure {
                    echo 'Unit tests failed. Review the JUnit report above.'
                }
            }
        }
        
        stage('API Tests (Postman/Newman)') {
            steps {
                script {
                    dir('tramitrack') {
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                            sh '''
                            docker build -f tests/api/Dockerfile.test -t ${API_TEST_IMAGE} tests/api
                            docker run --rm \
                                --network tramitrack_default \
                                ${API_TEST_IMAGE} \
                                run coleccion.ci.json \
                                --reporters cli
                            '''
                        }
                    }
                }
            }
        }

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
        
        stage('Performance Tests') {
            steps {
                script {
                    dir('tramitrack') {
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                            sh '''
                            docker build -f tests/performance/dockerfile.performance -t ${PERF_IMAGE} tests/performance
                            
                            # Crear carpetas para resultados (por si acaso)
                            mkdir -p tests/performance/results tests/performance/reports
                            
                            # Ejecutar con montaje para extraer resultados (opcional)
                            docker run --rm \
                                --network tramitrack_default \
                                -v $(pwd)/tests/performance/results:/tests/results \
                                -v $(pwd)/tests/performance/reports:/tests/reports \
                                ${PERF_IMAGE}
                            '''
                        }
                    }
                }
            }
            post {
                unstable {
                    echo 'AVISO: Las pruebas de rendimiento fallaron o no se ejecutaron completamente'
                }
            }
        }
        
    }
    /*
    stage('Push Images') {
        when {
            branch 'main'
        }
        steps {
            withCredentials([usernamePassword(
                credentialsId: 'github-creds',
                usernameVariable: 'GITHUB_USER',
                passwordVariable: 'GITHUB_TOKEN'
            )]) {
                sh '''
                echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin

                docker tag ${FRONTEND_IMAGE}:build ghcr.io/${GITHUB_USER}/tramitrack-frontend:${BUILD_NUMBER}
                docker tag ${BACKEND_IMAGE}:latest ghcr.io/${GITHUB_USER}/tramitrack-backend:${BUILD_NUMBER}

                docker push ghcr.io/${GITHUB_USER}/tramitrack-frontend:${BUILD_NUMBER}
                docker push ghcr.io/${GITHUB_USER}/tramitrack-backend:${BUILD_NUMBER}
                '''
            }
        }
    }
    */
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
