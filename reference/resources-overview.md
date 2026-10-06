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
- **`serc` partition:**
    - 128 x SH4_CBASE: 24 CPUs (1 x AMD Epyc 8224p), 192 GB RAM
    - 16 x SH4_CPERF: 64 CPUs (2 x AMD Epyc 9384X), 384 GB
    - 4 x SH4_CSCALE: 256 CPUs (2 xy AMD Epyc 9754), 1.5 TB
    - 1 x SH4_G8TF64: 8 NVIDIA H100 GPUs, 64 CPUs
    - 200 x SH3_CBASE 32 core (AMD Epyc 7502), 256 GB RAM
    - 8 x SH3_CPERF 128 core (AMD Epyc 7742) 1024 GB RAM
    - ~~24 x 24 core (Intel Skylake), 192/384 GB RAM~~  (To be decommissioned some time in 2025) 
    - 10 x 8  NVIDIA Tesla A100 GPUs, 128 CPU cores (AMD Epyc 7662), 1024 GB RAM
    - 2  x 4  NVIDIA Tesla A100 GPUs, 64 CPU cores (AMD Epyc), 512 GB RAM
    - ~~2 x 4 NVIDIA Tesla V100 GPUs, 24 CPU cores (Intel Skylake), 192GB RAM~~  (To be decommissioned some time in 2025)
- Sherlock *owners* partition: Access to idle reseroudes owned by other PI groups.
- Public partitions: `normal`, `gpu`, `bigmem`, `dev`
- Oak 1.35PB storage:  `/oak/stanford/schools/ees/{PI SUNetID}`
-  ssh (requires 2-factor auth):
    - ```$ ssh sherlock.stanford.edu```

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


