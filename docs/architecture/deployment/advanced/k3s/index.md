# Advanced: k3s deployment tutorial

This tutorial explains how to deploy the repository's Kubernetes manifests (stored in `k8s/`) to a local k3s cluster for testing.

Prerequisites

- Linux host (Debian/Ubuntu recommended)
- `kubectl` in `PATH`
- `curl` and `sudo` to install k3s or access to an existing cluster

Install k3s (single-node):

```bash
curl -sfL https://get.k3s.io | sh -
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get nodes
```

Apply manifests (from repo root):

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.config.yaml
kubectl apply -f k8s/postgres.pvc.yaml
kubectl apply -f k8s/postgres.deployment.yaml
kubectl apply -f k8s/postgres.service.yaml

kubectl apply -f k8s/server.config.yaml
kubectl apply -f k8s/server.deployment.yaml
kubectl apply -f k8s/server.service.yaml

kubectl apply -f k8s/client.config.yaml
kubectl apply -f k8s/client.deployment.yaml
kubectl apply -f k8s/client.service.yaml

kubectl apply -f k8s/docs.deployment.yaml
kubectl apply -f k8s/docs.service.yaml

kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/traefik-dashboard.ingress.route.yaml
```

Verification & tips

```bash
kubectl get pods -n default
kubectl get svc -n default
kubectl logs -l app=server --tail=200
```

- If kubeconfig is only readable by root, copy it to your user: `sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config && sudo chown $(id -u):$(id -g) ~/.kube/config`.
- k3s includes a local-path provisioner for PVCs; Postgres PVCs should be satisfied by default.
- Use `kubectl port-forward` if ingress hostnames are not resolvable locally.
