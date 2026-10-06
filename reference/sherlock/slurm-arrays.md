---
title: SLURM Examples -- Job Arays
---

# SLURM Job Arrays

## Overview
For a job that consists of numerous identical tasks, for example over a range of parameters or a set of input files, a SLURM Job Array is often a useful tool to simplify your submit script(s), improve your code's versatility, and reduce load on the scheduler.

Consider, for example, the case where we need to process a (possibly very large) set of input files. We have a few options:
1. Write a single script that loops through the input files and executes the processing code.
2. Write a script that processes a single file and submit it once for each file -- presumably with the filename accepted as a parameters
3. Write a script that processes a single file and, with a few _minor_ modifications, submit it to the scheduler as a job array.

The first option is quite direct, but can be difficult to parallelize. The principal problem with the second approach is that, for large numbers of jobs, it can put undue stress on the job scheduler.\\
By using a job array, the third option we can basically apply a single-file script to a large set of input files in a way that does not put undue stress on the job
scheduler (and so will not make the sys-admin angry). This approach will also help you group and organize your workflow, since all of the sub-jobs will share the 
same base job_id, and it can be a good way to develop a script that works well for both a single- or large group of files.

## Example 1
### Setup
To set up our example, we generate some toy input data, using the following script:

```
#!/bin/bash
#
WORK_DIR="`pwd`/array_example_data"
N_FILES=20
INDEX_SKIP=2
K_MAX=$(( ${N_FILES} * ${INDEX_SKIP} ))
echo "** K_MAX: ${K_MAX}"
#
if [[ -d ${WORK_DIR} ]]; then rm -rf ${WORK_DIR}; fi
#
mkdir ${WORK_DIR}
for (( k=0; k< ${N_FILES}; k++ )); do
	K=$(( $k * ${INDEX_SKIP} ))
    echo "some data:\nk=$K\n" >  ${WORK_DIR}/toy_data_${K}.dat
done
```

This script simply creates a data directory `array_example_data` and populates it with some text files. 

### Batch Script and Array 
We will then use this script, which we sae as `array_batch.sh` to "evaluate" the data:

```
#!/bin/bash
#
#SBATCH --ntasks=1
#SBATCH --partition=serc
#SBATCH --output=array_example_%j.out
#SBATCH --error=array_example_%j.err
#
##SLURM_ARRAY_TASK_ID=4

# default values:
F_PATH="array_example_data"
F_NAME="toy_data_0.dat"
F_PATH_NAME=${F_PATH}/${F_NAME}
COMPLETED_FILES_PATH="processed_files"
#
if [[ ! -d ${COMPLETED_FILES_PATH} ]]; then
	mkdir -p ${COMPLETED_FILES_PATH}
fi
#
# if a parameter is provided, assume it is the full pathname. NOTE: we'll overrride
#  this behavior shortly...
if [[ ! -z ${1} ]]; then
	F_PATH_NAME=$1
fi
#
# ... however, if we have an array index, redeine F_PATH_NAME, etc.
if [[ ! -z ${SLURM_ARRAY_TASK_ID} ]]; then
	if [[ ! -z ${1} ]]; then
		F_PATH=${1}
	fi
	#
	# now, how do we get the filename. The easiest thing to do is something like:
	#F_NAME="toy_data_${SLURM_ARRAY_TASK_ID}.DAT"
	#
	# the problem, of course, is that we need to have full control of the filenames.
	# Let's do something like this instead:
	fls=( ./${F_PATH}/*.dat )
	F_NAME=${fls[${SLURM_ARRAY_TASK_ID}]}
	#
	F_PATH_NAME=${F_PATH}/${F_NAME}
	
fi

# The action:
# In this case, not much. We'll just shout out the host name and cat the contents
#  of the file.
echo "Hosthame: `hostname`"
echo "CPU codename: \n`cpu_codename`"
#
echo "File: ${F_PATH_NAME}\n"
cat ${F_PATH_NAME}
mv ${F_PATH_NAME} ${COMPLETED_FILES_PATH}/
```

Note that the SLURM directives in the header of this file are perhaps better suited for a single run, against one input file. We run this as an array by 
1) providing an `--array` directive and 2) modifying the `--output` and `--error` directives slightly. We submit the job like:

