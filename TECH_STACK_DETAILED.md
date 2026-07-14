# Inventario detallado de tecnologías — Ultimate Backend

Documento: descripción breve, uso en este repo y notas operativas.

## NestCloud: paquetes principales

- **@nestcloud/etcd**
  - Uso en el repo: listado en `package.json` como dependencia. Puede importarse desde servicios que usen NestCloud.
  - Para qué sirve: integra etcd como backend de configuración y/o service registry. Permite leer pares clave-valor centralizados, reaccionar a cambios de configuración y publicar información de servicio para discovery.
  - Notas: requiere un cluster etcd accesible; es una alternativa a Consul y es útil cuando Kubernetes/etcd ya son parte de la infraestructura.

- **@nestcloud/consul**
  - Uso: configuración y ejemplos (`bootstrap-*.yaml`, `config.example`) usan Consul como registry/KV principal.
  - Para qué sirve: registro de servicios, KV store para configuración, health checks y descubrimiento dinámico.

- **@nestcloud/loadbalance**
  - Para qué sirve: balanceo de peticiones entre instancias descubiertas por el registry.

- **@nestcloud/grpc**
  - Para qué sirve: facilidades para configurar clientes y servidores gRPC dentro de NestJS, integrando discovery/retry/timeout.

- **@nestcloud/config, @nestcloud/boot, @nestcloud/logger, @nestcloud/brakes, @nestcloud/memcached, @nestcloud/redis, @nestcloud/feign, @nestcloud/kubernetes**
  - Para qué sirven: ecosistema que unifica arranque, configuración centralizada, logging, circuito-breaker, adaptadores de cache, clientes HTTP declarativos y adaptación a Kubernetes.

## NestJS y módulos relacionados

- **NestJS (`@nestjs/*`)**
  - Uso: framework base de todos los microservicios (`apps/*/src`). Proporciona controladores, providers, guards, interceptors, módulos GraphQL y microservices.

- **`@nestjs/graphql`, Apollo, `apollo-server-express`**
  - Uso: `api-admin` expone GraphQL; `libs/contracts` contiene tipos compartidos.
  - Para qué sirve: construir API GraphQL (code-first), relacionar resolvers y generar tipos.

- **`@nestjs/microservices`**
  - Para qué sirve: soporte de patrones de microservicio, transporte y comunicación entre servicios.

## Comunicación y contratos

- **gRPC / protobuf (`grpc`, `@grpc/grpc-js`, `@grpc/proto-loader`, `protobufjs`, `ts-proto`, `grpc-tools`)**
  - Uso: `libs/proto-schema`, `gen-ts.sh`, `scripts/copy-proto-assets.js`.
  - Para qué sirve: definir contratos con `.proto`, generar stubs y mensajes tipados para comunicación eficiente entre servicios.

- **Event Store (`geteventstore-promise2`, `node-eventstore-client`, `@juicycleff/nestjs-event-store`)**
  - Uso: dependencias disponibles y compose para EventStore.
  - Para qué sirve: persistencia de eventos (event sourcing), reconstrucción de estado y publicación de eventos.

- **NATS / NATS Streaming (`nats`, `node-nats-streaming`)**
  - Para qué sirve: pub/sub y streaming para notificaciones y suscripciones (alternativa/ complementaria a EventStore).

## Persistencia y caching

- **MongoDB (`mongodb`)** — base de datos primaria en muchas services.
- **ArangoDB (`arangojs`)** — opción multi-modelo mencionada.
- **Redis / ioredis / cache stores** — cache, sesiones, y soporte para bull queues.
- **Memcached** — store de cache opcional.

## Colas y procesamiento background

- **Bull (`bull`, `@nestjs/bull`)**
  - Uso: procesamiento asíncrono (emailing, jobs) respaldado por Redis.

## Seguridad y AuthZ/AuthN

- **Passport y estrategias (`passport`, `passport-local`, `passport-google-oauth`, `passport-facebook`)**
  - Uso: autenticación de usuarios y OAuth social.

- **Casbin (`casbin`, `nestjs-casbin`, `casbin-mongodb-adapter`)**
  - Para qué sirve: políticas de autorización (RBAC/ABAC) con persistencia en MongoDB.

## Pagos / Integraciones externas

- **Stripe (`stripe`, `nestjs-stripe`)** — pagos y gestión de planes SaaS.
- **SendGrid (`@anchan828/nest-sendgrid`)** — envío de emails.

## Observabilidad / DevOps

- **Prometheus (`prom-client`)** + **Grafana** — métricas y dashboards (folder `grafana/`).
- **Snyk** — escaneo de vulnerabilidades.

## Contenerización y despliegue

- **Docker / Docker Compose** — `Dockerfile` por servicio y `docker-compose.*.yml` para entornos locales y eventstore.
- **Kompose** — convertir compose a manifests Kubernetes.
- **Kubernetes / Terraform (EKS)** — `iac/` contiene tf para crear infra en EKS.

## CI/CD y calidad

- **Azure Pipelines / GitLab CI / CircleCI / GitHub Actions** — integración y despliegue automatizado.
- **Jest / ts-jest / @shelf/jest-mongodb / supertest** — unit y e2e tests.
- **tslint / prettier / remark-cli / husky** — formato y linting con hooks.

## Estrategias arquitectónicas (resumen)

- Microservicios desacoplados con discovery central (Consul/etcd/K8s).
- Multi-tenancy con estrategias de aislamiento de datos.
- Event-driven y event sourcing para trazabilidad y reconstrucción de estado.
- Contratos con protobuf y GraphQL contracts para interoperabilidad.
- Circuit-breaker y patterns resilientes (Brakes).

---
Archivo generado automáticamente por revisión. Para más detalles (mapa por servicio, dependencias por `apps/*` o `libs/*`) puedo generar reportes adicionales bajo petición.
