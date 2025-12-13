docker compose up --build server
docker compose up --build

# Server (FastAPI backend)

Deep overview
----------------

The server component is a Python FastAPI application that performs the following roles:

- Accepts images/landmarks from the client (REST multipart/form-data or JSON).
- Runs MediaPipe-based keypoint extraction (hands/pose) for feature extraction.
- Orchestrates inference through local PyTorch models provided by the `smart_gestures` package (ASL/VGT feed-forward models and LSTM sequence models).
- Exposes a WebSocket endpoint for low-latency realtime feedback and session orchestration.

Why FastAPI? (references)
---------------------------

FastAPI is chosen for its combination of high performance and developer ergonomics. Key points from the official docs (<https://fastapi.tiangolo.com/>) used in this project:

- Automatic input validation & serialization using Pydantic models (type hints → runtime validation + clear errors).
- Automatic OpenAPI generation and interactive docs (`/docs` using Swagger UI, `/redoc`).
- Built on Starlette for the web server primitives (routing, background tasks, WebSockets) which makes it suitable for async workloads.
- Designed to be fast (comparable with Node/Go for many workloads) when served with Uvicorn/uvloop.

Core architecture & flow
-------------------------

1. Client uploads image or JSON landmarks.
2. `/keypoints/*` endpoints call MediaPipe detectors (imported once at startup to avoid per-request init cost).
3. Routers convert Pydantic schema → numpy tensors → model input format.
4. `smart_gestures` models (PyTorch) execute inference and return `(label, confidence)`.
5. Prediction results are returned to the client; optionally pushed via `/ws` for realtime UI updates.

docker compose up --build server
docker compose up --build

# Server (FastAPI backend)

## Deep overview

The server component is a Python FastAPI application that performs the following roles:

- Accepts images/landmarks from the client (REST multipart/form-data or JSON).
- Runs MediaPipe-based keypoint extraction (hands/pose) for feature extraction.
- Orchestrates inference through local PyTorch models provided by the `smart_gestures` package (ASL/VGT feed-forward models and LSTM sequence models).
- Exposes a WebSocket endpoint for low-latency realtime feedback and session orchestration.

## Why FastAPI? (references)

FastAPI is chosen for its combination of high performance and developer ergonomics. Key points from the official docs (<https://fastapi.tiangolo.com/>) used in this project:

- Automatic input validation & serialization using Pydantic models (type hints → runtime validation + clear errors).
- Automatic OpenAPI generation and interactive docs (`/docs` using Swagger UI, `/redoc`).
- Built on Starlette for the web server primitives (routing, background tasks, WebSockets) which makes it suitable for async workloads.
- Designed to be fast (comparable with Node/Go for many workloads) when served with Uvicorn/uvloop.

## Core architecture & flow

1. Client uploads image or JSON landmarks.
2. `/keypoints/*` endpoints call MediaPipe detectors (imported once at startup to avoid per-request init cost).
3. Routers convert Pydantic schema → numpy tensors → model input format.
4. `smart_gestures` models (PyTorch) execute inference and return `(label, confidence)`.
5. Prediction results are returned to the client; optionally pushed via `/ws` for realtime UI updates.

## Key technologies and why they matter

- FastAPI (<https://fastapi.tiangolo.com/>): Request validation, dependency injection, built-in docs, WebSocket support.
- Uvicorn (ASGI server): lightweight, async server used in production with workers (see FastAPI deployment docs).
- Pydantic (models/validation): ensures predictable JSON -> Python translation and helpful validation errors.
- MediaPipe (Google): cross-platform ML pipelines for hand/pose landmarks; used here for deterministic, real-time keypoint extraction (<https://developers.google.com/mediapipe>).
- PyTorch (<https://pytorch.org/docs/stable/>): model runtime for the trained models in `smart_gestures`.

## Operational considerations

- Startup cost: MediaPipe and PyTorch models are heavy; the app initializes detectors/models once at process startup (via FastAPI startup events or module import) to avoid per-request overhead.
- Workers/scale: For CPU inference, run multiple Uvicorn workers (`uvicorn --workers N`) or use an autoscaled k8s Deployment; for GPU inference, use a single process with GPU memory pinned and scale horizontally.
- Timeouts & streaming: Long-running inference (video sequences) should use background tasks or WebSocket streams to avoid tying HTTP worker threads.
- Resource limits: Configure container resource limits (CPU/memory) and k8s `resources.requests/limits` to avoid node OOMs when loading MediaPipe and PyTorch.

## Security & production hardening

- CORS: The dev setup uses permissive CORS; restrict `allow_origins` in production (FastAPI CORS middleware).
- HTTPS: Terminate TLS at the ingress/load balancer (k8s Ingress or reverse proxy). FastAPI docs discuss HTTPS and reverse-proxy configurations.
- Authentication: For production, protect endpoints with OAuth2/JWT or API keys (FastAPI has security utilities documented at <https://fastapi.tiangolo.com/tutorial/security/>).
- Input validation: Use strict Pydantic validators to reject malformed landmark sequences and enforce expected shapes (e.g., 21 hand landmarks, 40-frame LSTM sequences).

## Observability & debugging

- Health & readiness probes: `/health` and container healthchecks are configured in `docker-compose.yaml` and in k8s manifests.
- Logs: keep structured JSON logs for predictions and errors—suppress noisy TensorFlow/absl logs as done in `main.py`.
- Metrics: export Prometheus metrics (request latencies, inference duration, model confidence metrics) via a metrics endpoint or integration like `prometheus_client`.

## Kubernetes notes

- The k8s manifests live in `k8s/server.*.yaml`. Important knobs:
  - `replicas` and HPA for horizontal scale.
  - `resources.requests/limits` tuned for MediaPipe and PyTorch memory.
  - Liveness/readiness probes should use `/health` and possibly a quick model-check endpoint.

## Related services & integration

- `client`: uploads frames and consumes predictions.
- `docs`: provides API docs and examples for integrators (Swagger UI).
- `registry-server` / `registry-ui`: local images for reproducible CI/CD.
- Storage: if the backend stores images or sequences, it may integrate with `minio`/`lakefs` (for versioned object storage).

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