```
sbatch --array=0-19 --output=job_array_example_%A_%a.out --error=job_array_example_%A_%a.err array_batch.sh
```

Note that `%A`, `%a` will output the parent jobID and array index, respectively. Submitted this way, SLURM will generate 20 individual jobs; for each job a unique
index value -- in this case `[0..19]` will be assigned to the `SLURM_ARRAY_TASK_ID` environment variable. This variable can be used a number of ways. As discussed 
in the script comments, it can be used to define the input path name, or as we have done in this example, it can be used to select the `k-th` file in the directory. 
It can also be used to select a set of user defined input parameters, for example from a JSON file, or it can be used simply as an input parameter itself.

Note also that this script can be run as an array or against a single file, either interactively or as a batch script, withoout making any additional changes. 
Additionally, a parameter can be provided to specify the input filename (single task mode) or an input directory (array mode).

## Example 2: Serial-parallel hybrid
Consider the case where you need to run many, many very small, short jobs -- eg, several thousand jobs that each run only 1-5 minutes. Generally, we can describe this as a long for-loop,

```
for k in range(N):
  X = do_science(k)
```

As `N` gets large, we become impatient and look for opportuniteis to parallelize. Inevitably, parallelization can be accomplished in code, but "embarassingly parallel" solutions, where the serial job is simply run in multiple tasks, is often a cost effective (quck and easy), viable solution. The obvious implementation is to run this loop over `N` steps as `N` individual jobs. Theree are two basic (very solvable) problems with this approach:
1. The scheduler will complain about scheduling `N` jobs, and your sys admin has likely placed restrictions on the number of jobs you can submit to the scheduler -- in this case `N_{max} << N`
2. The overhead to acquire resources and constantly re-load libraries will compromise job performance -- the individual steps are too small to warrant a job.

Job arrays -- plus a little syntax, can solve both of these problems. The example below uses a job array to break the serial loop over `N` into several smaller serial loops, then run those smaller loops as parralel tasks. In this case, 100 individual calculations are broken up into 10 array tasks, whcih each loop over a subset of 10 calculations. Note also that the paralleliztion is defined entirely in the job array directive, `--array=1-100:10%4`, where `1-100` defines the upper and lower limit of the array; `:10` defines the step size (`1,11,21,...,91`), and then we add the concurrency operator `%4` as a matter of courtesy, to limit our array to `4` simultaneous tasks, so that we remember to share resources with our friends and colleagues.

For diagnostic purposes, this job will create output and error files (`.out` and `.err`), for each array job, in the local path.

```
#!/bin/bash
#
#SBATCH --job-name=serial_array_demo
#SBATCH --output=serial_array_%A_%a.out
#SBATCH --error=serial_array_%A_%a.err
#SBATCH --partition=serc,normal
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem-per-cpu=1g
#SBATCH --time=00:15:00
#SBATCH --array=1-100:10%4
#
# This is a toy script to illustate how to use a Job Array (--array=)
# to break up a loop into small subsets, then parralelize those subsets.
#
# In particular, this example addresses the case of many, many verey small
# (eg, less than a few minutes) jobs.
#
# The basic structure is a for loop. Then we invoke the SLURM_ARRAY
# variables to break it up into parallel tasks, but still serializing
# over a subset of the sequence. Note that, for debugging and development,
# we can list all of the job's SLURM variabies with,
# env | egrep '^SLURM'
#
# Default values, just in case!
START=1
END=100
#
# Detect --array. If there is an array, set new START END values:
if [[ ! -z ${SLURM_ARRAY_TASK_ID} ]]; then
  START=${SLURM_ARRAY_TASK_ID}
  END=$((START+SLURM_ARRAY_TASK_STEP))
fi
#
#
printf "START: $START, END: $END\n"
#
for ((k=START; k<END; k++))
do
  printf "On Index[${k}]: do_science($(hostname))\n"
done
#
# DEBUG:
# show me all the SLURM variables, for diagnostic purposes
#printf "SLURM variables:\n"
#env | egrep '^SLURM'
```
