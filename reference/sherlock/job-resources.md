---
title: Estimating Job Resources
---

# Measuring Job Resources

## General concepts
Accurate estimates of job resource requirements is critical to workload performance and the efficient use of valuable HPC resources. The principal objective is to request sufficient memory, time, and CPU resources so that jobs run to completion in a timely manner.  Secondary objectives include optmizing (minimizing) these resource requests in order to _maximize_ resource  availability, _minimize_ impact to one's FairShare resource prioritization, and generally to use shared resources in a way that is sustainable, courteous, and respectful to one's esteemed colleagues.

On the on hand -- for example, requesting insufficient memory will cause a job to fail; requesting insufficient time will cause a job to fail after it has consumed (significant) resources. A job will run unnecessarily slowly if insufficient CPUs are requested. On the other hand, requesting excessive memory, CPUs, or time will delay the allocation of those resources; unused (but allocated) could be used by another job and still count against your FairShare score. It is therefore critical to _understand how your jobs work_ and make _informed_ resrouce requests.

This document makes some specific referendes to the Sherlock HPC platform, but most of the concepts will apply generally to most HPC platforms, and really any *nix based system.

Principal resource and code performance considerations include:
- Memory requirements:
  - Total memory?
  - Distribution of memory across multiple nodes?
  - How do memory requirements scale with parallelization?
- Parallelization:
  - Does the code parallelize?
  - OpenMP, Python Multiprocessing, or other thread-based (single node) method
  - MPI or other multi-node protocol
- Job distribution strategy -- particularly for composite or ensemble jobs

## Real-time monitoring
In real-time, resource consumption can be observed by `ssh`-connecting to the compute nodes and using the `ps` or `htop` commands. It is not possible to remotely connect directly to _Sherlock_ compute nodes; `ssh` connections to compute nodes must be made from an existing Sherlock session -- usually from a login node. First things first, review pending and running jobs using the SLURM command, `squeue`, eg:
```
[myoder96@sh03-09n72 ~] (job 31318987) $ squeue -u $USER
           JOBID ARRAY         NAME       USER     ACCOUNT PARTITIO NODES    CPUS                 TIME            TIME_LEFT                  NODELIST     REASON           ST
        31318987   N/A  interactive   myoder96       ruthm     serc     1       1                21:25              3:38:35                sh03-09n72       None            R
```

Details for how to run `squeue`, including how to set the output columns using the `--Format` option, can be found in the SLURM documentation,  https://slurm.schedmd.com/squeue.html . In this example note that the job `31318987` is currently running (`ST=R`) on the `sh03-09n72` compute node. From a login terminal, we can `ssh` connect to that node,
```
[myoder96@sh03-ln04 login ~]$ ssh sh03-09n72

------------------------------------------
 Sherlock compute node
 >> deployed Fri Aug 25 14:05:55 PDT 2023
------------------------------------------

[myoder96@sh03-09n72 ~] (job 31318987) $
```

Note the host machine and jobID are shown in the prompt. Activity on that machine can be viewed using the `ps` command, eg:

```
[myoder96@sh03-09n72 ~] (job 31318987) $ ps ux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
myoder96  9483  0.0  0.0 114964  3536 pts/1    Ss+  10:42   0:00 /bin/bash
myoder96 15065  0.1  0.0 115016  3476 pts/2    Ss   11:31   0:00 -bash
myoder96 15289  0.0  0.0 153540  1812 pts/2    R+   11:32   0:00 ps ux
[myoder96@sh03-09n72 ~] (job 31318987) $ 
```

Note that `ps` will show all tasks (depending somewhat on the options provided) on the node in question, including jobs from multiple logins or job allocations. Note that if this were a real job, we would likely be disappointed, as it inticates zero memory and CPU usage -- suggesting that our job is not running correctly and need to review our job script or workflow.

Another popular tool for real-time job monitoring is `top` or `htop`,

```
$ top
top - 11:42:35 up 24 days, 21:30,  1 user,  load average: 4.01, 4.34, 5.02
Tasks:   3 total,   1 running,   2 sleeping,   0 stopped,   0 zombie
%Cpu(s): 11.9 us,  0.6 sy,  0.0 ni, 87.5 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem : 26357425+total, 21284579+free, 15833228 used, 34895236 buff/cache
KiB Swap:  4194300 total,  4194300 free,        0 used. 24493500+avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                                                                                                                    
 9483 myoder96  20   0  114964   3536   1732 S   0.0  0.0   0:00.04 bash                                                                                                                       
15065 myoder96  20   0  115016   3476   1720 S   0.0  0.0   0:00.03 bash                                                                                                                       
15970 myoder96  20   0  160060   2092   1516 R   0.0  0.0   0:00.00 top                                                                                                                        
```

Both programs show running jobs, CPU activity, and memory used.
# After action reporting
## SEFF: Summary report

Nominally, the fastest and easiest way to get a summary report, for a given job, is the "SLURM efficiency" tool, `seff {job id}`. This tool returns a simple, human-readable format report that includes allocated resources (nodes, CPUs, memory), wall time, as well as how much memory and CPU time was actually used (memory and CPU efficiency).

Consider, for example the following job:

