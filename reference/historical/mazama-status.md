---
title: Mazama Update Status
---
:::{admonition} December MAZAMA maintenance
:class: warning

The CEES Admin team performed a major maintenance oin the Mazama HPC.
:::


# Mazama Update Status
 
## Synopsis:

On Friday, 13 December 2019, and over the following weekend, the CEES HPC Administration and Support team performed a major update of the Mazama computing cluster. In particular, we would like to thank Randy “RC” White for shouldering the brunt of this effort, and for his continued support over the last week sorting out the bugs and glitches that are inevitable with this type of overhaul.

At this time, the HPC and tool servers are up and jobs are running. We are working through a few issues, and there may be some operational changes. We SRCC and CEES support staff will be available after the Winter closure to provide assistance.

<!--
In an effort to improve the computing environment -- to make it more maintainable, intuitive to use, and consistent with contemporary HPC standards, there may be some changes
-->
 
## Status and summary of the update:

At this time, the Mazama HPC is up, and jobs are running. At last report there may still be a few nodes that – as per the normal wear and tear that comes with age -- did not come back up, but generally Mazama is operational.
 
Tool servers 7,8,9,10 are up and operational.
 
From a user perspective, the most significant updates include (see discussion below):
- Update from CentOS 6 to CentOS 7 on the HPC compute and login nodes
- Upgrade and transition from a MAUI/TORQUE (PBS) to SLURM job manager
- The BeeGFS filesystem was *not* upgraded, as was originally planned, and has been postponed until some time during the Winter, 2020 quarter.
 
## Expected benefits:

First and foremost, the operating system (OS) update was necessary; CentOS 6 will not be supported as of January 2020. Additionally, updating the operating system will facilitate easier installation of software, as per improved compatibility with modern software component libraries. Additionally, enhanced remote administrative capabilities were enabled that will assist us to better maintain the system, and we will be enabling usage auditing tools to better optimize the system to meet research requirements.
 
## Expected impacts:
The HPC compute and login nodes were completely rebuilt, and as stated above, the job scheduler, OS, and organization of available software has changed, so some job submission and compilation scripts may require revision.

- **Job Scheduler:** SLURM supports significant compatibility with PBS, but 1) this compatibility layer is not perfect, and 2) jobs will generally run better using SLURM syntax, so we recommend that job scripts be migrated on an as-needed, then as-convenient basis.
- **System software missing:** Some libraries and packages previously available as part of the base OS may not be available. In some cases, this may be an oversight, which we will resolve by installing the libraries directly to the system. In other cases, we may build modules, and in still other cases, we may opt for local installation.
- **System software reorganized:** In some cases, system software and modules may have moved or been reorganized. As usual, see:

	`$ module avail `
	
	or
	
	`$ module spider`

to show available modules.
- `tcsh` vs `bash` shell: SLURM appears to take issue with `tcsh` shell scripts. We are working on this;  `bash` scripts appear to execute more reliably.
 
 
## Tool and HPC OS mismatch
**Summary of Issue:** Currently, Mazama Tools 7,8 are still running CentOS 6. The HPC and tools 9,10 run CentOS 7. To minimize disruption, particularly for researchers who use the tool servers exclusively, we have chosen to postpone updating the OS on Tools 7,8 until early Winter quarter 2020. Codes compiled on Tools 7,8 may not be compatible with CentOS 7 on the HPC.
 
**What has changed?** The OS on the HPC has been upgraded. This OS inconsistency has existed for some time, except that Tools 9,10 were running the odd OS (different than the HPC); now 9,10, and HPC are all on CentOS 7; Tools 7,8 are still on CentOS 6. 
 
**Who is affected:** Researchers who compile codes on Tools 7,8 to run on the HPC (or Tools 9,10).
 
**Summary of impact:**
- Work performed exclusively on Tools 7,8 (aka, codes compiled and run on 7,8, data analysis on 7,8, etc.) will be unaffected. 
- Codes compiled on Tools 7,8 might not run (correctly) on the HPC or Tools 9,10.
- Some programs (compiled earlier in the CentOS 6 environment) will need to be recompiled to run in CentOS 7 (see below for more on this).
 
**Resolution:**
- Long term: There will be a plan to update Tools 7,8 to CentOS 7 in early winter quarter 2020.
- Short term:
	- Compile codes on Tools 9,10 (not 7,8)
	- Small codes can be compiled (but not run) on the HPC login node, but please remember that login nodes are heavily shared resources.
	- Compilation can be executed on HPC either by submitting a job (`$sbatch`) or  via `$srun` :
		- NOTE: Your `$HOME` drive may be mounted read-only on compute nodes, so compile codes in `/scratch` or `/data` (which will also be faster)
 
 

