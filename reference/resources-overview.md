---

title: SDSS-CC Resources Overview

---

# SDSS-CC Resources: Overview

## Sherlock

<!--
{% include alert.html type='warning' title='SERC is getting bigger!' content='SDSS-CC is expanding the SERC partition, adding 96 CBASE nodes (32 cores, 256GB RAM) and 4 G8TF64 (8 x A100 80GB, 1TB RAM, 128 cores). The new resources are expected to be available to SDSS users in Winter or early Spring 2023.' %}
-->

The Sherlock HPC system is the University’s compute cluster, purchased and supported with seed funding from the Provost, and available for use by all Stanford faculty and their research teams. Sherlock offers free compute cycles to Stanford researchers, and also allows PI’s to purchase dedicated resources.  Sherlock is maintained by Stanford Research Computing Center (SRCC); more information can be found at [https://www.sherlock.stanford.edu](https://www.sherlock.stanford.edu). Sherlock’s collaborative, shared resource approach facilitates scales of computing, varieties of available software, and levels of support that are not easily achieved by individual research groups or schools.

See also this OnBoarding slide for more information: [SDSS-CfC_onboarding_20230419.pdf](assets/SDSS-CfC_onboarding_20230419.pdf)

## Sherlock SERC Partition and Oak Storage:

In addition to generall access to the public Sherlock compute reources ( `normal`, `gpu`, `dev`, `bigmem`, and `owners` partitions), SDSS users may also submit jobs to the `serc` partition on Sherlock, and storage is available on SRCC's `oak` platform. More information on how to access Sherlock and the `serc`, partition can be found in the [Sherlock](getting-started/sherlock-access) and [Oak](getting-started/oak-storage) documentation.

The Sherlock cluster includes a broad, capable variety of computing tools. It is difficult to say exactly how big, and what specific resources are available, because it is constantly in flux as users subscribe to the system, nodes are added, and old nodes are swapped out for new ones. SDSS-CFC Sherlock resources include:

- Traditional HPC "batch" computing, managed by SLURM
- Interactive sessions, including multi-core instances
- Sherlock *owners* partition: Access to idle reseroudes owned by other PI groups.
- Public partitions: `normal`, `gpu`, `bigmem`, `dev`
- Oak 1.35PB storage:  `/oak/stanford/schools/ees/{PI SUNetID}`
-  ssh (requires 2-factor auth):
    - ```$ ssh sherlock.stanford.edu```

### Explore the `serc` node types

Use the explorer below to browse the hardware in the `serc` partition. Filter by category, CPU count, RAM, or GPU memory, then select a node type to see what it's good for and the SLURM `--constraint` to request it. For GPU jobs, please use the 40 GB GPUs when possible. See [Requesting 40GB GPUs with SLURM Constraints](../tutorials/gpu_mem_constraints.md).

:::{anywidget} ../widgets/node-explorer.mjs
{
  "nodes": [
    {
      "name": "SH3_CBASE",
      "category": "general",
      "count": 104,
      "cpus": 32,
      "cpu_model": "1 × AMD EPYC 7502",
      "ram_gb": 256,
      "constraint": "CLASS:SH3_CBASE",
      "description": "Excellent general-purpose machines, well suited to MPI and OpenMP parallel jobs.",
      "best_for": [
        "MPI jobs",
        "OpenMP (threaded) jobs",
        "General batch work"
      ],
      "caveats": [
        "SH3_CBASE and SH3_CBASE.1 have slightly different processors. Treat them as different hardware for MPI jobs."
      ]
    },
    {
      "name": "SH3_CBASE.1",
      "category": "general",
      "count": 96,
      "cpus": 32,
      "cpu_model": "1 × AMD EPYC 7543",
      "ram_gb": 256,
      "constraint": "CLASS:SH3_CBASE.1",
      "description": "A newer generation of the SH3_CBASE machines (AMD EPYC Milan). Excellent general-purpose nodes for MPI and OpenMP parallel jobs.",
      "best_for": [
        "MPI jobs",
        "OpenMP (threaded) jobs",
        "General batch work"
      ],
      "caveats": [
        "Slightly different from SH3_CBASE. Keep MPI jobs on one class, e.g. --constraint=\"[CLASS:SH3_CBASE|CLASS:SH3_CBASE.1]\" so all nodes match."
      ]
    },
    {
      "name": "SH4_CBASE",
      "category": "general",
      "count": 128,
      "cpus": 24,
      "cpu_model": "1 × AMD EPYC 8224P",
      "ram_gb": 192,
      "constraint": "CLASS:SH4_CBASE",
      "description": "Excellent general-purpose machines, well suited to MPI and OpenMP parallel jobs.",
      "best_for": [
        "MPI jobs",
        "OpenMP (threaded) jobs",
        "Jobs that need 24 or fewer cores per node"
      ],
      "caveats": [
        "Requests for more than 24 CPUs per task can't run on these nodes."
      ]
    },
    {
      "name": "SH2 Skylake",
      "category": "general",
      "count": 12,
      "cpus": 24,
      "cpu_model": "2 × Intel Xeon Gold 5118 (Skylake)",
      "ram_gb": 384,
      "constraint": "CPU_GEN:SKX&NO_GPU",
      "description": "Older Sherlock 2.0 Intel nodes. Still useful for general batch work and codes built for Intel processors.",
      "best_for": [
        "General batch work",
        "Codes compiled for Intel CPUs"
      ],
      "caveats": [
        "Older hardware: slower than the SH3/SH4 nodes.",
        "These nodes have no CLASS label, so request them by CPU generation."
      ]
    },
    {
      "name": "SH4_CPERF",
      "category": "performance",
      "count": 16,
      "cpus": 64,
      "cpu_model": "2 × AMD EPYC 9384X",
      "ram_gb": 384,
      "constraint": "CLASS:SH4_CPERF",
      "description": "High-performance machines for CPU-limited MPI and OpenMP jobs. The 9384X has enough memory bandwidth to run well on all cores.",
      "best_for": [
        "Well-optimized, CPU-limited parallel codes",
        "High-memory-bandwidth OpenMP jobs",
        "Large MPI jobs"
      ],
      "caveats": [
        "Only 16 nodes, so your job may wait longer in the queue."
      ]
    },
    {
      "name": "SH3_CPERF",
      "category": "highcap",
      "count": 8,
      "cpus": 128,
      "cpu_model": "2 × AMD EPYC 7742",
      "ram_gb": 1024,
      "constraint": "CLASS:SH3_CPERF",
      "description": "Lots of cores and memory. Great for interactive work, large-memory jobs, and general compute that isn't CPU-limited.",
      "best_for": [
        "Interactive sessions",
        "Large-memory jobs",
        "Work that isn't CPU-limited"
      ],
      "caveats": [
        "Memory-bandwidth limited: performance levels off around 60–70 cores.",
        "Not ideal for massive OpenMP or large MPI jobs."
      ]
    },
    {
      "name": "SH4_CSCALE",
      "category": "highcap",
      "count": 4,
      "cpus": 256,
      "cpu_model": "2 × AMD EPYC 9754",
      "ram_gb": 1536,
      "constraint": "CLASS:SH4_CSCALE",
      "description": "Very high core count and 1.5 TB of RAM. Excellent for interactive work, large-memory jobs, and tasks that aren't CPU-limited.",
      "best_for": [
        "Interactive sessions",
        "Very large-memory jobs",
        "Work that isn't CPU-limited"
      ],
      "caveats": [
        "Memory-bandwidth limited, so parallel performance saturates fairly quickly."
      ]
    },
    {
      "name": "SH3_G8TF64 (40 GB)",
      "category": "gpu",
      "count": 6,
      "cpus": 128,
      "cpu_model": "2 × AMD EPYC 7662",
      "ram_gb": 1024,
      "gpus": 8,
      "gpu_model": "NVIDIA A100 SXM4",
      "gpu_mem_gb": 40,
      "constraint": "GPU_MEM:40GB",
      "recommended": true,
      "description": "A100 nodes with 40 GB GPUs. Please use these whenever your job fits in 40 GB of GPU memory, so the 80 GB GPUs stay free for jobs that need them.",
      "best_for": [
        "Most GPU jobs: inference, small/medium model training, scientific GPU codes",
        "Interactive GPU development"
      ],
      "caveats": [
        "Use --ntasks=1 for multi-GPU jobs unless your code supports multi-node runs."
      ]
    },
    {
      "name": "SH3_G8TF64.1",
      "category": "gpu",
      "count": 4,
      "cpus": 128,
      "cpu_model": "2 × AMD EPYC 7763",
      "ram_gb": 1024,
      "gpus": 8,
      "gpu_model": "NVIDIA A100 SXM4",
      "gpu_mem_gb": 80,
      "constraint": "CLASS:SH3_G8TF64.1",
      "description": "A100 nodes with eight 80 GB GPUs, for jobs that need more than 40 GB of GPU memory.",
      "best_for": [
        "Large models or datasets that don't fit in 40 GB"
      ],
      "caveats": [
        "High demand. Use the 40 GB GPUs when your job fits."
      ]
    },
    {
      "name": "SH3_G4TF64.1",
      "category": "gpu",
      "count": 2,
      "cpus": 64,
      "cpu_model": "1 × AMD EPYC 7543",
      "ram_gb": 512,
      "gpus": 4,
      "gpu_model": "NVIDIA A100 SXM4",
      "gpu_mem_gb": 80,
      "constraint": "CLASS:SH3_G4TF64.1",
      "description": "Smaller A100 nodes with four 80 GB GPUs.",
      "best_for": [
        "Jobs that need 80 GB GPUs and up to 4 GPUs on one node"
      ],
      "caveats": [
        "Only 2 nodes. Use the 40 GB GPUs when your job fits."
      ]
    },
    {
      "name": "SH4_G8TF64",
      "category": "gpu",
      "count": 1,
      "cpus": 64,
      "cpu_model": "2 × Intel Xeon 8462Y+",
      "ram_gb": 2048,
      "gpus": 8,
      "gpu_model": "NVIDIA H100 SXM5",
      "gpu_mem_gb": 80,
      "constraint": "CLASS:SH4_G8TF64",
      "description": "SERC's H100 node: eight 80 GB H100 GPUs and 2 TB of system RAM.",
      "best_for": [
        "Large training jobs that benefit from H100 performance"
      ],
      "caveats": [
        "Only 1 node, so expect longer queue times.",
        "Only 8 CPU cores per GPU."
      ]
    },
    {
      "name": "SH2 V100",
      "category": "gpu",
      "count": 2,
      "cpus": 24,
      "cpu_model": "2 × Intel Xeon Gold 5118 (Skylake)",
      "ram_gb": 191,
      "gpus": 4,
      "gpu_model": "NVIDIA V100 PCIe",
      "gpu_mem_gb": 32,
      "constraint": "GPU_SKU:V100_PCIE",
      "description": "Older Sherlock 2.0 GPU nodes with four 32 GB V100 GPUs. Fine for development, testing, and smaller GPU workloads.",
      "best_for": [
        "GPU development and testing",
        "Small models and GPU codes that fit in 32 GB"
      ],
      "caveats": [
        "Older, slower GPUs. Less system RAM per GPU (about 48 GB)."
      ]
    }
  ]
}
:::

To list current node features on Sherlock, run `sh_node_feat -p serc`. For more on choosing hardware, see [SERC resources](sherlock/serc-resources.md).

## Google Cloud Platform (GCP)
For jobs, projects, and storage not well suited to shared HPC, like Sherlock and Oak, Cloud resources might be available. Google Cloud Platform (GCP) is SDSS's principal Cloud computing provider, and GCP allocations are made on a case-by-case basis and are typically allocated to accommodate:
- Websites and data portals
- Specialized compute or hardware requirements
- Lower performance GPUs, for development and other less compute intensive applications

If you your group has a project that is not well served by shared HPC, please contact SDSS-CC staff.

## More Information:
- Sherlock homepage: [https://www.sherlock.stanford.edu](https://www.sherlock.stanford.edu "Sherlock Homepage")
- Sherlock support docs: [https://www.sherlock.stanford.edu/docs/overview/introduction/](https://www.sherlock.stanford.edu/docs/overview/introduction/)
- To view partition information: `sinfo --Node --long --partition=serc`


<!--
## Mazama

{% include alert.html type='warning' title='Mazama HPC slated for decommission' content='The Mazama HPC is slated for decommission. Expect HPC access to cease 13 January 2023; access to login nodes and the filesystem will remain available over Winter 2023. Complete physical decommission is scheduled to be completed during Summer 2023. Please reach out to CEES support if you need help moving your jobs off of Mazama to Sherlock, or another compute platform.' %}


#### Overview:

Mazama is a suite of compute resources, owned and opearated by Stanford Earth (now SDSS). The Mazama HPC cluster is available to PIs, and their teams, who have purchased nodes on the system. Tool and GPU servers (see below) are free to use for Stanford SDSS faculty, students, postdocs, and associates.

_However, because Mazama is slated for decommission, new accounts will be fulfilled on a very limited basis. All new workflows should be developed on Sherlock, or other compute platform._

#### The Mazama HPC cluster (~150 nodes)
- ~150 CentOS 7 (RedHat Linux clone) Nodes
- 64 GB memory
- 24 cores (2 x E5-2660 Intel, 12 core cpus)
- SLURM job scheduler
- Open HPC hierarchical software/module stack
- ssh (must be connected to VPN):
- ```$ ssh {SUID}@cees-mazama.stanford.edu```
    - note:
        - ```{SUID}@``` is not requried if your SUID is the same as your workstation ID
        - ```.stanford.edu``` may not be necessary, since you are using the VPN

#### Mazama Tool Servers
- 4 Independent compute nodes/servers
	- cees-tool-{7,8}: 512GB, 24 cores
	- cees-tool-{9,10}: 128GB, 24 cores
- Tools 7 and 8 share the HPC software stack and can be used to compile codes for or submit jobs to the HPC
- Tool servers are shared by several users
- Interactive workflow (jobs are not scheduled; resources are not dedicated)
- Can run Jupyter Notebooks (using ssh port forwarding or VNC)
- ssh (must be connected to VPN):
    - ```{SUID}@cees-tool-{1-10}.stanford.edu```

#### Mazama GPU Nodes
- Submit GPU jobs to SLURM job manager via `sbatch` or `srun` (for interactive jobs)
- Submit jobs to the `gpu` partition
- 3 Independent compute nodes/servers in `gpu`:
	- 24 CPU Cores, 512 GB RAM
	- cees-mazama-gpu-{2,3}: 4 x V100, 16GB
	- cees-mazama-gpu: 4 x K80
- Can run Jupyter Notebooks (using ssh port forwarding or VNC)
- ssh (must be connected to VPN **and** must be assigned resources (running a job) by SLURM ):
    - ```$ ssh {SUID}@cees-mazama{-gpu, -gpu-2, -gpu3}.stanford.edu```
-->

##### More Information:
SDSS-CC website: [https://sdss-compute.stanford.edu](https://sdss-compute.stanford.edu)


