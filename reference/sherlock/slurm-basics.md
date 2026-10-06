---
title: Getting Started -- SLURM Basics
---

# SLURM Basics

## HPC Computing Principles

:::{admonition} Login nodes are not for computing!
:class: danger

Login nodes are shared among many users and therefore must not be used to run computationally intensive tasks. Those should be submitted to the scheduler which will dispatch them on compute nodes.
:::

### Requesting resources

Jobs are run on HPC platforms such as Sherlock by requesting resrouces via a resource scheduler. The scheduler matches available compute resources (CPUs, GPUs, memory, ...) with user requests for resources.

The scheduler provides three key functions:

1. It allocates access to resources (compute nodes, CPU cores, memory, etc.) to user job requests for some duration
   of time.
2. It provides a framework for starting, executing, and monitoring work, including parallel computing tasks such as MPI, on a set of allocated nodes.
3. It manages a queue of pending jobs to equitably allocate resources.


### SLURM

<!-- HTML interlude for the main page logo -->
<style>
@media only screen and (max-width: 720px) {
    #logo_head {
        display: none;
    }
}
</style>
<img id="slurm_logo" align="right" height="115px"
     alt="Slurm" src="https://slurm.schedmd.com/slurm_logo.png"/>

[SLURM][url_slurm] is an open-source resource manager and job
scheduler that is rapidly emerging as the modern industry standrd for HPC schedulers. SLURM is in use by 
by many of the world's [supercomputers and computer clusters][url_top500], including _Sherlock_ (Stanford Research Computing - SRCC). Most users more familiar with MAUI/TORQUE PBS schedulers (an older standard) should find the transition to SLURM relatively straight forward.

Many submssion scripts are extremely simple and straight forward. For more complex jobs, the submission scripts are another layer of code that can significantly improve compute performance by accurately and strategically requesting the resources you need. Slurm supports a variety of job submission techniques to help you get your work done faster! As a rule of thumb, start with a simple script, then optimize to improve performance.

:::{admonition} Wait times in queue
:class: tip

As a quick rule of thumb, it's important to keep in mind that the more resources your job requests (CPUs, GPUs, memory, nodes, and time), the longer it may have to wait in queue before it could start.

In other words: accurately requesting resources to match your job's needs will minimize your wait times.
:::

## How to submit a job

A job consists in two parts: resource requests and job steps.

**Resource requests** describe the amount of computing resource (CPUs, GPUs, memory, expected run time, etc.) that the job will need to successfully run.

**Job steps** describe tasks that must be executed.


# Batch scripts

:::{admonition} SLURM syntax: Use the Google!
:class: tip

This tutorial will review some basic SLURM syntax and batch script examples, but there is no shortage of excellent references and tutorials available on the internet. Like any modern programming exercise, do not hesitate to search the web for examples and coding strategies.
:::

Most HPC jobs are run by writing and submitting a batch script.  A
batch script is a shell script (e.g. a _bash_ script) whose first comments,
prefixed with `#SBATCH`, are interpreted by SLURM as parameters
describing resource requests and submissions options[^man_sbatch].

