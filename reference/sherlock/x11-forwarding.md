---
title: X11 Forwarding
---

# X11 Forwarding
 
*X11 Forwarding*, as the name suggests, forwards X11 graphics from a remote host to the local client, enabling some levels of graphics support for remote
applications. For brevity, these docs focus on Stanford's Sherlock HPC, but the general principles apply to other *nix platforms, incluing GCP. Note also that
X11 forwarding is notoriously non-performant, so if other options like VNC, Jupyter notebooks/labs solutions, paraview etc. are available, they are likely 
better choices.

X11 Forwarding requires two basic steps:

1. Install any necessary client side software
2. SSH to the server, with X11 graphics forwarding options enabled
3. Request HPC resources with the `--x11` option.

## Client Side Software
Client side requirements will vary, and may change with updates to popular operating systems. This documentaiton will likely be incomplete, but should suggest
a viable path forward.

1. *Linux* operating systems should work "out of the box," and not require any additional software, but this might also be variant or Linux "flavor" 
dependent. Consider searching for X11 forwarding solutions specific to your prefered flavor of Linux.
2. *Mac OS* requires a current version of XQuartz, which is free software that can be easily found via an internet search.
3. *Windows*... I have no idea, and I expect it will change. Likely, X11 forwarding can be enabled and managed through Linux Subsystem for Windows (LSW).

## SSH with X11 forwarding
To enable X11 forwarding, simply add the `-X` or `-Y` options to your SSH command,
```
ssh -X sherlock.stanford.edu
```

In principle, `-X` is slightly more secure than `-Y` -- for some connections. On Sherlock, either option should be fine. If the distinction becomes 
significant, Sherlock's very able bodied admins will likely disable the less secure option.

When your `ssh` client connects, you can check your `DISPLAY` variable. If X11 forwarding was successful, you should see something like,

```
[jsmith@sh03-ln06 login ~]$ echo $DISPLAY
localhost:13.0
```

If the `DISPLAY` variable is not set, see the `Troubleshooting` section below.

## X11 enabled compute resources
In order to use X11 Forwarding on compute resources, the `DISPLAY` variable (and other things too) must be forwarded to any requested resrouces. 
This is accomplished by simply adding the `--x11=all` option to your `salloc` or `srun` request, eg.

```
salloc --partition=serc --x11=all --cpus-per-task=4 --mem-per-cpu=4g
```

You can then test your X11 by checking the value of the `DISPLAY` environment variable, as discussed above, or you can use one of the test applications:
```
module load system x11
xeyes
xclock
```

## Troubleshooting
If X11 is not forwarding correctly, you will likely see errors along the lines of `DISPLAY not set`, or `No Display found`. A few common causes, solutions,
and workarounds include:

1. Forgot to use `-X` or `-Y` in `ssh` command?
2. No `XQuartz`? or `XQuartz` is not running (in the background)?
3. Using _multiplexing_ to bypas repeated DUO 2FA (ie, you have configured your local `~/.ssh/config` to "share" connections? A few tricks and a proper solution (might) include:
4. Login using a different alias (eg, `login.sherlock.stanford.edu` vs `sherlock.stanford.edu`). This sounds silly, but it might just work! You may have logged in to Sherlock via `ssh sherlock.stanford.edu`,
       so subsequent connections to that URL will strip the `-Y` or `-X` options, but `ssh -Y login.sherlock.stanford.edu` will allow the option, since it is not the same URL.
5. `ssh -O exit sherlock.stanford.edu` will reset any connections you have to `sherlock.stanford.edu`.