```
[myoder96@sh03-ln02 login ~]$ seff 37541537
Job ID: 37541537
Cluster: sherlock
User/Group: myoder96/ruthm
State: COMPLETED (exit code 0)
Nodes: 1
Cores per node: 8
CPU Utilized: 00:00:40
CPU Efficiency: 5.38% of 00:12:24 core-walltime
Job Wall-clock time: 00:01:33
Memory Utilized: 107.00 KB
Memory Efficiency: 0.00% of 32.00 GB
[myoder96@sh03-ln02 login ~]$ 
```

Note that this job reports only `5.38%` CPU efficiency (approximately `40s / 8 cpus * 1m:33s_walltime` and just greater than `0%` memory efficiency (`107 KB / 32 GB`) -- which is pretty bad! Generally speaking, `seff` reports can be used to determine how well (if at all?) a job parallelizes, how much memory to request for future implementations of the job, and how much time to request. The precise interpretation of these numbers, however, can be subjective. Some points of interest specific to this job include:

- This job executed a Spack instalation scritp, which I know parallelizes well but also know be IO intensive, and so most likely _not_ CPU efficient.
- So, while it might be worth investigating, CPU efficiency may remain disappointing
- While we did request only `4GB/cpu`, rather than the default `8GB/cpu`, we can clearly request _much_ less memory, so the script will be updated to request `1GB/cpu`.
- Requesting less memory will 1) facilitate access to more resources, 2) affect my _FairShare_ less adversely, and 3) leave additional resources available to my friends and collagues whose jobs reequire more memory.

## SACCT: Detailed analysis

More rigorous resource analysis can be performed after a job has completed by using SLURM accounting, or `sacct`. Again, SLURM provides a rigorous documentation, including using `--format=` to define which columns to output and the various options that can constrain a query. For example, the following command:
```
sacct --user=$USER --start=2023-09-01 --end=2023-09-03 --format=jobid,jobname,partition,account,nnodes,ncpus,reqmem,maxrss,elapsed,totalcpu,state,reason
```
produces an output like:
```
[myoder96@sh03-09n72 ~] (job 31318987) $ sacct --user=$USER --start=2023-09-01 --end=2023-09-03 --format=jobid,jobname,partition,account,nnodes,ncpus,reqmem,maxrss,elapsed,totalcpu,state,reason
JobID           JobName  Partition    Account   NNodes      NCPUS     ReqMem     MaxRSS    Elapsed   TotalCPU      State                 Reason 
------------ ---------- ---------- ---------- -------- ---------- ---------- ---------- ---------- ---------- ---------- ---------------------- 
29197645_1    tar_a_dir       serc      ruthm        1          1         4G              13:29:18   12:20:08  COMPLETED                   None 
29197645_1.+      batch                 ruthm        1          1                 2200K   13:29:18   12:20:08  COMPLETED                        
29197645_1.+     extern                 ruthm        1          1                   96K   13:29:18   00:00:00  COMPLETED                        
29197645_2    tar_a_dir       serc      ruthm        1          1         4G              17:52:54   16:56:48  COMPLETED                   None 
29197645_2.+      batch                 ruthm        1          1                 2852K   17:52:54   16:56:48  COMPLETED                        
29197645_2.+     extern                 ruthm        1          1                  100K   17:52:54   00:00:00  COMPLETED                        
29197645_4    tar_a_dir       serc      ruthm        1          1         4G            7-00:00:07  00:00.009    TIMEOUT                   None 
```

Parsing some of the less obvious data:
- **Did the job run as planned?** This is a trivially simple example -- these jobs ran on a single CPU on a single node. The JobID indicates they ran as an array (see SLURM documentation for more details on JobID when arrays are involved); two instances (`_1` and `_2`) completed; instance `_4` timed out.
- **Memory:*** These jobs requested `4GB` of memory (`ReqMem`), but the `MaxRSS` field indicates that they only used `2-3 MB`. Generally, this suggests that a much smaller memory request might have been made. Taking into consideration that (currently...) most nodes on Sherlock have `8GB RAM` per CPU core, and knowing that most (or at least many) partitions permit a maximum allocation of `16 GB/CPU`, a reasonable -- and still very conservative, request could be `--mem-per-cpu=1g`.
- **Elapsee and CPU time:**: `Elapsed` indicates the job's wall-time (how long the job ran). The `TotalCPU = SystemCPU + UserCPU` indicates the time CPU(s) were active. For multi-cpu jobs, parallization performance can be approximately evaluated by comparing these fields. In principle, for perfect parallel performance `NCPUS * Elapsed ~ UserCPU`


### Best practices
A good practice, before launching large, longer running jobs is to run a short test job to evaluate the memory requirements, time, and number of CPUs required. The basic idea is to run one or more small test job, with small resource requirements -- so the job will run quickly, then re-queue the job with more optimized resource requests. 
- Memory: Evaluating memory requirements is straight forward -- run your production job long enough to approach maximum memory consumption; then cancel the job or let it time out and evaluate the `MaxRSS` using `sacct`. Note that requesting excessive memory, then not using it, will still count against your FairShare score.
- Parallelization (number of nodes and CPUs): Evaluate how well the job perfomance scales with added CPUs. Then request a configuration that balances resource availability and run-time requirements. Requesting CPUs, then not using them will still count against your FairShare score.
- Run Time: This is iften a guess, but it may be possible to estimate by running a test job with a reduced data set. For example, if your production job involves working through a `100 GB` data file, running a test job on a `<10GB` subset of those data might facilitate a better informed run-time. Reqeusting excess time for your jobs will *_not_* count against your FairShare score, but it will affect how quickly the scheduler allocates resources to your job.