The first step of the job is to request or allocate the resources; subsequent steps are executed using standard `*nix` syntax or the `srun` command. There are a number of ways to construct a parallel environment (ie, what resources to request and how to ask for them); some examples an be found here:
[https://sciwiki.fredhutch.org/scicomputing/compute_parallel/](https://sciwiki.fredhutch.org/scicomputing/compute_parallel/).

As an example,  the following script requests one task, one CPU, 
with 2GB RAM, for 10 minutes, in the default partition:

```
#!/bin/bash
#
#SBATCH --job-name=test_job
#SBATCH --partition=serc
#SBATCH --time=00:10:00
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem-per-cpu=2G
#SBATCH --output=job_output_%j.out
#SBATCH --error=job_output_%j.err

srun hostname
srun lscpu
srun sleep 60
```

When started, the tasks in the script are run sequentially. The job would run a first job step `srun hostname`, 
which will launch the command `hostname` on the node on which the requested CPU was
allocated. Then, a second job step will run `lscpu` (which lists CPU information), and a third will execute the `sleep` command. the `--output=` and `--error=` parameters tell SLURM where to output `stdio` and `stderr`, respectively (ie, the output that would normally be written to the screen will be written to these files).

You can create this job submission script on Sherlock using a [text
editor][url_texteditors] such as `nano` or `vim`, and save it as `submit.sh`. Alternatively, you can author
scripts on your local workstation and copy them to Sherlock via `scp,` `sshfs`, or via GitHub (or some other
version control system).

:::{admonition} SLURM directives must be at the top of the script
:class: info

SLURM will ignore all `#SBATCH` directives after the first non-comment line.  Always put your `#SBATCH` parameters at the top of your batch script.
:::

## Common resource requests
A batch script must request sufficient resources -- including the number and configuration of compute cores, memory, and time, to complete a job. For detailed information, please consult the official [SLURM documentation][url_slurm]. Reviewing a few of the more common options available to request resources:

 `--ntasks=<n>` : The number of independent programs, including MPI instances. By default, each _task_ is assigned one CPU. For example, if an MPI job is to run on 48 cores, `--ntasks=48` is a simple request that will secure sufficient resources.

`--cpus-per-task=<n>`: Number of cpus per independent task. For example, an MPI program with OpenMPI, Python Multiprocessing, and other threading based parallelization that is restricted to a single node can use this option to ensure that the the correct number of CPUs are allocated on a single node.

`--ntasks-per-node=<n>`: As it sounds, possibly to optimize latency bottlenecks or memory constraints.

`--ntasks-per-gpu=<n>`: As it sounds.

`--mem=`: Memory per node

`--mem-per-cpu`, `--mem-per-gpu`: Memory per CPU or GPU.

Specifying the `-per-task` or `-per-cpu` variants of resource requests can be useful for scripts whose development and prduction scales differ significantly (ie, a script is developed on only a few cores and the production runs request hunderds of cores) or across different node architectures.

## Hardware constraints
In complex HPC environments like Sherlock, where multiple hardware configurations coexist, it may be desirable to request specific hardware. For example, code compiled and optimized specifically for Intel processors may run much more slowly on an AMD core (and vice versa). Similarly, an MPI program might be significantly limited by its slowest member (or task), so it may be critical to request uniform hardware configurations. In SLURM, this can be achieved by using the `--constraint=<list>` SLURM directive.

On Sherlock, available constraints can be read using the `node_feat` command. An incomplete list for the Sherlock `serc` partition includes:

```
(base) [myoder96@sh03-ln08 login ~]$ node_feat -p serc
CLASS:SH3_CBASE
CLASS:SH3_CPERF
CLASS:SH3_G8TF64
CPU_FRQ:2.00GHz
CPU_FRQ:2.25GHz
CPU_FRQ:2.30GHz
CPU_FRQ:2.50GHz
CPU_GEN:RME
CPU_GEN:SKX
CPU_MNF:AMD
CPU_MNF:INTEL
CPU_SKU:5118
CPU_SKU:7502
CPU_SKU:7662
CPU_SKU:7742
GPU_BRD:TESLA
GPU_CC:7.0
GPU_CC:8.0
GPU_GEN:AMP
GPU_GEN:VLT
GPU_MEM:32GB
GPU_MEM:40GB
GPU_SKU:A100_SXM4
GPU_SKU:V100_PCIE
IB:EDR
IB:HDR
NO_GPU
```
For example -- for the `serc` partition, `--constraint="CLASS:SH3_CBASE"` will restrict allocated resources to Sherlock 3.0 standard `CBASE` nodes. For a job that requires AMD processors but is less dependent on uniform clock speed, `--constraint="CPU_MNF:AMD"` will permit the job to be split over both `CBASE` and `CPERF` AMD based nodes. To run the job entirely on either _all_ `CBASE` _or_ `CPERF` nodes, use brackets and the `or` operator,  `--constraint="[CLASS:SH3_CBASE|CLASS:SH3_CPERF]"`. Note that these constraints can also be achieved by specifying `CPU_SKU:<xxxx>`, or possibly the clock-speed.

Some common constraint requests include:
### Architecture specific compiled codes:
The best choice for architecture specific codes may vary with the various architectues. In many cases, it will be sufficient to specify the manufacturer of the chipset (Intel or AMD). This approach is not generally robust, but will likely be sufficient so long as older hardware has been retired and existing same-manufacturery hardware is sufficiently similar. For example, all AMD Epyc architecures compile with similar, compatible optimizations. Possible constraints include:
- `--constraint=CPU_MNF:AMD` or `--constraint=CPU_MNF:INTEL` (run on AMD or Intel architecture).
- `--constraint="CLASS:SH3_CBASE|CLASS_SH3_CPERF"` (allocate and run on CBASE or CPERF nodes. Note, this may result in a _mix_ of those two node types).

### MPI Jobs:
Typically MPI jobs should be run on homogeneous hardware. There are a number of reasons for this. Perhaps most obviously, an MPI job will always wait on its slowest component, so -- particularly if the job is well balanced, tasks on faster machines will always wait on slower machines, and so will not make efficient use of the resources allocated to them. Note that for larger jobs, for example comprised of mostly tasks at `2.5 GHz`, adding a handful of tasks at `2.0 GHz` could actually slow the job significantly. Constraints can be specified as:
- `--constraint="[CLASS:SH3_CBASE|CLASS:SH3_CBASE.1|CLASS:SH4_CBASE]"` (run exclusively on SH3_CBASE, SH3_CBASE.1, or SH4_CBASE nodes).

Referring to [serc_resources](serc-resources), this implies that on `serc` -- given the circa 2025 SH03+SH04 configuration, large MPI jobs should be restricted to `SH3_CBASE`, `SH3_CBASE.1`, `SH4_CBASE`, ` SH4_CPERF nodes`. For example,
- `--constraint="[CLASS:SH3_CBASE | CLASS:SH3_CBASE.1 | CLASS_SH4_CBASE]"`
- `--constraint="CLASS:SH4_CPERF"`

Note that the first option requests that the _entire allocation_ be fulfilled by _either_ `CBASE`, the newer, somewhat faster `CBASE.1`, or `SH4_CPERF`  machines. Mixing similar node types, `--constraint="(CLASS:SH3_CBASE | CLASS:SH3_CBASE.1)"`, might be reasonable in most cases where resources are limited (a full allocation of one or the other is not available), but will effectively restrict the faster machines to the lower clock speeds (and other performance factors) of the older nodes, and is genearlly considered an inefficient use of resources. SH3_CPERF and SH4_CSCALE machines are not well suited for large, CPU limited MPI jobs because, 1) they operate at lower clock speeds, and 2) they lack the memory bandwidth to operate all 128/256 CPUs simultaneously.

