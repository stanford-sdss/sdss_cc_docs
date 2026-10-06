---
title: Mazama Update Info
---
:::{admonition} December MAZAMA maintenance
:class: warning

The CEES Admin team performed a major maintenance oin the Mazama HPC.
:::


# Mazama Maintenance (13 December 2019)

## Status:
- The maintenance was performed -- as described below, on 13 December and over the course of the weekend. 
	- One exception: The BeeGFS filesystem upgrade is being postponed to a later date,
- The Mazama HPC is back online; there may be a few nodes still offline due to hardware problems (at last count, there were three nodes not coming up)
- As described, the OS has been upgraded to CentOS 7; the job scheduler is now SLURM. Therefore:
	- SLURM manages some level of PBS compatibility, but some scripts will need to be migrated to SLURM (see [SLURM Basics](../sherlock/slurm-basics)). In some cases, a partial migration will suffice, for example in a PBS script that sets a working directory via the `$PBS_O_WORKDIR` variable, set the SLURM equivalent, `$SLURM_SUBMIT_DIR`.
	- Some codes may need to be recompiled to be compatible with the new OS (though there is a compatibility layer that will handle some of this)
	- We are chasing down some configuration issues with Intel compilers
	- It is possible that compilation scripts using CLAB modules (and other components that were compiled with very specific compatibility in mind) might need to be modified to use different HDF5, OpenMPI, and other modules. We will update the status of this issue as soon as we have more information.
	

## Maintenance:

**What has happened?** SRCC and CEES admins performed maintenance and upgrades on the Mazama cluster over the weekend of Friday, 13 December 2019. 

**Systems affected:** 
- Mazama HPC compute, login, and filesystem nodes will be shut down and upgraded. 
- **_Not affected_**: 
	- Mazama tool servers (cees-tool-{7,8,9,10}) **were not** upgraded and not affected, aside from being restaarted.
	- RCF HPC and Tool Servers (cees-tool-{3,4,5,6}) and Sherlock **_were not_** be affected by this maintenance.

**Who is affected?** All researchers using the Mazama HPC

**Summary of updates:**

- Upgraded OS from CentOS 6 to CentOS 7 on HPC nodes. This will improve performance, package compatibility, and system supportability
- Replaced the MAUI/TORQUE job scheduler with the more flexible and advanced SLURM manager.

**Expected impacts:**

- SLURM supports significant, but limited compatibility with PBS scripts. Most PBS scripts should run, but scripts should be migrated to [SLURM syntax](../sherlock/slurm-basics).
- Some familiar software packages may not have been reinstalled. We are working to resolve these issues.
- Most codes will require or benefit from recompiling to run on the upgraded OS.
- Some familiar modules may not work and will need to be recompiled. In some cases, it may be optimal to compile user-specific codes locally; in others cases, SRCC and CEES staff may add modules to the system.
- Some jobs may require revised “module load” scripts

