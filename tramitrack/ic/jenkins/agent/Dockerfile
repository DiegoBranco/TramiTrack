FROM jenkins/agent:latest

# Build-time arg: GID that owns /var/run/docker.sock on the host
ARG DOCKER_GID=999

# Create a group with that GID and add the jenkins user to it
RUN groupadd -g ${DOCKER_GID} docker || true \
 && usermod -aG ${DOCKER_GID} jenkins || true

# Switch back to the jenkins user (image default may already be jenkins)
USER jenkins

# No ENTRYPOINT override -- use agent defaults