## Job submission

:::{admonition} Many jobs fail due to errors in the batch script
:class: tip

If you have a job, with code that you are confident runs properly, that continuously fails nearly instantly, or appears to be not queuing at all, may be a minor error in the batch script
:::

Once the submission script is written properly, you can submit it to the
scheduler with the `sbatch` command. Upon success, `sbatch` will return the ID
it has assigned to the job (the jobid).

```
$ sbatch submit.sh
Submitted batch job 1377
```

Note also that SLURM parameters can be passed at runtime, and will override the values in the script header. For example, the following will submit the example script `submit.sh` to run as four tasks on a Sherlock 3.0 `CPERF` node in either the `serc` or `normal` partition. Command line directives will override in-line directives:

```
$ sbatch --partition=serc,normal --ntasks=4 --constraint="CLASS:SH3_CPERF" submit.sh
```

# Check the job

Once submitted, the job enters the queue in the `PENDING` state. When resources
become available and the job has sufficient priority, an allocation is created
for it and it moves to the `RUNNING` state. If the job completes correctly, it
goes to the `COMPLETED` state, otherwise, its state is set to `FAILED`.

You can check the status of your job and follow its evolution with
the `squeue -u $USER` command:

```
$ squeue -u $USER
     JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
      1377    normal     test   kilian  R       0:12      1 sh-101-01
```

The scheduler will automatically create an output file that will contain the
result of the commands run in the script file. That output file is named
`slurm-<jobid>.out` by default, but can be specified via the `-o` or `--output` submit option.
In the above example, you can list the contents of that output file with the
following commands:

```
$ cat slurm-1377.out
sh-101-01
```
Similarly, the standard error output is written to a file, either specified by the user via the `-e` or `--error`
option, or `slurm-<jobid>.err` by default.

