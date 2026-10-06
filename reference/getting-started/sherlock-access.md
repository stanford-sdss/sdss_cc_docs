---
title: Getting Started -- Sherlock
---

# Getting Started: Sherlock


:::{admonition} Please compute courteously!
:class: warning

Remember, SERC is a shared resrouce! Please restrict jobs to approximately 300-500 concurrent CPUs per individual.
:::



## SDSS-CC resources on Sherlock
In addition to the public partitions (or queues), `normal`, `dev`, `gpu`, `bigmem`, and `owners`, SDSS users have access to the large shared `serc` partition. The `serc` partition currenly consists of 232 compute nodes, including more than 9000 CPU-cores, 92 GPU devices, up to 1 TB RAM, and 1.3 PB storage on [oak](oak-storage). Jobs can be run on the `serc` partition by including the SLURM directive `--partition=serc` in `srun`, `sbatch`, and `salloc` commands.

SDSS users may also submit jobs to the `owners` partition. This is a special queue for Sherlock users who own nodes. All unused resources on are placed into the `owners` queue and are available `owners` members to run jobs. However, if the actual owner of one of those resources requests them, any jobs running on those nodes might be *preemted*, or killed, to make them available to the owner. Preempted jobs are given a 30 second warning signal, during which time they can checkpoint -- if they are configured to do so. Preemption is typically uncommon -- a 2020 analysis showed `<3%` of jobs are preempted, but jobs run on the `owners` partition should accomodate for the possibility of preemption.

