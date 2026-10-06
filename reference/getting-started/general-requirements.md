---
title: Getting Started -- General Information
---

# Getting Started: General Requirements

## VPN, Cardinal Key, and 2FA (Duo Mobile)

Connections to many Stanford computing resources -- including Sherlock and even some Cloud resourdces, will require authentication on Stanford's Virtual Priavate Network (VPN), two factor authentication (2FA) via Duo Mobile, or both. Note that Stanford is a large campus with a complex network, so many on-campus locations that are directly connected to a "Stanford" network will still require the VPN.  Instructions to download, install, and configure a VPN client and 2FA are provided by UIT here:
- [Stanford VPN](https://uit.stanford.edu/service/vpn "Stanford VPN")
- [Stanford Duo 2FA](https://uit.stanford.edu/service/authentication/twostep "Stanford Duo 2FA")

UIT also provides the _Cardinal Key_ service, which will streamline your login to many Stanford resources:
- [Stanford Cardinal Key](https://uit.stanford.edu/service/cardinalkey "Cardinal Key")


## Installing an SSH client
Connections to Sherlock, and other HPC platforms, are made via Secure Shell (SHH).

### Windows
Newer versions of Windows may incluyde an SSH client in the PowerShell or other command line application, basically emulating Mac and Linux systems. This is a great place to start. In some cases, it may be necessary to install an SSH client for the shell program to use, and in other cases it may be necssary to install a *nix VM client or other SSH application. Examples include:
- Cygwin
- Putty
- Power Shell (Might need to install OpenSSH, as discussed above)
- [WSL (Windows Subsystem for Linux)](https://docs.microsoft.com/en-us/windows/wsl/install-win10 "Install Windows Subsystem for LInux")
- See the [SDSS-CC Sherlock](https://www.sherlock.stanford.edu/docs/getting-started/prerequisites/) documentation for more details

### MacOS, Linux, and other *nix
On Unix, Linux, MacOS, and other *.nix* systems, the ssh client is typically either installed as a standard component or or easily acquired. In most cases, it can be installed using a package manager. For example, in Debian, Ubuntu, and Mint (note: the exact syntax and package names may vary):
        
        $ apt-get update
        $ apt-get install ssh-client
        
will install an ssh client (note it may be necessary to run these commands using `sudo` elevated privileges).

        $ apt-get update
        $ apt-get install ssh-server
        
will install both ssh-client and ssh-server components.

On CentOS and other RedHad derivative distributions,

        yum -y install openssh-server openssh-clients


## Software
Software is available from three basic sources:
1. Pre-installed, "always on," libraries
2. Modules libraries
3. User installed software

#### Pre-installed software
These are libraries and programs that system administrators make available to all uers, all the time. They automatically load on login. These libraries may include default versions of software that can be superceeded by loading modules or custom SW installations.

#### Modules LIbraries:
Because some  computational tasks can have very specific requirements, it can be challenging and resource intensive to (attempt to) construct a single, one-size-fits-all computing configuration. In order to cater to a large user-base, custom configurations are facilitated by loading user defined lists of code "modules". This enables, for example, a user to load the newest, or perhaps an older verision of a software package *A* known to perform best with some other package *B*.

Typical `module` commands for most users will include,
- `module load <list of module names>`: Load one or more module
- `module list` : List loaded modules
- `module avail`: Show a list of modules available to the system
- `module unload:` Unload a module

An interactive workflow, for example, to load a specific version of *Python* might look like:

        $ module avail | grep python
        python/2.7
        python/3.5
        python/3.6
        python/3.7
    
To load *Python 3.6*,

        $ module load python/3.6

In a typical workflow, a user migh determine a list of necessary modules to execute a particular task, and then script those `module load` statements into the batch script, between the resource allocation and task execution (just as they would be run interactively).

#### User Installed Software:
If a piece of software is not available by default or as a module, it can be installed by the user into their $HOME, $GROUP_HOME, or even $SCRATCH space. For example, `pip install --user <package name> ` provides an easy syntax to install Python packages into $HOME, or any other location, with a bit of configuration. 

Note that in some cases, custom installations can become quite large, especially if preformed carelessly. For example, it is not uncommon for Anaconda, or documentation related to packages available from `conda`, to include a complete Python installation, so it is imporant to pay attention to the installation instructions. For packages that are legitimately just big, or for packages that may be useful to other users, talk to the SDSS-CC support team about installing a module.

# Mounting a Remote (HPC) Filesystem

It may be possible to use the File Explorer (or equivalent) GUI to mount, or connect to a remote (Sherlock or other) HPC. In some cases, however, the system will attemt to auto-reconnect to remote resources, which can lead to repeated failures if secondary connection requirements are not met (password is not cached, 2-factor authentication is required, VPN, etc.), which can trigger automated security features, whicn can result in your account being suspended.

In light of this risk, it can be preferable to simply connect manually (or semi-manually, using a script). On Linux, MacOS, and other *nix systems, use `sshfs`. Note, the OS requires a "mount point", which is a directory that in most cases must exist in advance. For example to mount your `$HOME` on `some_HPC` to a folder called `$HOME/HPC_home` on your local system,

        $ mkdir ~/HPC_home
        $ sshfs <SUNetID>@some_HPC:/home/users/<SUNetID> ~/HPC_home


## Sherlock

To mount the Sherlock $HOME filesystem (to a mount point called `sherlock_home `; note the option `-o volname` is optional):

        $ sshfs <SUNetID>@dtn.sherlock.stanford.edu:/home/users/<SUNetID> $HOME/sherlock_home -o volname=sherlolck_home

Similarly, your scratch directory can be loaded as the default for a `dtn` server:

        $ sshfs <SUNetID>@dtn.sherlock.stanford.edu:. $HOME/sherlock_scratch -o volname=sherlolck_scratch

## Un-mounting (disconnecting) a Filesystem

A filesystem is then _unmounted_, or disconnected, using the `umount` command. For example:

        $ umount ~/sherlock_home
        $ umount ~/sherlock_scratch

If there was an error or some other form of ungraceful dismount of one of the drives, it may not be possible to read the filesystem, un mount the drive, or remount the drive. Mac OSX will likely prompt you to run `diskutil` --  something like,

        $ diskutil unmount ~/mazama_home

Similar tools presumably can be found for other *nix systems and for Windows.

