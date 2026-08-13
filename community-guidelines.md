---
title: Community Guidelines
---

# Community Guidelines

These guidelines ensure the SERC partition remains available to all SDSS users. Please follow them when running jobs on the Sherlock `serc` partition.

## Interactive Sessions

::::{grid} 1 1 2 2

:::{grid-item-card} 8-hour time limit
Do not run interactive sessions longer than **8 hours**. Use batch jobs for longer workloads.
:::

:::{grid-item-card} Resource limits
Limit yourself to **2 GPUs** and **32 CPUs** per interactive session.
:::

::::

## All Sessions

:::{note}
Please request the **40GB GPUs** when possible. This leaves the larger GPU memory tiers available for workloads that genuinely require them.
:::

## Batch Jobs

::::{grid} 1 1 3 3

:::{grid-item-card} Concurrent GPU limit
Limit yourself to **8 concurrent GPUs** across all running batch jobs.
:::

:::{grid-item-card} Concurrent CPU limit
Limit yourself to **1000 concurrent CPUs** across all running batch jobs.
:::

:::{grid-item-card} Memory per GPU
Respect the **memory per GPU** limit for each machine configuration. Excessive memory requests can force GPUs to be idle.
:::

::::
