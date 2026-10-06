---
title: FAQ -- Disk Quota Exceeded
---

# FAQ: Disk Quota Exceeded

## Overview
As the message suggests, this error indicates that one or more storage space quotas have been exceeded. Sherlock provides multiple filesystems to users. For a likely more thorough and more up to date review of these filesystems, see Sherlock documentation: [https://www.sherlock.stanford.edu/docs/storage/?h=quota#quotas-and-limits] (https://www.sherlock.stanford.edu/docs/storage/?h=quota#quotas-and-limits). Filesystems to which users have write permissions include:
- $HOME: 15GB quota
- $GROUP\_HOME: 1TB quota
- $SCRATCH, $GROUP\_SCRATCH: 100 TB quota, purged on rolling 90 day cycle
- $OAK: Purchased by PI groups, school, or other consortia in 10TB or 250TB blocks.

Your usage of these filesystems can be reviewd using the `sh_quota` command (https://www.sherlock.stanford.edu/docs/storage/?h=quota#quotas-and-limits] (https://www.sherlock.stanford.edu/docs/storage/?h=quota#quotas-and-limits) ). Note that this may not show _all_ quotas. For example, this command will most likely not show the shared CEES _Oak_ space, since it is not affiliated with a PI group.

## Quota exceeded errors: $HOME
"Quota Exceeded" errors may correctly indicate an exceeded quota, probably in `$HOME`. The 15GB `$HOME` quota can be quickly exceeded by data or software packages. Most pointedly, Python or Ana-/Mini-conda installations, especially when machine learning packages are involved, can become quite large. A single `Tensorflow` based Conda envioronment, for example, can easily be larger than 10GB.

To avoid exceeding the `$HOME` quota, install software to `$GROUP_HOME`. If you are exceeding your `$GROUP_HOME` quota, consider moving some of your data to an Oak space.

## Quota exceeded errors: $OAK
If you are seeing "quota exceeded" errors on _Oak_, but you know you are well within your _Oak_ quota, it may be due to a known bug related to how the permissions and quotas are set up in the _LUSTRE_ filesystem. Specifically, _Oak_ quotas are presently managed by group ownership. In some cases, group ownership is not transfered or set correctly when a directory is copied or created, so that directory and subsequent files/directories copied or created into it are assigned to the `nobody` group. The quota for the `nobody` group is eventually exceeded, and you will see this error.

### Resolution(s):
- Ensure that the `setgid` bit is *NOT* removed on any _Oak_ directory. In practice, this may involve a variety of "do/do-not set permissions" options for compression/extraction (tar,zip, etc.), file transfer, etc. applications.
- For existing files, review their group ownership using `ls -lh`. Where you see files and directories with the group `nobody`, change them to the correct _Oak_ group. For standard PI _Oak_ groups, the group ID (probably) the PI's SUNetID. For CEES users, this is most likely `oak_s-ees`, eg:

```
    chgrp --recursive oak_s-ees /oak/stanford/schools/ees/$GROUP/my_new_data_dir
```

or equivalently -- and perhaps more familiar,

```
    chown --recursive :oak_s-ees /oak/stanford/schools/ees/$GROUP/my_new_data_dir
```
 

