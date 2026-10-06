---
title: Data Transfer
---

# Overview
Sherlock supports a variety of data transfer protocols and software -- much of which is installed natively as part of the Sherlock OS or can be loaded via the module system. Sherlock also provides a GUI interface, as part of its _Open on Demand_ interface, which can be useful for smaller, "one-off" type file transfers. The most common and versatile tools are arguably the SSH based tools, including `scp`, `rsync`, `rclone`, and `sftp`.

For large transfers, especially between institutions such as Universities, national labs, Cloud based storage platforms, or corporate partners _Globus_ is likely an excellent option. In fact, even for large (eg, `>1TB`) transfers on the same system -- for example from one Oak space to another, _Globus_ is an excellent choice.

Detailed information regarding the syntax and best practices for all of these data transfer tools can be found via internet search (Google, Bing, etc.), using the Linux `man` function (eg, `man scp`), and from the Sherlock documentation: 
[https://www.sherlock.stanford.edu/docs/storage/data-transfer/](https://www.sherlock.stanford.edu/docs/storage/data-transfer/)

# Bandwidth restrictions
Whenever possible, all -- but especially large, transfers should be initiated directly from point to point. This is to say, avoid downloading to a workstation/laptop, then uploading to Sherlock, Cloud, or other HPC, for several reasons:
1. Especially for transfers between academic institutions or Cloud resources, large data centers almost always have very fast connections to main internet trunks. Direct transfers between these institutions is usually very fast.
2. Again, for large transfers, your local workstation or laptop may not have sufficient local storage to relay the transfer.
3. If properly executed, a long transfer can run unattended
4. Especially if the down-/up-load is performed off of the Campus (or other institution) network, it will likely exceed your internet plan's up/download limits.
5. If off campus, most internet plans have much (shockingly...) slower upload, as compared to download, speeds.

Note also that large transfers from laptops, external storage, etc. devices to Sherlock or other HPC platforms should be performed over hard-LAN, not WiFi. Excellent as Stanford WiFi is, the hardwired LAN speeds are MUCH faster, though it is also worth noting that they can vary significantly depending on the particular segment of Campus network you connect to. Note also that network ports may need to be activated and computers registered to access those ports. To activate ports and register network devices, please place a SNOW support ticket with UIT.

# Linux OS
For transfers on or between mounted filesystems, eg. between `$SCRATCH` and `$OAK`, or even between files mounted to local machines via `sshfs`, standard *nix filesystem commands are often an excellent option. Besides being limited to local(ish) filesystems, these utilities also lack fault tolearance (error checking) and other safety features, but they can also be very fast. Also note that, for large copies, memory restrictions might be encountered, as the systm may be required to read (and load to memory) a voluminous directory tree. This is especially true if running on a login node; moderate and certainly large copy or move jobs should be executed on a compute node.


## Copy (cp)
The `cp` command is a standard part of *nix operating systems. As its name suggests, it copies files and directories from one location to another. The basic syntax is,

`cp {options] {source} {destination}`

For example, a command to copy the file `my_data.dat` from `dir1` to `dir2` would look like,

`cp dir1/my_data.dat dir2/`

To the `--recursive` option can be used to copy an entire directory,

`cp --recursive dir1 dir2/`

Some care should be taken with the correct use of "/", eg "dir2" vs "dir2/" to accomplish the desired behavior. In particular, the `cp` command can be used to "copy dir1 as dir2" or "copy dir1 into dir2". The best approach to achieving the desired objectives, without making a mess of your directory space, is to exercise an abundance of caution and by experimenting with syntax in a controlled setting.

## Move (mv)
The `mv` command "moves" a file or directory from one location to another. Internally, the OS attempts a simple `rename()` operation, which is nearly instantaneous for a single file or directory, and -- because it involves only a change in metadata, the risk of data los is very low. If the OS _cannot_ execute `mv` as a `rename()`, for example to transfer files between two distinct filesystems, the OS will execute the command as a copy then delete. Note that the Oak (LUSTRE) filesystem will likely treat distinct spaces as separate filesystems, so `mv` actions between two Oak space, eg. `mv /oak/stanford/groups/alices_pi/some_data /oak/stanford/groups/joes_pi/joes_data` will likely be treated as a `cp` then `rm`, so a more sophisticated transfer approach (see below) should be considered.

## mpiFileUtils

[https://mpifileutils.readthedocs.io/en/v0.11.1/tools.html](https://mpifileutils.readthedocs.io/en/v0.11.1/tools.html)

For large transfers, `mpiFileUtils` provides parallelized implementations of common filesystem operations. For example `dcp`, `dmv`, `dtar` are "distributed" implementations of `cp`, `mv`, and `tar` -- respectively. These tools can be especially useful -- for example, to transfer large volumes of simulator output data from `$SCRATCH` to `$OAK` at the end of a job. For example on Sherlock,

```
#!/bin/bash
#
#SBATCH --job-name=do_science
#SBATCH --ntasks=4
#SBATCH --mem-per-cpu=6g
#SBATCH --output=do_science.out
#SBATCH --error=do_science.err
#
module load system mpifileutils
#
# synchronize input data from permanent (Oak) storage and local `$SCRATCH` working directory
srun dsync ${OAK_SRC_DATA_REPO} ${SCRATCH_WORKING_DIR}/input_data
#
# run job:
srun do_science.sh
#
# copy output to `$OAK` for permanent storage, then compare those directories
#  (note, this two step appraoch can probably be replaced with a single `dsync`)
srun dcp ${SCRATCH_WORKING_DIR}/output_data ${OAK_OUTPUT_REPO}
srun dcmp ${SCRATCH_WORKING_DIR}/output_data ${OAK_OUTPUT_REPO}
```

# SSH based methods
Often the most straight forward tools are the common *nix SSH based tools. These include:
## SCP
SCP (`scp {source} {destination}`) is a simple tools, especially useful for transfering one or a few files or directories, up or down, between your laptop and a remote HPC platform, or between two HPC platforms. For multiple files or directories, it is ofte useful to consolidate and compress (eg, `zip` or `tar`) the source files in advance of transfer.  

## SFTP
SFTP provides a shell enviornment that facilitates FTP-like `put`, `get` commands between the host (ie, local workstation or laptop) and a remote.

## SSHFS
SSHFS is a SSH-Filesystem wrapper that can be used to map a remote filesystem to a local workstation or laptop, or between two remote systems. SSHFS is analogous to a "mapped network drive" in Windows and effectively similar to mounting a remote filesystem in a *nix environment.

## RSYNC and RCLONE
RSYNC and RCLONE (`rsync`, `rclone`) are more sophisticated backup and synchronization. Besides transfering or synchronizing directories between remote and local sources, these tools can be used to streamline workflows where input and output data are stored on a permanent storage platform such as Oak, but jobs are run on `$SCRATCH` to improve performance.


# Open On Demand (OoD)
Especially for Windows platforms, the Sherlock OoD interface ([login.sherlock.stanford.edu](https://login.sherlock.stanford.edu/pun/sys/dashboard) ) "File Manager" tool provides a simple, familiar GUI based interface to upload files to Sherlock. Multiple files and directories can be uploaded by first zipping (eg, `zip {filenames}` or tarring (eg, `tar cvfz {filenames}`).

# Globus
Especially for large, inter-institutional transfers, _Globus_ is perhaps best described as, "magic." _Globus_ facilitates fault tolerant, unattended transfers. Interrupted transfers are requeued and pick up, more or less, where they left off. SRC supports Globus endpoints on both Sherlock and Oak. The Oak endpoint includes the "sharing" mode, whereby collections (data, subdirectories, etc.) can be shared with other Globus users. This is to say, when asked, "Does your institution have an FTP site where we can up/load data?" The answer is, "No, but we can set that up via Globus." 

## Endpoints
Globus Endpoints of interest include:
- SRCC Oak
  - NOTE: Globus should pre-populate the `Path` field with `/oak/stanford/`
- SRCC Sherlock
- Stanford Google Cloud
  - Note: The `Path` should start with the GCP bucket name, eg, `/my_dissertation_bucket`
- Stanford Google Drive

For more on Globus, see:

- Sherlock Docs: [https://www.sherlock.stanford.edu/docs/storage/data-transfer/](https://www.sherlock.stanford.edu/docs/storage/data-transfer/)
- Globus Docs: [https://www.globus.org](https://www.globus.org)
- Stanford Globus Docs: [https://sites.google.com/stanford.edu/globus-101-stanford/home](https://sites.google.com/stanford.edu/globus-101-stanford/home)