If necessary, a job can be canceled using the [`scancel <job_id>` command](https://slurm.schedmd.com/scancel.html). In this example, 

```
$ scancel 1377
```
<!--
### Modify the job: scontrol update
Some SLURM directives can be modified while the job is running or pending in queue. For example, to increase the time limit of a job -- nominally as it closes in on its originally submitted limit,

```
scontrol update jobid=<job_id> TimeLimit=<new_timelimit>
```

Similarly, if job `123456` submitted with `sbatch --dependency=afterany:12345`, which will hold job `123456` until job `12345` completes, can be requeued without restriction via

```
scontrol update jobid=123456 --dependency=""
```

The sys admin may impose restrictions so that some or all SLURM directives _cannot_ be modified during runtime. These may include cpu, node, and memory allocations. Trial and error are, as is often true, the best approach to determine what directives can and cannot be changed, and at what phase of the job submission. Note that `scontrol` can also be used in scripts to modify SLURM directives, for example to customize some directive requests from a very generic, multi-funtional script.
-->

## Job Performance
HPC computing resources are shared by colleagues who are competing for resources. Moreover, computing resources -- especially Clouud computing resources, are not free. Inefficient use of resources:
1. Is unneighborly -- especially when sharing a pool of resources like `serc`
2. Will negatively affect job wait times, by requesting excessive resources and degrading your FairShare score
3. Costs money! This is especially true in Cloud environments, but generally true for any computing resources.

It is critical to evaluate job performance and resource allocations. Repeated or ensemble jobs should be optimized to request the (reasonable) minimum resources required to run to completion and consideration should be given to optimizing computation efficiency. In particular,
- How much memory does the job actually use (MaxRSS) compared to what is requested (ReqMem)? Most jobs request much more memory than they need,
- How many CPUs were allocated?
- Did the job parallelize efficiently?


## Evaluate the job at runtime

The CPU, memory, and other factors can be monitored while a job is running by using either the `ps` (eg `ps ux`) or `htop` commands. To use these command, after a job has started:

- Note the machine name in the `NodeList` column of the `squeue` output
- From a login node or an interactive compute session (an active Sherlock session), ssh to that node -- eg, `ssh sh-101-01`
- From the compute node, run `ps ux` to see your current activity
- run `htop -u $USER` to see real-time activity. Use `q` or `[ctl] [c]` to exit.

## Evaluate job performance, post runtime
Various data, including actual memory and CPU used, IO activity, and other performance metrics, can be retrieved from SLURM accounting, `sacct`. `sacct` can be a critical tool to evaluate resource requirements, scaling efficiency, and other metrics. To view a full list of available output, see the `sacct` documentation:

https://slurm.schedmd.com/sacct.html

In this example, we use the `--format` option to request data related to job identification, memory usage, and CPU activity:

```
sacct --user=$USER --start=2023-04-17 --format=jobid,jobname,partition,alloccpus,elapsed,totalcpu,maxrss,reqmem,state,exitcode
```
```
JobID           JobName  Partition  AllocCPUS    Elapsed   TotalCPU     MaxRSS     ReqMem      State ExitCode 
------------ ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- -------- 
16715027           bash       serc          1   00:14:53  00:01.775                    4G  COMPLETED      0:0 
16715027.ex+     extern                     1   00:14:53   00:00:00        96K             COMPLETED      0:0 
16715027.0         bash                     1   00:14:52  00:01.774      6534K             COMPLETED      0:0 
16796011     interacti+       serc          8   02:12:41  06:24.278                62.50G  COMPLETED      0:0 
16796011.in+ interacti+                     8   02:12:41  06:24.277    606211K             COMPLETED      0:0 
16796011.ex+     extern                     8   02:12:41   00:00:00        91K             COMPLETED      0:0 
16812329       hostname       serc          4   00:00:03  00:00.037                32000M  COMPLETED      0:0 
16812329.ex+     extern                     4   00:00:05  00:00.002                        COMPLETED      0:0 
16812329.0     hostname                     4   00:00:00  00:00.035                        COMPLETED      0:0 

```

In this example, for example, we can see that job `16715027` requests `4GB` memory, but then only uses `6.53MB` (`MaxRSS`), so a much smaller allocation could be requested. Similarly, job `16796011` requests `62.5GB` memory, but the peak memory consumption (`MaxRSS`) is only about `600MB`. For the same job, the CPU efficiency is: `eff = totalCPU/(AlocCPUs * Elapsed` = `6.5 cpu-hours / 8 cpus * 2.2 hours` = `.37`. Note that, as the SLURM documentation indicates, `usercpu` might be a better measurement of CPU activity in this case.

Congratulations, you have submitted and monitered your first SLURM batch job!

##  Advanced topics
We have reviewed a basic script and some methods to evaluate job performance, but this really is only the begining! SLURM offers numerous options so that it is almost always possible to request the resources you want, the way you want them. A well written batch script and carefully considered SLURM directives can be used as a layer of code to optimize compute performance and streamline your dev-ops workflow.

Consider, for example:
- Different ways to ask for resources
  - `--mem-per-cpu` vs `--mem`
  - `--nodes` vs `--tasks-per-node`
  - [Job Aarrays](slurm-arrays)

<!-- * [Data transfer][url_transfer]
* [Storage][url_storage]
* [Running jobs][url_runningjobs]
-->

### General resrouces
- [SLURM website][url_slurm]
- [Transitioning to SLURM, from GRID FEUP][grid_fe_up_slurm]
- [Converting from PBS to SLURM, by USC](https://hpcc.usc.edu/support/documentation/pbs-to-slurm/)
- [PBS-SLURM cheat-sheet](https://www.sdsc.edu/~hocks/FG/PBS.slurm.html)
-  `sbatch` manual page: `$ man sbatch` . 


[comment]: #  (link URLs -----------------------------------------------------)

[url_slurm]:  https://slurm.schedmd.com
[url_top500]: https://top500.org

[url_texteditors]:    prerequisites/#text-editors
[url_running]:        /docs/user-guide/running-jobs/

[url_transfer]:       /docs/storage/data-transfer
[url_storage]:        /docs/storage
[url_runningjobs]:    /docs/user-guide/running-jobs/
[grid_fe_up_slurm]: https://grid.fe.up.pt/dokuwiki/doku.php?id=documentation:slurm

[comment]: #  (footnotes -----------------------------------------------------)

[man_sbatch]: You can get the complete list of parameters by referring to the  `sbatch` manual page (`man sbatch`).

