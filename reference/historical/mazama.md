---
title: Mazama
---

# Mazama HPC and Tool Servers
<!--
:::{admonition} !!! MAZAMA Maintenance Status
:class: warning

On Friday, 13 December 2019, the CEES team performed a major maintenance on the Mazama HPC. 
This included an OS upgrade on the HPC compute and login nodes, migration to SLURM scheduler, and an upgrade to the filesystem.
:::
-->

The Mazama platform includes an approximatley 150 node HPC cluster and four tool-servers. "Batch" compute jobs can be submitted to the HPC via a SLURM job controller, using the `sbatch` command, or run interactively using `srun` -- see below for more details. The tool servers offer an interactive work-flow and do not require resources -- CPUs, memory, etc., to be requested or allocated, but with the understanding that those resources may be shared by multiple users. Tools 7 and 8 are integrated with the HPC so that they can be used to  compile codes and submit SLURM requests to the HPC.

<!-- yoder 5 May 2020: Notes for git:: Deleting old Mazama update status messages/comments below. If it is necessary to recover, they can be found in the previous git commity.-->


## Connecting to Mazama HPC and Tool Servers: SSH and VPN
Connections to Mazama are made via Secure Shell (SHH).  On Linux or MacOS systems, an ssh client is often installed in the default configuration or easily installed using a package manager. 
For more information, including installing SSH for Windows, see [Installing an SSH client](../getting-started/general-requirements).

Even on campus, most connections to Mazama require a connection to the Stanford VPN:

