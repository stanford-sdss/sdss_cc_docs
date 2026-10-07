---
title: Getting Started -- RCF
---

:::{admonition} CEES-RCF is decommissioned
:class: danger

the CEES-RCF HPC and tool nodes have been decommissioned.
:::

# Getting Started

##  Connecting RCF: SSH and VPN
Connections to RCF are made via Secure Shell (SHH).  On LInux or MacOS systems, an ssh client is often installed in the default configuration or easily installed using a package manager. 
For more information, including installing SSH for Windows, see [Connecting to Sherlock](https://www.sherlock.stanford.edu/docs/getting-started/connecting/).

Most connections to Mazama require being connected to the Stanford VPN:
    - [Stanford VPN Instructions](https://uit.stanford.edu/service/vpn/linux "Stanford VPN")

# RCF HPC:
RCF is an HPC cluster consisting of approximately 150 nodes, each with twin quad-core processors 24 GB memory. RCF is managed by a MAUI/TORQUE PBS system; all jobs must be submitted and queued to run in batch; interactive jobs can be run on [Tool Servers](mazama#mazama-tool-and-gpu-servers).

## Accounts
RCF HPC is available to PIs, and their teams, who own nodes on the cluster. 

## Connecting to RCF HPC
The first step to running a job is to connect to a login node using your Stanford su_id:

        $ ssh <SUNetID>@cees-rcf.stanford.edu

This will connect you to a *login* or *head* node. These nodes are _**not**_ for computation. Use these nodes for small data transfer jobs, moderate compilation, scheduling batch jobs, and other low impact staging activities. Compute intensive activities -- including extensive code compilations and data copy jobs, should be either queued to run in batch or run on Tool Servers -- see below.
