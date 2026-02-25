# Jenkins agent (Docker socket GID) — Quick guide

This README explains how to build and run the custom Jenkins agent image that
is configured to access the host Docker daemon by matching the Docker socket
group ID (DOCKER_GID). It also includes verification and troubleshooting
steps.

Files
- `Dockerfile` — located in this folder (`agent/Dockerfile`). Builds an image
  that creates a group with the host socket GID and adds the `jenkins` user
  to it.
- `docker-compose.agent.yml` — compose file to build and run the agent with
  `/var/run/docker.sock` mounted.

1) Determine the Docker socket GID on the host

On a Linux host run:

```bash
stat -c '%g' /var/run/docker.sock
```

This outputs a numeric GID (for example `999`).

2) Build and run the agent (from this folder)

Export the GID into the environment and run docker-compose to build & start:

```bash
cd tramitrack/ic/jenkins
export DOCKER_GID=$(stat -c '%g' /var/run/docker.sock)
docker-compose -f docker-compose.agent.yml up -d --build
```

Notes:
- If you are on Docker Desktop / Windows, run the `stat` command inside WSL
  or use a value appropriate for your environment. For quick testing you can
  also set `DOCKER_GID=0` (runs agent groups as root) but this is less secure.

3) Verify the agent has group access to the socket

Find the running container name and run:

```bash
docker ps
docker exec -it <container_name> id jenkins
docker exec -it <container_name> ls -l /var/run/docker.sock
```

You should see the `jenkins` user is member of the group whose GID matches
the socket GID, and that `ls -l /var/run/docker.sock` shows the socket owned by
that group.

4) Connect the agent to Jenkins controller

This README does not include controller authentication details. Typical options:
- Use Jenkins controller UI to create a new agent and copy the agent secret,
  then pass `JENKINS_URL` and the secret as environment variables in the
  compose file or run the agent with the controller-provided `java -jar
  agent.jar` command.
- Alternatively configure the classical SSH/agent launch if preferred.

5) Troubleshooting

- Permission denied talking to Docker daemon: ensure GID matches the socket
  owner and the container was recreated after build.
- If the socket is not present inside the container, confirm the mount
  `/var/run/docker.sock:/var/run/docker.sock` is present in `docker-compose`.
- Quick (less secure) fallback: run the agent container as `root` (set
  `user: root` in compose) or temporarily `chmod 666 /var/run/docker.sock` on
  the host to validate the pipeline works.

6) Security considerations

- Mounting the Docker socket gives the container effective control of the host
  Docker daemon. Prefer matching GID approach over running as `root` or
  globally loosening socket permissions. Restrict network and access to the
  agent container and audit its image.

If you want, I can also add an example `docker-compose` section showing how to
pass the Jenkins controller URL and secret into the agent container.
