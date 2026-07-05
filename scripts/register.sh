#!/usr/bin/env bash
# shellcheck disable=SC2207
set -u

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
JQ_BIN="${JQ_BIN:-C:/jq/jq.exe}"
YQ_BIN="${YQ_BIN:-C:/yq/yq.exe}"
CONSUL_BIN="${CONSUL_BIN:-C:/Consul/consul.exe}"
BOOTSTRAP_PATH="src/bootstrap-development.yaml"
CONFIG_PATH="config.example"

cd "${REPO_ROOT}" || exit 1

echo "Service Registration system started"

PROJECTS=$("$JQ_BIN" -r '.projects[] | select(.type == "application") | .root' ./nest-cli.json)

for PROJECT_DIR in ${PROJECTS}; do
  PROJECT_DIR=$(printf '%s' "${PROJECT_DIR}" | tr -d '\r')
  [ -n "${PROJECT_DIR}" ] || continue

  BOOTSTRAP_FILE="./${PROJECT_DIR}/${BOOTSTRAP_PATH}"
  CONFIG_FILE="./${PROJECT_DIR}/${CONFIG_PATH}"

  if [ ! -f "${BOOTSTRAP_FILE}" ]; then
    echo "${BOOTSTRAP_FILE} not found, skipping service"
    continue
  fi

  SVC_NAME=$("$YQ_BIN" eval '.service.name' "${BOOTSTRAP_FILE}" 2>/dev/null | tr -d '\r')
  if [ -z "${SVC_NAME}" ]; then
    SVC_NAME=$("$YQ_BIN" r "${BOOTSTRAP_FILE}" 'service.name' 2>/dev/null | tr -d '\r')
  fi

  if [ -z "${SVC_NAME}" ]; then
    echo "Could not read service name from ${BOOTSTRAP_FILE}, skipping service"
    continue
  fi

  echo "Registering ${SVC_NAME}"

  if [ ! -f "${CONFIG_FILE}" ]; then
    echo "${CONFIG_FILE} not found, skipping service"
    continue
  fi

  echo "**** ${PROJECT_DIR}"

  "$CONSUL_BIN" kv put "ultimatebackend/config/${SVC_NAME}" @"${CONFIG_FILE}"
done

echo "Service Registration system completed"