**Support:**
- Support will **_not_** be availble during Winter Closure (21 December - 5 January)
- Before and following the break, CEES support staff will be available via the normal [channels](/get-in-touch):
  - Send email to [srcc-support@stanford.edu](mailto:srcc-support@stanford.edu)
  - Stanford Earth [*CEES* Slack channel](https://earth.stanford.edu/inside/knowledge/join-stanford-earth-slack)
  - Mark Yoder (Polya 259 or Mitchell B29)
  - Randy "RC" White
  - Bob Clapp

# A few upgrade related experiences you are likely to have
:::{admonition} Modify your known_hosts file
:class: warning

The new Mazama login node has a new identity key. You will need to delete the old entry from your .ssh/known_hots file
:::

## Remote Host ID
### The remote host identification for Mazama has changed! When you login to Mazama, you will probably see a message like this:
```
(base) UIT-C02YT0LBLVDP:globalETAS myoder96$ ssh cees-mazama
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the RSA key sent by the remote host is
SHA256:kf52yP0sxo1JbRgWrn5iekLUv9d+15sss4wXPmEPJdo.
Please contact your system administrator.
Add correct host key in /Users/myoder96/.ssh/known_hosts to get rid of this message.
Offending RSA key in /Users/myoder96/.ssh/known_hosts:13
RSA host key for cees-mazama has changed and you have requested strict checking.
Host key verification failed.
(base) UIT-C02YT0LBLVDP:globalETAS myoder96$ 
```
**Solution**: edit your $HOME/.ssh/known_hosts file; remove the entry for `cees-mazama` and/or `cees-mazama.stanford.edu` .  Alternatively, you can use `$ ssh-keygen -R` to remove `cees-mazama` entries:
```
(base) UIT-C02YT0LBLVDP:globalETAS myoder96$ ssh-keygen -R cees-mazama
# Host cees-mazama found: line 46
/Users/myoder96/.ssh/known_hosts updated.
Original contents retained as /Users/myoder96/.ssh/known_hosts.old
```
Depending on how you log in, `cees-mazama` and `cees-mazama.stanford.edu` will have separate entries:
```
(base) UIT-C02YT0LBLVDP:globalETAS myoder96$ ssh-keygen -R cees-mazama.stanford.edu
Host cees-mazama.stanford.edu not found in /Users/myoder96/.ssh/known_hosts
```
Now, `ssh` to `cees-mazama` the usual way and confirm the new identity:
```
(base) UIT-C02YT0LBLVDP:globalETAS myoder96$ ssh cees-mazama
The authenticity of host 'cees-mazama (171.67.96.250)' can't be established.
ECDSA key fingerprint is SHA256:XPpvY71wfA1jPAuNLUDVIOPbxrIPWhYb+u8b8FDN08Q.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'cees-mazama,171.67.96.250' (ECDSA) to the list of known hosts.
myoder96@cees-mazama's password:
```

A third alternative is to delete the `known_hosts` file, but you will then be asked to verify the authenticity of every previously "known" server in the file.

## SLURM Job Scheduler
One of the changes to Mazama was to upgrade to the SLURM job manager. SLURM uses a native syntax that is different than PBS schedulers, but it does maintain significant compatibility with PBS scripts, so we expect most PBS job submission scripts to run with only minor modifications -- though in the long run, we encourage migration to SLURM. Here, we provide a couple of very simple test script examples; for more, see [SLURM basics](../sherlock/slurm-basics).

## Sample sessions

1. Connect to the Mazama login node and view the queue:

		$ ssh cees-mazama
		... 
		[-bash-4.2$ Welcome to cees-mazama (and other front-matter...)
		[-bash-4.2$ squeue --all
					 JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		[-bash-4.2$ 

2. Submit a simple SLURM script to 1) return the memory information from the assigned node, and 2) wait a bit so we can track it in the queue:

	Open `vim`, or another editor:
		
		[- bash-4.2$ vim mem_info_sleep.sh
		
	And write this script ( or something like it):
	
		#!/bin/bash
		#
		#SBATCH --job-name=mem_info_with_sleep
		#
		#SBATCH --time=5:00
		#SBATCH --ntasks=1
		#SBATCH --output=mem_info_output.out
		#
		# a simple toy script to fetch mem info on the assigned node, then sleep a bit
		#  so we can show it in the queue.
		#
		srun cat /proc/meminfo
		srun sleep 10
		srun echo finished!
	
	Now, call `sbatch` to submit the job to the queue and monitor the job by calling `squeue`. The job will run for approximately 10 seconds (the `sleep` parameter from our script) and write the output to the specified output file, `mem_info_output.out`:

		[-bash-4.2$ sbatch mem_info_sleep.sh 
		Submitted batch job 30
		[-bash-4.2$ squeue
		JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		30    normal mem_info myoder96  R       0:03      1 maz163
		[-bash-4.2$ squeue
		JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		30    normal mem_info myoder96  R       0:05      1 maz163
		[-bash-4.2$ squeue
		JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		30    normal mem_info myoder96  R       0:09      1 maz163
		[-bash-4.2$ squeue
		JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		30    normal mem_info myoder96 CG       0:11      1 maz163
		[-bash-4.2$ squeue
		JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		[-bash-4.2$ 
 
	
	You can now view the output (node memory information) using `vim`, `cat`, `more`, or some other editor or viewer. Note, this is the output filename specified in the batch file. If we do not spedify a filenamne, SLURM will use a default name formatted lijke `slurm-{job_id}.out'. For example, the default output namne for this job would be `slurm-30.out`.:
	
		[-bash-4.2$ cat mem_info_output.out

3. Submit a similar job as a PBS script,

	Write this script:
		
		#!/bin/bash
		#PBS
		#PBS -l p=1
		#PBS -l walltime=00:00:59
		#PBS -N test_pbs_job
		#PBS -q normal
		echo "My first slurm job on PBS... I think?"
		#
		cat /proc/meminfo
		#
		sleep 10
		echo "** finished!! **"
	
	And submit it to the job scheduler:
		
		[-bash-4.2$ sbatch mem_info_sleep_pbs.sh 
		Submitted batch job 40
		[-bash-4.2$ squeue
		JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		40    normal test_pbs myoder96  R       0:02      1 maz163
		[-bash-4.2$ squeue
		JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		40    normal test_pbs myoder96  R       0:07      1 maz163
		[-bash-4.2$ squeue
		JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		40    normal test_pbs myoder96  R       0:10      1 maz163
		[-bash-4.2$ squeue
		JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
		[-bash-4.2$ 
		[-bash-4.2$ ls
		mem_info_output.out  mem_info_sleep_pbs.sh  mem_info_sleep.sh  slurm-39.out  slurm-40.out
		[-bash-4.2$ 
	
	Note that in this case, we did not specify the output fule, so slurm writes the output to the default format file, `slurm-40.out`. Note also that SLURM will also interpret the equivalent PBS syntax to check the queue:
		
		[-bash-4.2$ qstat
		Job id              Name             Username        Time Use S Queue          
		------------------- ---------------- --------------- -------- - ---------------
		40                  test_pbs_job     myoder96        00:00:00 C normal    
	
