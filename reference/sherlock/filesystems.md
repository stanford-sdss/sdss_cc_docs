---
title: Filesystems and IO in HPC
---

# HPC Filesystems

## General concepts
In principle, all HPC platforms have unique filesystem layouts. That said, most HPCs maintain similar filesystem frameworks that separate standard personal (group), large volume, and active computing (scratch) storage. Some platforms also provide backup or archive class storage, though responsibility for backups and archiving are often delegated to users. Some newer -- and especially Cloud based, systems might also include Object Store or database storage systems.

Note that most HPC systems do *not* give users `sudo` access and will *not* permit ordinary (non admin) users to install software to system locations, eg `/usr`. Many software installation scripts will attempt to install executables and libraries to these locations and may recommend running the installation commands as `root` or using `sudo` (eg, `sudo make install`). `sudo` or `root` access is not available to ordinary users (please do not ask), but rest assured that most software can be installed to an alternate location with a few modifications to the prescribed installation scritp or instructions.


## Sherlock

Sherlock HPC incorporates three principal classes of storage, `$HOME`, `$SCRATCH`, and `$OAK`. An additional class of backup storage is under development. Sherlock filesystems and quotas are as follows:
### `$HOME` 
- Quota: 15 GB
- ACLs: NFS4
- Backup: Yes
- Acces: User

`$HOME` -- given its limited capacity quota, is best for storing documents, small data files, and some source code. Files and directories in `$HOME` are, by default, owned by and accessible only to the user (`$USER`). `$HOME` is typically not a good place to install software -- especilaly machine learning packages, due to the small capacity quota. In many cases, it will be necessary to override installation defaults to avoid exceeding the `$HOME` quota.

### `$GROUP_HOME` 
- Quota: 1 TB Quota (Shared with your PI group)
- ACLs: NFS4
- Backup: Yes
- Access: PI group

`$GROUP_HOME` is an excellent place to store moderate size data, code bases that are shared by multiple users in a PI group, and to install software packages.

### `$SCRATCH` (100 TB Quota)
- Quota: 100 TB Quota 
- ACLs: POSIX
- Backup: No. 90 day purge.
- Access: User

`$SCRATCH` is a fast, temporary filesystem intended for use with active computing. `$SCRATCH` is not intended for permanent or even long term storage. In fact, unchanged files are purged after 90 days. Note that "purged" means "deleted unrecoverably and forever," and "unchanged" is determined by a `diff` algorithm, not a simple modified date attribute. Attempting to game the system, to use `$SCRATCH` for long term storage, is _strongly_ discouraged. Default permissions allow access to `$USER`.

### `$GROUP_SCRATCH` (100 TB Quota)
- Quota: 100 TB Quota (Shared with your PI group)
- ACLs: POSIX
- Backup: No. 90 day purge.
- Access: PI group

`$GROUP_SCRATCH` is `$SCRATCH`, but shared by a PI group. It functions on the same hardware and filesystem; the same purge policies apply. Default access is to `$USER` plus read access to `$USER`'s PI Group. 

### `$OAK` (variable)
- Quota: Depends on purchase
- ACLs: POSIX
- Backup: No
- Access: PI controlled

For storage `> 1TB`, consider `$OAK`! Oak is a _LUSTRE_ filesystem optimized for "deep and cheep" storage. This means that the system is optimized to store large volumes of data in large files. Small files should -- when possible, be consolidated into large files. Note also that applications with active IO should not compute directly on Oak; copying data to and computing from `$SCRATCH` will _significantly_ improve performance. The same is true for `$HOME` and `$GROUP_HOME`, but to a leser extent.

### Best practices
Significant performance enhancements can be affected by using Sherlock's (and other HPC) filesystems correctly. As discussed above, `$HOME`, `$GROUP_HOME`, and `$OAK` should be used for permanent or long term storage of files and data, but these filesystems are not well suited for high input-output (IO) applications. Broadly speaking -- especially for applications with active IO, data should be copied to `$SCRATCH` or `$GROUP_SCRATCH` for computing operations, then output data should be copied off of `$SCRATCH` to a safe, long term storafge location.

