# FastAPI backend

## Deep overview

The backend is a FastAPI application written in Python. It accepts images or landmark payloads from the client, extracts features (using MediaPipe when required), and orchestrates inference through local PyTorch models in the `smart_gestures` package. To support low-latency interactions the service also exposes WebSocket endpoints for realtime feedback and session orchestration.

## Why FastAPI? (references)

FastAPI was selected for its blend of performance and developer ergonomics. It provides automatic validation and serialization through Pydantic, OpenAPI generation with interactive documentation, and robust support for asynchronous features such as background tasks and WebSockets through Starlette. When paired with an ASGI server like Uvicorn (and uvloop), FastAPI delivers the throughput and latency characteristics we need for inference workloads.

## Core architecture & flow

In a typical request flow the client submits an image or JSON landmarks to an endpoint, where requests are validated by Pydantic models and converted into the numeric tensors expected by the models. MediaPipe detectors are initialized at service startup to avoid repeated cold-start costs, and PyTorch models from `smart_gestures` execute inference and return classification results (label plus confidence). Results are returned synchronously over HTTP or can be pushed to the client via WebSocket for realtime updates.

## Key technologies and why they matter

The service relies on FastAPI for request handling and schema validation, Pydantic for predictable input models, MediaPipe for reliable hand/pose landmark extraction, and PyTorch for running the trained models. Uvicorn is used as the ASGI server in deployment to handle asynchronous requests efficiently.

## Operational considerations

MediaPipe and PyTorch have non-trivial memory and startup costs, so detectors and models are initialized at startup (via FastAPI startup events or imports) rather than per-request. For CPU-bound inference run multiple Uvicorn workers or horizontally scale with a Kubernetes Deployment; for GPU-based inference prefer a single process per GPU with memory pinned and scale horizontally as needed. Long-running work such as sequence inference should be handled through background tasks or WebSockets to avoid blocking HTTP workers, and containers should expose reasonable resource requests/limits to prevent OOMs on the node.

## Security & production hardening

In production, tighten CORS policies and terminate TLS at the ingress or load balancer rather than exposing unencrypted traffic. Protect sensitive endpoints with JWT/OAuth2 or API keys and enforce strict input validation via Pydantic validators to reject malformed sequences. These measures reduce attack surface and help ensure predictable behavior from downstream inference code.

## Observability & debugging

The service exposes health and readiness probes for container orchestration and uses structured logging for predictions and errors. Suppressing noisy upstream logs (e.g., absl/TensorFlow) keeps logs actionable. For production monitoring, export Prometheus-style metrics such as request latency, inference duration, and model confidence distributions so operators can track service health and model behaviour.

## Kubernetes notes

Kubernetes manifests are located under `k8s/server.*.yaml`. In practice tune `replicas` and autoscaling settings according to CPU/GPU usage, set sensible `resources.requests` and `limits` for MediaPipe and PyTorch, and configure liveness/readiness probes against `/health` and optionally a lightweight model-check endpoint.

## Related services & integration

This service integrates closely with the `client` (which uploads images and consumes predictions) and with the documentation site for API examples (Swagger UI). For storing images or sequences consider `minio` or `lakeFS` depending on whether you need simple object storage or versioned datasets. Local registries (`registry-server` / `registry-ui`) are used in CI and development for hosting images.

## References & further reading

- FastAPI docs — Getting started, Security, Deployment: <https://fastapi.tiangolo.com/>
- Starlette (ASGI foundation): <https://www.starlette.io/>
- Pydantic models & data validation: <https://docs.pydantic.dev/>
- MediaPipe solutions guide: <https://developers.google.com/mediapipe>
- PyTorch docs: <https://pytorch.org/docs/stable/>
- Production tips (Uvicorn/Gunicorn, workers): <https://fastapi.tiangolo.com/deployment/>

## Examples & troubleshooting

- If you see slow cold-start times, verify models are loaded at startup (check FastAPI startup event logs).
- OOMs: reduce `workers` and run fewer concurrent requests per pod; consider GPU-inference node pools.
- WebSockets dropping: check reverse proxy timeouts (Traefik/nginx) and enable sticky sessions if needed.