- [Stanford VPN Instructions](https://uit.stanford.edu/service/vpn/linux "Stanford VPN")
    
Mazama Tool Servers and HPC share some disk systems, including `$HOME` and `/data`. Data and files copied to `$HOME` from one tool server, for example, will be available from other tool servers and to batch jobs running on the cluster.  Accordingly, large file copy operations, code compilation, and script prototyping can be performed on tool servers and then scaled up to run on the HPC.

# Mazama HPC:
Mazama is an HPC cluster consisting of approximately 150 nodes, each with 24 cores at 2.2GHz and 64 GB memory. As of December 2019, Mazama employs a SLURM job manager and compute nodes run CentOS 7. The most common way to run jobs on the HPC is to submit a "batch" script that requests resources and then runs tasks (programs and job steps). Additionally, jobs can be run interactively on dedicated resources by using the `srun` command, and interactive shell sessions can be instantiated by combining `srun` and `bash` (or another shell program) commands -- see details below. Tool servers -- again, see below, can also be used to run interactive sessioons or as login nodes.

:::{admonition} Compute nodes mount $HOME read-only!
:class: info

Note that HPC compute nodes may mount your $HOME drive as read-only. Attempting to save data to your $HOME drive might result in an error. In these cases, please direct all disk-write activity to a `/data` or ideally to a `/scratch` path.
:::

## Accounts
Mazama HPC is available to PIs, and their teams, who own nodes on the cluster. 

## Connecting to Mazama HPC
The first step to running a job is to connect to a login node using your Stanford SUNetID:

        $ ssh <SUNetID>@cees-mazama.stanford.edu

This will connect you to a *login* or *head* node. These nodes are * ** not ** * for computation. Use these nodes for small data transfer jobs, moderate compilation, scheduling batch jobs, and other low impact staging activities. Compute intensive activities -- including extensive code compilations and data copy jobs, should be either queued to run in batch or run on Tool Servers -- see below.

**Authentication:** Logins to Mazama can be authenticated either via your SUNetID + password, or via `ssh key`. Detailed information about `ssh` authentication, including how to create and install authentication keys can be found at: [https://www.ssh.com/academy/ssh/public-key-authentication](https://www.ssh.com/academy/ssh/public-key-authentication). As an example, from your local (mac or Linux -- Windows users see: [https://www.ssh.com/academy/ssh/putty/public-key-authentication](https://www.ssh.com/academy/ssh/putty/public-key-authentication)) machine (that you want to use to connect to Mazama), create a `4096` bit `rsa` type key; save it as `${HOME}/.ssh/id_laptop_rsa`

	[you@local_machine ~]$ ssh-keygen -t rsa -b 4096 -f ${HOME}/.ssh/id_laptop_rsa
	Generating public/private rsa key pair.
	Enter passphrase (empty for no passphrase): 
	Enter same passphrase again: 
	Your identification has been saved in /home/myoder96/.ssh/id_laptop_rsa.
	Your public key has been saved in /home/myoder96/.ssh/id_laptop_rsa.pub.
	The key fingerprint is:
	SHA256:RaNZa1eKN3SflhnvE8GPDBlYru7P5tmswmkD1Tak8jg myoder96@maz042
	The key's randomart image is:
	+---[RSA 4096]----+
	|          +o+o+o |
	|         =.*++ oB|
	|        o =+*o B+|
	|        .oo++.+.o|
	|        S=.. . ..|
	|        E..     .|
	|         +..     |
	|         .*..+   |
	|         ..**.o  |
	+----[SHA256]-----+
	(base) [you@local_machine ~]$ ls $HOME/.ssh
	authorized_keys  id_laptop_rsa.pub  id_mazama_github.pub 
	id_laptop_rsa	 known_hosts
	[you@local_machine ~]$

Note that this process creates two files: The *private key*, `id_laptop_rsa` and the *public key*, `id_laptop_rsa.pub`. The private key should never be shared, duplicated, or copied off of its host device except under the most secure conditions. The public key can be shared with other systems to facilitate secure, encrypted authentication. The most direct way to do this is to simply `copy-paste` the contents of the ssh key into your `${HOME}/.ssh/authorized_keys` file on the host machine (Mazama). For example, show the contents of the ssh key/certificate (you can also use a text editor):

	[you@local_machine ~]$ cat ${HOME}/.ssh/id_laptop_rsa.pub
	ssh-rsa AgmAB3NzaC1yc2EAAAADAQABAAACAQDEIYFO22Run9cs1gvNXpNuJNq7AgJsPzYt/NcsPZ+/ti9vsCxZ8omxZ3lMLj+z5xFFgbhSi3lMmAKrUw7sGlAwdg6eX5L73oJF/B8xVFI395fjKrkzzWYfrmsXmrNUSW3O34KbSQpyDrJmdvSvnimNuW+m7fIBjYD19yym0nwjlAyQTRMLmL7gzzvhh9fAu8DIQ6X4yM80aS0n/pbCB+Noc3Tv6giQxw7klMt+6+Gf4eTE/ThrHrDkDuLBv9tlJy2Tcp+2Za2TmgFkG9Ec6/BEArI+cU/nXO/BUR6RvY9u8fMcJguR0BSPKyDrXcn64dc8zV6rfdCjbkRQYZJMq9DqRTykAsHx2luqX4vTU8FSt4ZG82ZUtcJw9f8FBdCbc12hZbr0JpU94gZT8raEnLETtmcB4fWD+7mpFbEieS0u0AAgnSb8tjTDSK7MB20oH5XU9g38R2I60QV3kqP5dBEkAmG6u44rpiXYLOS2k2tGgZMhq3KSwHaYXqvOzCuo1dq9I8lmhZw3zmbJM+Tnlb39W2bidu55KKq2eRBsxAwLvGvjWJZOtocJzu7r/OcIN5llBhcpl89XOLqnlHA/q0Uc4YgWxYiSIKkJsBFsYC16hniYru//eXP3fos7KkbYQPZY3mQmZsk8ZrHF0dqWaVd1IYGS+xYDznlXex6nPVjIgw== you@local_machine

Then log in to Mazama and copy-paste the entire output -- starting with `ssh-rsa` ending with the description `you@local_machine` to `${HOME}/.ssh/authorized_keys`. Note that there are also command-line, and other, tools such as `ssh-copy-id` to automate this workflow: [https://www.ssh.com/academy/ssh/copy-id](https://www.ssh.com/academy/ssh/copy-id).

## Submitting Jobs

Jobs are run on Mazama HPC by submitting batch scripts to a SLURM scheduler. For more information about _SLURM_, refer to [SLURM basics](../sherlock/slurm-basics). SDSC also provides a useful [cheat-sheet](https://www.sdsc.edu/~hocks/FG/PBS.slurm.html). SLURM will correctly interpret and run most older PBS batch scripts, but 1) new scripts should be written in SLURM, and 2) it is generally speaking a good practice to translate old PBS scripts to SLURM. 

Note also that as of 16 December 2019, the default partition (queue) on Mazama is called `twohour`. This is a shared partition with -- as the name suggests, a two hour limit applied to job runtimes.

Scripts contain two sections:
1. Resource requests, and other job specificaiton parameters
2. A list of tasks (executable commands) to perform

## SLURM Batch Scripts

Detailed descriptions of script parameters and numerous examples of sample script can be found by searching the internet.  A simnple sample SLURM script, to run an MPI job called *hellompi* (an MPI version of a *hello world* code) might look like this:

    #!/bin/bash
    #SBATCH --job-name TestJob
    #SBATCH --ntasks=8
    #SBATCH --partition=default
    #SBATCH --mem-per-cpu=1GB
    #SBATCH --time=00:01:00
    #SBATCH --error=/data/cees/test.err
    #SBATCH --output=/data/cees/test.out
    #
    # Job steps:
    # use the SLURM equivalent:
    #cd $PBS_O_WORKDIR
    cd $SLURM_SUBMIT_DIR
    #
    mpirun hellompi >> OUT
    # end script

Note the same script in PBS would look (approximately) like this:

	#!/bin/bash
	#PBS -N TestJob
	#PBS -l nodes=1:ppn=8
	#PBS -q default
	#PBS -V
	#PBS -m e
	#PBS -M <YOUR SUNETID>@stanford.edu
	#PBS -e /data/cees/test.err
	#PBS -o /data/cees/test.out
	#
	cd $PBS_O_WORKDIR
	#
	mpirun hellompi >> OUT
	# end script

Numerous additional examples and documents regarding SLURM and MPI can be found on the web.  For this example, we can save the above SLURM script as `run_hellompi_SLURM.sh`, and submit it to the queue using the `sbatch` command,

	$ sbatch run_hellompi_SLURM.sh

Some additional SLURM commands (and their /PBS equivalent -- see man pages for more options):

- **squeue / showq:**  Show all running and queued jobs
- **scontrol show job <job#> / checkjob <job#> :**  Display information about a specific job. 
- ** squeue <job#> / qstat <job#>:**  Checks status of jobs.
- <strong>sbatch / qsub  \<filepath\>: </strong> Submits a job script to the batch system. After submission, the batch system will execute the job on the cluster and return the results to you.
- **scancel <job#> / qdel <job#>:**- Deletes a job. Takes the job number as the argument.

## Interactive sessions: OnDemand
Mazama's Open OnDemand service provides a web based UI to access Mazama HPC resources. OoD can be accessed by connecting to the VPN, then directing your browser to: [http://cees-mazama.stanford.edu](http://cees-mazama.stanford.edu). For more detailed informatioon, see the [OnDemand Support page](mazama-ondemand).

## Interactive sessions: Shell
Interactive sessions shell sessions can be requested by wrapping a `bash` (or other shell) command in an `srun` request. For example,

```
(base) [myoder96@maz-login01 ~]$ srun --ntasks=2 --mem=8gb --pty bash
srun: job 1378120 queued and waiting for resources
srun: job 1378120 has been allocated resources
(base) [myoder96@maz044 ~]$ 
```

Note that the options available for `srun` are very similar to those available for `sbatch`, and note specifically the `--pty` option is necessary for an interactive shell session. Note that one limitation of interactive sessions is that the compute nodes mount ther `$HOME` drive as read-only. Therefore, all IO (compiled codes, data-writes, etc.) should be directed to either a `/data ` or `/scratch` paths.

Additional interactive options, including _Open on Demand_ and _VNC_ interfaces are currently being evaluated or are under development for Mazama HPC.

# Mazama Tool Servers

:::{admonition} MAZAMA GPUs now managed by SLURM
:class: info

GPU resources on the GPU servers are now managed by SLURM! See below for more information. 
:::

Mazama Tool servers are remotely accessed compute nodes, designated for interactive computing sessions. Sessions and resource allocations are not regulated, so users are asked to self-police as best possible. This means:
- Please close unused sessions
- Do not run jobs that use excessive memory. If you have a high memory consumption job, please contact CEES; we will find resources to facilitate your requirements.
- Do not use more than 4 compute cores. Note some software, like TensorFlow -- and other multi-threading capable packages will default to use all available resources available on the machine.

There are four (4) Tool Servers in the Mazama system; as a courtesy, the GPU nodes should be used for GPU computation only. For other types of computation, use one of the CPU ("regular") Tool Servers. The Tool servers are:

- cees-tool-7: CentOS 7, 24 cores, 512 GB
- cees-tool-8: CentOS 7, 24 cores, 512 GB
- cees-tool-9: CentOS 7, 24 cores, 128 GB
- cees-tool-10: CentOS 7, 24 cores, 128 GB



## Accounts
All SDSS students are eligible for accounts on Tool Servers. If you do not have an account, contact CEES Support.

## Connecting to Tool Servers
Connect via ssh,

	$ ssh <SUNetID>@cees-tool-{n}.stanford.edu

There are two GPU servers available for direct SSH access,

	$ ssh <SUNetID@cees-gpu.stanford.edu
	$ ssh <SUNetID@cees-gpu-2.stanford.edu

A third GPU server is available on the network, but has been configured for SLURM access.

## R-Studio on Mazama Tool Servers
R-Studio is available on cees-tool-8 and cees-tool-9. R-Studio can be directly accessed, with an active VPN connection, via:

- [tool-7: http://cees-tool-7.stanford.edu:8787/auth-sign-in](http://cees-tool-7.stanford.edu:8787/auth-sign-in])
- [tool-8: http://cees-tool-8.stanford.edu:8787/auth-sign-in](http://cees-tool-8.stanford.edu:8787/auth-sign-in])
- [tool-9: http://cees-tool-9.stanford.edu:8787/auth-sign-in](http://cees-tool-9.stanford.edu:8787/auth-sign-in])

# GPUs on Mazama
The Mazama system hosts three (3) GPU servers: 

- cees-mazama-gpu: CentOS 7, 24 cores, 512 GB, 8 x K80
- cees-mazama-gpu-2: CentOS 7, 24 cores, 512 GB, 4 x v100
- cees-mazama-gpu-3: CentOS 7, 24 cores, 512 GB, 4 x v100

Until July 2020, these servers were treated as "tool" machines -- accessed directly via `ssh` and with no formal managment of resources. High demand for these resources necessated placing them under SLURM management. To gain access to GPUs, launch an interactive shell session from either the `cees-mazama` login node, one of the tool-servers, or by direch `ssh` to the GPU node (but it will still be necessary to request resources from SLURM). All GPU nodes are in a special partition appropriately namec, `gpu`. For example,

    $ ssh cees-mazama

Then request an interactive `bash` session with GPU resources,

    $ srun --partition=gpu --gres=gpu:1 --pty bash

Of course, jobs can also be submitted to the batch queue,

    $ sbatch --partition=gpu --gres=gpu:1  job_script.sh

For multiple CPUs, it is best to specify `cpus-per-task` , or probably even better explicitly `--cpus-per-gpu` (for either `srun` or `sbatch`):

    $ sbatch --partition=gpu --gres=gpu:1 --ntasks=1 --cpus-per-task=2  job_script.sh
    $ sbatch --partition=gpu --gres=gpu:1 --ntasks=1 --cpus-per-gpu=2  job_script.sh

Note that the second option will scale more easily into production -- for example if you do your development work on a single GPU and then scale up to multiple devices for production runs, this syntax will (more) automatically scale up the number of CPUs and memory (memory in HPC is often assigned, by default, on a per-cpu basis), which could prevent an application from inadvertently becoming CPU or system-memory bound when scaled up. Attempting to assign cpus via `--ntask` could produce unintended, and even unpredictable, results -- like running the jobs twice in parallel or leaving one CPU idle, so it is best to be request specifically how CPUs are bound to hardware.