# ACLs
Files and directories can be shared, or access restricted, by modifying their Access Control Lists (ACLs). Note that ACLs provide much more granular control -- at the individual user or group level, than the conventional Linux `chmod` command. ACLs consist of, as the name implies, a list of Access Control Entries (ACEs) that permit or restrict access on a given file or directory. On Sherlock, `$HOME` and `$GROUP_HOME` are governed by `NFSv4 ACLs`, while `$SCRATCH`, `$GROUP_SCRATCH`, `$L_SCRATCH`, and `$OAK` use `POSIX ACLs`. 

The principles governing these two systems are similar, but their syntax and capabilities are somewhat different. Links to detailed references are provided below. Here, we focus on basic concepts and provide some simple examples of common ACLs.

## POSIX:
#### $SCRATCH, $GROUP_SCRATCH, $L_SCRATCH, and $OAK
POSIX ACLs are read and set using the `get_facl` and `set_facl` commands, respectively. POSIX ACLs set two types of ACEs -- _access_ (rules for a given file or directory) and _default_ (rules to be inherited by child objects).  For a detailed account of syntax and options, see the linux man pages:
- `setfacl`: [https://linux.die.net/man/1/setfacl](https://linux.die.net/man/1/setfacl)
- `getfacl`: [https://linux.die.net/man/1/getfacl](https://linux.die.net/man/1/setfacl)

### Example: Create a directory in `$OAK`; share it with a collaborator named `alice`.
In order to do this, it is necessary to:
1. Create the directory
2. Set ACLs to provide access to the collaborator
3. Add upstream "traverse" ACEs, so the collaborator can traverse the directory tree to the folder in question.

```
mkdir -p my_project/alice_share
setfacl -m u:alice:rwx my_project/alice_share
setfacl -d -m u:alice:rwx my_project/alice_share
#
setfacl -m u:alice:X my_project
setfacl -d -m u:alice:X my_project
```

Note that the last two actions, to set upstream traverse access will have to be repeated up the directory tree to a level where `alice` has at least traverse (`x` or `X`) permissions.

Show ACLs:

```
getfacl my_share
```

### Example: Copy ACLs from current directory to a subdirectory
This example demonstrates how to entirely replace the ACLs for a directory -- and all of its subdirectories when the `--recursive` option is employed. This can be useful when data are copied, for example, into an Oak group space from the SDSS shared space or from a collaborator's Oak space.

```
getfacl ./ | setfacl --recursive --set-file - my_path/
```

## NFS4:
#### $HOME, $GROUP_HOME
The NFS4 ACL system is arguably a bit more complicated and esoteric than POSIX, but it is also much more versatile. NFS4 ACLs set propagation (inheritance) rules are integrated into a single ACE. Each ACE has 4 parts; to set an ACE:

```
nfs4_setfacl {command flags} {type: Allow/Deny}:{propagation flags}:{user, group, or entity}:{permissions} {target_dir}
```

### Example: Create a directory in `$GROUP_HOME`; share it with a collaborator named `alice`.

1. Create the directory
2. Set an ACE in the shared directory to propagate `OWNER@` (and possibly `GROUP@` and `OTHER@` permissions)
2. Set ACLs to provide access to the collaborator
3. Add upstream "traverse" ACEs, so the collaborator can traverse the directory tree to the folder in question.

```
mkdir alice_share
nfs4_setfacl -a -R A:fd:OWNER@:RWX alice_share
nfs4_setfacl -R -a A:fd:alice@sherlock:RWX alice_share
#
nfs4_setfacl -R -a A:fd:alice@sherlock:X `pwd`
```

In this, the flags `-R` applies this rule "recursively" down the directoyr tree, and `-a` tells `nfs4_setfacl` to "add" this ACE (as opposed to, for example, replacing entirely the entire ACL). The first `nfs4_setfacl` statement is necessary because the default permissions for the special groups `OWNER@`, `GROUP@`, and `OTHER@` are set without propagation flags. The default behavior is to then propagate those ACEs _only_ if there are no other ACEs that do have propagation flags set. If this step is skipped, subsequent files and directories in the shared directory may be inaccessible to their creator.

Again, the `x` or `X` (execute or traverse) permissions need to be propagated up the directory tree to a point where `alice` has access.

To read the ACLs:

```
nfs4_getfacl alice_share
```

In some cases, an excellent way to edit NFS4 ACLs is to use the `-e` flag, to edit the list directly as a text file,

```
nfs4_setfacl -e alice_share
```