## How do I get an account?
Generally, all Stanford researchers and affiliates are eligible for a Sherlock account; the specific requirements are detailed here:
- [Sherlock Prerequisites](https://www.sherlock.stanford.edu/docs/getting-started/prerequisites/ "Sherlock Prerequisites") .

In summary, these requirements are:
- Approval by a Stanford PI (or being a Stanford PI) is required
- A current SUNetID
- Send a request to [srcc-support@stanford.edu](mailto:srcc-support@stanford.edu)
- CC your PI in this request, since explicit approval is required

## SRCC Sherlock Documentation:
- [Sherlock Home](https://www.sherlock.stanford.edu "Sherlock Home")
- [Sherlock Docs](https://www.sherlock.stanford.edu/docs/overview/introduction/ "Sherlock Docs")

SDSS researchers are eligible to run jobs on the `serc` partition, or PIs may purchase thier own nodes. If your team requires additional computing capacity, [contact the SDSS-CC management team](/get-in-touch) to discuss options.

## Connecting to Sherlock:

As is standard with HPC systems, connections to Sherlock are made via Secure Socket Shell, or `ssh`. Users not faimiliar with `ssh`, Linux command line, or HPC operations should refer to the detailed tutorials proviced by SRCC:
- [Connecting to Sherlock](https://www.sherlock.stanford.edu/docs/getting-started/connecting/ "Connecting to Sherlock")

Connect to sherlock via ssh, from a *nix command line (if your system does not have an ssh client, see the [Installing an SSH Client](#installing-an-ssh-client) section below):

	$ ssh <SUNetID>@sherlock.stanford.edu

Sherlock requires [two factor authentication](https://uit.stanford.edu/service/authentication/twostep). This means that, in addition to providing a username and password, Sherlock will require temporary numerical authentication code, delivired to a mobile device via text or an app, or provided by an app by a "push;" the app of choice at Stanford is DuoMobile.

Once secondary authentication is satisfied, you will be logged in and greeted with a status screen. Your prompt will be something like,
        [{your_su_id}@sh-ln{xx} ~] $

Note that the `ln{xx}` indicates a *login node*, your initial point of contact with the HPC system. These nodes should be used only to do simple, single process, non-compute intensive tasks, such as scheduling jobs, simple file copies, etc. Login nodes are not for computation.

:::{admonition} Login nodes are NOT FOR COMPUTING!!!
:class: danger

Login nodes are not for computing! Large compute jobs should be submitted to the job scheduler; medium intensity computing, including compiling codes, code development, and test-runs should be performed on an interactive session (see below).
:::

To run computational jobs, request compute resources from Sherlock's management system, which is called SLURM.

## Interactive sessions: `salloc` and `srun`
For more rigorous staging tasks -- including long, compute intsnsive code compilation, and running test jobs, or for moderate scale compute jobs, consider opening an interactive session. Sherlock administrators have provided the convenience `sdev` script -- which is an `srun`-`bash` wrapper shortcut, for interactive session. For example,

	sh_dev -c 2 -m 8g -p serc

which is (approximatly) equivalent to

	salloc --cpus-per-task=2 --ntasks=1 --mem-per-cpu=4g --partition=serc
 
or

	srun --cpus-per-task=2 --ntasks=1 --mem-per-cpu=4g --partition=serc --pty bash       
		
will request an interactive session with 2 cores, on a single node, from the `serc` partition  and `16GB` memory (`2 GB/CPU`). Depending on the resources you request, this might take a few minutes. When the system can allocate resources, you will see a new prompt like:

	[{suid}@sh-ln01 login ~]$ salloc --cpus-per-task=2 --ntasks=1 --mem-per-cpu=4g --partition=serc --time=02:00:00
	srun: job 51237294 queued and waiting for resources
	srun: job 51237294 has been allocated resources
	[{suid}@sh-101-58 ~]$ 

Note the `sh-xxx-yy` machine name designates a "shell" or worker node. Note also that `srun` jobs are session-limited, meaning that if the terminal session from which they were launched is closed or interrupted, the `srun` job will be killed. For long tasks, or if connectivity is unstable, consider using `sbatch` instead -- see below.

## Batch Jobs: `sbatch`
Broadly speaking, computing tasks should be scripted and queued to run in batch -- whenever possible. This means that the parameters and  runtime syntax for a given job are worked out in advance and written into a script that is submitted to a queue to be run, unattended, when the requested resources become available.

For more information, including sample scripts, please refer to the SRCC Sherlock documentation:
- [Submitting Jobs to Sherlock]( https://www.sherlock.stanford.edu/docs/getting-started/submitting/ "Submitting Jobs to Sherlock")

Note that, in order to submit the job to the *serc* partition, the job must be submitted with the `--partition=serc` option, or with the `#SBATCH --partition=serc` in the SLURM requests section of the job script. By default (if no partition is specified), jobs will be submitted to the public `normal` partition.


## Sherlock On-Demand:

- [Sherlock Web Interactive Portal](https://login.sherlock.stanford.edu/pun/sys/dashboard)

Another way to use Sherlock is to connect to the _On-Demand_ web based UI. _On-Demand_ hosts several applications and HPC functions. Sherlock _On-Demand_ can be useful for Windows users, in lieu of a native SSH client, specialized applications, or for users who simply prefer the Web based UI. Available applications include:

- Job scheduler
- Interactive shell
- File manager (to copy files to/from Sherlock, from your local computer)
- Jupyter Notebooks
- RStudio Server
- Tensorboard
- MatLab
- CodeServer


## Installing an SSH client

Windows users may need to install a *nix VM client or similar
applicattion. Examples include:
- Cygwin
- Putty
- WSL (Windows Subsystem for Linux)
- See the [SDSS-CC Sherlock](https://www.sherlock.stanford.edu/docs/getting-started/prerequisites/) documentation for more details

On Unix, Linux, MacOS, and other *.nix* systems, the ssh client is typically either installed as a standard component or or easily acquired. In most cases, it can be installed using a package manager. For example, in Debian, Ubuntu, and Mint (note: the exact syntax and package names may vary):

	$ apt-get update
	$ apt-get install ssh-client
        
will install an ssh client (note it may be necessary to run these commands using `sudo` elevated privileges).

	$ apt-get update
	$ apt-get install ssh-server

will install both ssh-client and ssh-server components.

On CentOS and other RedHad derivative distributions,

	$ yum -y install openssh-server openssh-clients




