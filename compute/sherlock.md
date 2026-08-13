---
title: Sherlock
---

# Sherlock

SDSS owns a wide array of servers in Stanford's [Sherlock](sherlock.stanford.edu) cluster, offering dedicated on-premises CPUs and GPUs to SDSS researchers. These resources are accessible and monitored through the `serc` partition.

## Getting Access

You can get access to Sherlock and the `serc` partition by requesting an account from [this page](https://www.sherlock.stanford.edu/).  If you are unable to use `serc` for any reason, please reach out to [sdss-compute@stanford.edu](mailto:sdss-compute@stanford.edu) for assistance.

## Using the SERC Partition

In general, `serc` can be accessed by setting the `--partition` flag to `serc` in many SLURM commands.  

## How busy is the SERC partition?

You can view how busy the `serc` partition is on [this dashboard](https://datastudio.google.com/reporting/c0249b86-4271-4473-adb6-ccf06d2a8b39).  The homepage of this dashboard shows an overall status for the latest data.  There are specific pages for CPUs, Memory, and GPUs that show 2 week windows of data.  If you see resources in queue higher than the total resources in `serc`, I would expect a longer than usual wait for your job to start. 
