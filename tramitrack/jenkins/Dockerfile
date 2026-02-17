FROM jenkins/jenkins:lts-jdk17

# Switch to jenkins user to install plugins
USER jenkins

COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt