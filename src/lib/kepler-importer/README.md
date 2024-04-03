# Kepler-importer

The Kepler-importer plugin addresses the need for accurately measuring the energy consumption of Kubernetes clusters through the CNCF's [Kepler](https://github.com/sustainable-computing-io/kepler) project, which utilizes RAPL for energy monitoring on bare metal clusters. It facilitates the integration of Prometheus-collected Kepler metrics into the Impact Framework, enabling the computation of the SCI score for Kubernetes-deployed workloads. This process involves fetching metrics via a Prometheus server, normalizing the data through the Kepler importer plugin, and using official IF SCI models to calculate the SCI score.

## Prerequisites

### 1. Set up Kepler and a Prometheus Monitoring System

Ensure you have a Kepler configured and Prometheus monitoring system running and accessible. This system should collect metrics relevant to the Kepler's operation, such as container metrics.

### 2. Configure Prometheus for Kepler Observations

The Kepler Importer uses Prometheus metrics to assess the energy and carbon footprint of specified resources. Configure Prometheus to collect and expose the necessary metrics.

#### Add credentials to `.env`

Create a `.env` file in the IF project root directory. This is where you can store your prometheus authentication details if you use basic auth. Your `.env` file should look as follows:

```txt
PROMETHEUS_USERNAME: <your-prometheus-username>
PROMETHEUS_PASSWORD: <your-pormetheus-password
```

### 3. Define Observation and Resource Parameters

Prepare the necessary parameters, such as the observation window and the Prometheus endpoint, along with details about the resources you want to monitor (e.g., container namespaces and names).

## Congifuration

- `kepler-observation-window`: The time interval between measurements in seconds
- `prometheus-endpoint`: Endpoint for the prometheus server
- `container-namespace`: Workload container namespace
- `container-name`: Workload container name

## Inputs

These are the required fields:

- `timestamp`: An ISO8601 timestamp indicating the start time for your observation period. We work out your `timespan` by adding `duration` to this initial start time.
- `duration`: Number of seconds your observation period should last. We add this number of seconds to `timestamp` to work out when your observation period should stop.

These are all provided as `inputs`. You also need to instantiate an `kepler-importer` plugin to handle the prometheus-specific `input` data. Here's what a complete `manifest` could look like:

```yaml
name: kepler-pipeline-test
description:
tags:
initialize:
  outputs:
    - yaml
  plugins:
    'kepler-importer':
      path: '@grnsft/if-unofficial-plugins'
      method: KeplerPlugin
tree:
  children:
    child-1:
      pipeline:
        - kepler-importer
      config:
        kepler-importer:
          kepler-observation-window: 3600
          prometheus-endpoint: http://localhost:9090
          container-namespace: falco
          container-name: falco
      inputs:
        - timestamp: '2024-04-01T00:00:00Z'
          duration: 10800
```

## Outputs

The Kepler importer plugin will enrich your `manifest` with the following data:

- `duration`: the per-input duration in seconds, calculated from `kepler-observation-window`
- `energy`: total energy (Kilowatt-hour) measured by Kepler

The outputs look as follows:

```yaml
outputs:
  - timestamp: 2024-04-01T00:00:00.000Z
    energy: 23156.325378150934
    duration: 3600
  - timestamp: 2024-04-01T01:00:00.000Z
    energy: 23102.183193278288
    duration: 3600
  - timestamp: 2024-04-01T02:00:00.000Z
    energy: 23234.802352941646
    duration: 3600
```
