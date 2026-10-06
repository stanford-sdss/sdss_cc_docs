---
title: Python on Sherlock
---

# Python on Sherlock
Python is well supported on Sherlock. Its implementation may vary based on user preferences and requirements. Options for using Python on Sherlock include

- Sherlock modules
- Sherlock modules + virtual environments
- Ana-, Mini-, or some other Conda
- Build your own!

Note also that, for reasons related to the "base" version of Python, used by Sherlock's CentOSX operating system and in order to back-support some older codes, the "default" version of Python is `v2.7` and even when Python modules are loaded the command `python` will often refer to `/usr/bin/python`, which is the system's "base" `python@2.7`. In order to run the desired "module loaded" python, use the `python3` command, eg:

```
[sh02-01n58 ~] (job 57166857) $ module load python/3.12
[sh02-01n58 ~] (job 57166857) $ which python
/usr/bin/python
[sh02-01n58 ~] (job 57166857) $ which python3
/share/software/user/open/python/3.12.1/bin/python3
```

# Python versions
Software packages will often specify a version requirement for Python, among other dependencies. Generally speaking, and perhaps especiall for Python, these requirements should be considered subjectively and -- in most cases, not taken too literally. Remember that -- especially in the domains of scientific and research computing, software is written and maintained by people who are better descibed as domain experts than software engineers, and whose time and priorities might be more focused on scientific objective, publicatiopns, and grant proposals than refining and maintaing software. This is even more true with respect to documentation and often with respect to version specification. As often as not, a version "requirement" is simply a statement that, "This code worked with `v@x.y.z` at least once.

When considering a specified version requirement, consider:

- When was the documentation written? Was `v@x.y.z` the most current at the time of documentation?
- Are there known, significant new or depricated features in a newer version of the dependency SW (eg, `Python`)?
- Are there known syntax changes -- in Python itself or its dependencies?
- Generally, how strictly should this version requirement be considered?
- What kind of codes are you running? Do they tend to defer to older, "stable" versions of SW, or do they tend to be on the bleeding edge.

Opinions on the matter will vary, but there are strong arguments in favor of trying to stay on the leading, not trailing, edge of software versioning. In other words if a software package's documentation recommend Python 3.6 (circa 2016) and today is 2025, it might be better to start with Python 3.12 (or so...) and possibly work back a sub-version or two, or even consider making some simple updates to the code, rather than satisfy a dependency that will soon be -- if it is not already, depricated.

Especially for software with complex dependency graphs, older versions of software can quickly go "stale." Even when named or known dependencies are explicitly satisfied, it is easy to miss second order dependencies ("dependencies of dependencies"), which can cause problems. These issues can often be mitigated by controlling the factors that are in our control -- updating our codes, and trying to keep pace and up to date with changing (usually improving...) code bases. Generally speaking, a good practice is often to start with the most current version of any software (`python`...), and work your way back to lower versions, if necessary.

# Sherlock modules
Sherlock supports several versions of Python, which are periodically updated to add newer and remove older versions. As usual, a good start is,

```
module spider python/
```

This is certainly the quickest way to access a basic, stripped down version of Python on Sherlock. For relatively simple implementations of Python -- ie, jobs that require only a few python libraries, this is by itself likely a good option.

## Loading python library modules
Supporting python modules, like `numpy` or `pandas` are prefixed with `py-` and then suffixed with the appropriate python version. Again, `module spider` is a great place to start, eg.

```
module spider py-numpy

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  py-numpy:
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Description:
      NumPy is the fundamental package for scientific computing with Python.

     Versions:
        py-numpy/1.14.3_py27 (math)
        py-numpy/1.14.3_py36 (math)
        py-numpy/1.17.2_py36 (math)
        py-numpy/1.18.1_py36 (math)
        py-numpy/1.19.2_py36 (math)
        py-numpy/1.20.3_py39 (math)
        py-numpy/1.24.2_py39 (math)
        py-numpy/1.26.3_py312 (math)
```

Note that, for example, `py-numpy/1.26.3_py312` is the correct module to use with `python/3.12`. Note that these modules are written with an upstream hierarchy -- the LMOD script for `py-numpy/1.26.3_py312` includes a `depends_on('python/3.12')` requirement, so:

1. You can skip to the `numpy` load; `module load py-numpy/1.26.3_py312` will load `python/3.12` as an upstream dependency.
2. Be careful to load the correct `py-` module(s), since they might rearrange some other versioning choices you might have made. `module load py-numpy` will load the _default_ version of `py-numpy` (whatever that is...), including the `python/` and other supporting modules.

## pip install
Software not available as a `module load` can be installed using `pip` or `pip3`. When using `pip`, please consider:
1. Similar to `python/python3` on Sherlock, use `pip3`  to install to Python 3.x builds; `pip` will likely refer to Python 2.7
2. If you are not using virtual environments (see below), use the `pip3 install --user {package_name}` option. This will install packages to your "user" space, probably your `$HOME` space. For large packages, this will quickly become a problem since `$HOME is limited to a 15 GB quota. There is almost certainly some way to specify the location for `--user`, and there may be a `-t` or `--target` option that can be used to specify install locations on an ad-hoc basis.
3. A better option is to configure a Virtual Environment (see below) in an appropriate location (`$GROUP_HOME`). After a virtual environment is activated, `pip` or `pip3` will install directly to that space, as if it was a "normal" build on your laptop.
4. `pip` will solve dependency graphs based on packages available to it -- including `module load` packages. Consequently, it is typically not advised to mix `module load` and `pip` -- except for simple, or well controlled cases. See "Mixing and Matching" below for an extended discusson on this topic.
   
# Anaconda
Anaconda, Miniconda, etc. can be installed on Sherlock. The process is identical to installing on a personal machine -- laptop, lab server, etc., except you will need to specify an install location. Since Conda installations can get quite large, especially for machine learning (ML) applications, we recommend that you _not_ install into your `$HOME` space -- since this space on Sherlock is limited to only `15 GB`. Instead, install to your `$GROUP_HOME` space, which has a `1TB` quota.

Note that you will need to provide the full path to to where you want Anaconda, Miniconda, etc. to install; the installer will not create a directory called -- for example, `anaconda` in the path your provide it. A common approach is to nest user subdirectories in the `$GROUP_HOME` space. In this case, a common install prefix for Anaconda would be,

```
/home/groups/$GROUP/$USER/anaconda
```

Note that one issue with Anaconda is that it has a tendency to produce large numbers of small files and also to be "greedy" in the way it manages software -- it will install many very similar versions of a package to match requirements, and so it can take up a lot of space. These factors can be problematic in an HPC environment, and can also adversely affect performance, so it is generally recommended that Python modules (see above) and virutal environments (see below) be considered in lioe

# Python: Clean install

It is easy enough to just install Python yourself, "the regular way." An excellent trick to compiling Python to work well on Sherlock is to load an existing Python module (plus a good compiler), eg `module load gcc/12.4 python/3.12` to build Python. This will ensure that certain libraries, for example `libffi/`, `libressl/` are available. Ideally then, you might write an LMOD module script, based on the `python/3.12` module in this example, to load that version of Python.

As with many other tasks, the best way to get started here is to web query (or "Google") for "install python," or similar prompt. A few things to remember up front:

- Specify a `--prefix` location to install the SW, during the configure phase, eg. `./configure --prefix=$HOME/local/python`
- Review other `./configure` options, in the documentationa and by using `./configure --help`
- The `./configure` script might recommend some options at the end of its process; you might want to re-run with those options
- Likely, you will want something like this: `./configure --prefix=$PYTHON_ROOT --with-valgrind --enable-optimizations --with-openssl=/share/software/user/open/openssl/3.0.7 --enable-shared`
- Note that you will need to specify the full path to execute your installed Python, and/or add that path to your `*PATH` variables, ie:
    - PATH=${PYTHON_PREFIX}/bin:${PATH}
    - LD_LIBRARY_PATH=${PYTHON_PREFIX}/lib:${LD_LIBRARY_PATH}
    - LIBRARY_PATH=${PYTHON_PREFIX}/lib:${LIBRARY_PATH}
    - CPATH=${PYTHON_PREFIX}/include:${CPATH}

### Copying the Python LMOD module
A more sophisticated and rigorous approach is to _copy_ the Sherlock module and build specifications. Summarizing these steps:
- Download the source code, see:
  [https://www.python.org/downloads/] (https://www.python.org/downloads/)
- Determine an installation location, eg. `PYTHON_ROOT=${GROUP_HOME}/${USER}/software/python/${PYTHON_VERSION}
- Create a copy the Sherlock `python/3.9`, `python/3.12`, etc. module to your personal modules
- Modify the module script to reflect the new SW location in `$PYTHON_ROOT`
- Load your python module
- configure and install:
  - cd {path to python source}
  - rm -rf build;mkdir build
  - cd build
  - `../configure --prefix=$PYTHON_ROOT --with-valgrind --enable-optimizations --with-openssl=/share/software/user/open/openssl/3.0.7 --enable-shared`

In greater detail, and using Python 3.13.2 as an example:

Create a module file:
```
mkdir -p ${HOME}/.local/modulefiles/python
vim ${HOME}/.local/modulefiles/python/3.13.2.lua
```

Then, paste (or via some other method) the following content into that file:
```
VER=myModuleVersion()
SW_NAME=myModuleName()

whatis("Name : Python")
whatis("Version : " .. VER)
whatis("Target : x86_64")
whatis("Short description :  A python build with few bells-n-whistles and where python -> python3 ")
whatis("Build on gcc@14.2.0")
-- 
help([[ google for python... ]])
--
-- NOTE: These 
sw_root=pathJoin(os.getnv("GROUP_HOME"), os.getenv("USER"), "software/no_arch/gcc/12.4.0/python", VER)
--
depends_on("system", "devel")
depends_on('openssl/3.')
depends_on("zlib/1.2.11")
depends_on("libressl/3.2.1")
depends_on("tcltk/8.6.6")
depends_on("sqlite/3")
depends_on("libffi/3.2.1")
depends_on("valgrind/")
--
prepend_path("PATH", pathJoin(sw_root, "bin"))
prepend_path("LIBRARY_PATH", pathJoin(sw_root,"lib"))
prepend_path("LD_LIBRARY_PATH", pathJoin(sw_root,"lib"))
-- /home/groups/sh_s-dss/share/sdss/software/no_arch/gcc/14.2.0/python/3.13.1/include/python3.13/
prepend_path("CPATH", pathJoin(sw_root, "include"))
prepend_path("CPATH", pathJoin(sw_root, "include", "python3.13"))
--prepend_path("LD_LIBRARY_PATH", pathJoin(sw_root,"lib64"))

prepend_path("MANPATH", pathJoin(sw_root,"man", "man1"))
prepend_path("MANPATH", pathJoin(sw_root,"include"))
--
prepend_path("PKG_CONFIG_PATH", pathJoin(sw_root,"lib", "pkgconfig"))
--
prepend_path("LIBRARY_PATH", pathJoin(sw_root,"lib"))
prepend_path("LIBRARY_PATH", pathJoin(sw_root,"lib64"))
--
pushenv("PYTHON_ROOT", sw_root)
```

Now, download the source, `./configure`, and `make`. Something like,

```
mkdir -p $SCRATCH/Downloads/python
cd $SCRATCH/Downloads/python
wget https://www.python.org/ftp/python/3.13.2/Python-3.13.2.tgz
tar xzvf Python-3.13.2.tgz 
cd Python-3.13
rm -rf build
mkdir build
cd build
../configure --prefix=$PYTHON_ROOT --with-valgrind --enable-optimizations --with-openssl=/share/software/user/open/openssl/3.0.7 --enable-shared
make -j $SLURM_CPUS_ON_NODE
make install
```

Now, if desired create a symlink `python -> python3`,

```
ln -s ${PYTHON_ROOT}/bin/python3 ${PYTHON_ROOT}/bin/python
```

Note that these instructions are most likel not copy-paste ready; their precise, error-free implementation is left to the user as an exercise.

# Virtual Environments
Virtual environments are an easy way to build Python applications or workflows, with complicated dependency graphs, without interfering or conflicting with other Python applications or workflows, that also have complicated dependency graphs. Several software packages provide virtual environment functionality, including `conda`. In this section, we focus on `virtualenv`, also known as `venv`. 

## Install `Virtualenv`
Virtualenv is installed on most, if not all, Sherlock Python installations; if you have compiled your own Python, it might be necessary to install it yourself. This is done the standard way,

```
pip install virtualenv
```

or

```
pip install --user virtualenv
```

if Python is installed to a non-writeable (by you) disk space.

## Creating and activating an environment
The general syntax to create an environment called `myenv` is,

```
python3 -m venv myenv
```

Note first that `python3` not the more familar `python` may be necessary on Sherlock, as discussed above. Note also that this creates the environment in the current, local path. To create a collection of environments, for example in your Sherlock `$GROUP_HOME` spacek, consider something like:

```
mkdir -p ${GROUP_HOME}/${USER}/python_envs
python3 -m venv ${GROUP_HOME}/${USER}/python_envs/venv_1
python3 -m venv ${GROUP_HOME}/${USER}/python_envs/venv_2
...
```

An enviroment is then activated by "source" running the `activate` script in the environment's `.../bin` directory, eg.

```
. ${GROUP_HOME}/${USER}/python_envs/venv_1/bin/activate
```

or

```
source ${GROUP_HOME}/${USER}/python_envs/venv_2/bin/activate
```

To deactivate the enviornment, and fall back to the `base` (not-)environment, use the `deactivate` command. To remove the environment, simple delete the directory -- eg,

```
rm -rf ${GROUP_HOME}/${USER}/python_envs/venv_1
```

Note also, be VERY CAREFUL with `rm -rf`. The `-rf` flags tell the `rm` command to be 'recursive' (walk down the directory tree), and `-f` means "force," which means that it will delete files and directoreis with "read-only" flags, or similar weak protections. In short, do not point `rm -rf` at a path you do not want to delete entirely.

## Using `venv` in Jupyter
Virtual environments can be used in Jupyter Notebook or Jupyter Lab two ways. For the first method, simply activate the environment, then launch Jupyter,

```
. ${ENVS_PATH}/myenv/bin/activate
jupyter notebook
```
Unfortunatly, this method cannot be used with OnDemand, and if not now, it is not unlikely that some functionality in Jupyter might by default execute a `deactivate` command during instantiation, so it is likely worth understanding a more explicit approach.

The second approach is to 'register' the environment with IPython Kernel. If necessary, install ipykernel:

```
pip install ipykernel
```

If you are using a Sherlock Python module, 

```
module spider py-ipython

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  py-ipython:
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Description:
      IPython is a command shell for interactive computing in multiple programming languages, originally developed for the Python programming language.

     Versions:
        py-ipython/5.4.1_py27 (devel)
        py-ipython/6.1.0_py36 (devel)
        py-ipython/8.3.0_py39 (devel)
        py-ipython/8.22.2_py312 (devel)
```

Then select the appropriate version -- for example, for Python 3.9

```
module load py-ipython/8.3.0_py39
module load py-jupyter/1.0.0_py39
```

Then to add an environment to `ipython`,

```
python3 -m ipykernel install --user --name=${ENVS_PATH}/myenv
```

## Conda environments
In addition to an excellent package manager and dependency solver, Conda also provides a robust virtual environment system. Conda includes syntax to initiate an environment with SW packages -- likely the package of greatest interest for the given environment (eg, an environment to support specific configurations of TensorFlow or PyTorch), and Conda enviornment can support multiple versions of Python. For esample, to instantiate environment based on Python 3.9,

```
conda create -n myenv python=3.9
```

Or a TensorFlow environment that requires `tensorflow@2.16`:

```
conda create -n tf_demo tensorflow=2.16
```

That environment can then be activated with the `conda activate` command,

```
conda activate myenv
```

Or removed, either by navigating to the environment path (which is not too difficult to locate in the directory where `conda` is installed), or by

```
conda env remove -n myenv
```

Note that there is some inconsistency in the syntax of `coda` vs `conda env`, where some environment related commands have been integrated directly into `conda`, some are likely slated to be integrated, but have not yet been, some are mapped between both syntaxes (eg, `conda do_something` = `conda env do_something`). This inconsistency can be frurstrating, but is usually quickly resolved by a combination of trial and error, a web query, or both.

Also note that,l if `conda` cannot solve an environment, you may get a useful message and depency tree, like:

```
conda create -n tf_demo python=3.13 tensorflow
Channels:
 - conda-forge
 - defaults
Platform: osx-arm64
Collecting package metadata (repodata.json): done
Solving environment: failed

LibMambaUnsatisfiableError: Encountered problems while solving:
  - nothing provides _python_rc needed by python-3.13.0rc1-h17d3ab0_0_cp313t

Could not solve for environment specs
The following packages are incompatible
├─ python 3.13**  is installable with the potential options
│  ├─ python [3.13.0|3.13.1], which can be installed;
│  └─ python [3.13.0rc1|3.13.0rc2|3.13.0rc3] would require
│     └─ _python_rc, which does not exist (perhaps a missing channel);
└─ tensorflow is not installable because there are no viable options
   ├─ tensorflow [2.10.0|2.11.0|...|2.9.1] would require
   │  └─ python [3.10.* |>=3.10,<3.11.0a0 ], which conflicts with any installable versions previously reported;
   ├─ tensorflow [2.10.0|2.11.0|...|2.9.1] would require
   │  └─ python [3.8.* |>=3.8,<3.9.0a0 ], which conflicts with any installable versions previously reported;
   ├─ tensorflow [2.10.0|2.11.0|...|2.9.1] would require
   │  └─ python [3.9.* |>=3.9,<3.10.0a0 ], which conflicts with any installable versions previously reported;
   ├─ tensorflow [2.12.0|2.12.1|...|2.17.0] would require
   │  └─ python [3.11.* |>=3.11,<3.12.0a0 ], which conflicts with any installable versions previously reported;
   ├─ tensorflow [2.16.1|2.17.0] would require
   │  └─ python_abi 3.12.* *_cp312, which requires
   │     └─ python 3.12.* *_cpython, which conflicts with any installable versions previously reported;
   └─ tensorflow 2.17.0 would require
      └─ python >=3.12,<3.13.0a0 , which conflicts with any installable versions previously reported.
```

You can also query `conda` fore known dependency trees, for example

```
conda search tensorflow=2.16 --info

tensorflow 2.16.1 cpu_py312h4d8845c_0
-------------------------------------
file name   : tensorflow-2.16.1-cpu_py312h4d8845c_0.conda
name        : tensorflow
version     : 2.16.1
build       : cpu_py312h4d8845c_0
build number: 0
size        : 42 KB
license     : Apache-2.0
subdir      : osx-arm64
url         : https://conda.anaconda.org/conda-forge/osx-arm64/tensorflow-2.16.1-cpu_py312h4d8845c_0.conda
md5         : e3a8b568e0fb70ab63775b0c9c913c09
timestamp   : 2024-05-23 03:30:17 UTC
track_features: 
  - tensorflow-cpu
dependencies: 
  - python >=3.12,<3.13.0a0
  - python_abi 3.12.* *_cp312
  - tensorflow-base 2.16.1 cpu_py312hc172961_0
  - tensorflow-estimator 2.16.1 cpu_py312ha916e62_0

...

tensorflow 2.16.1 cpu_py39h009d07a_0
------------------------------------
file name   : tensorflow-2.16.1-cpu_py39h009d07a_0.conda
name        : tensorflow
version     : 2.16.1
build       : cpu_py39h009d07a_0
build number: 0
size        : 42 KB
license     : Apache-2.0
subdir      : osx-arm64
url         : https://conda.anaconda.org/conda-forge/osx-arm64/tensorflow-2.16.1-cpu_py39h009d07a_0.conda
md5         : 431ff1e36183b964c63d8c4beac13779
timestamp   : 2024-05-22 20:04:13 UTC
track_features: 
  - tensorflow-cpu
dependencies: 
  - python >=3.9,<3.10.0a0
  - python_abi 3.9.* *_cp39
  - tensorflow-base 2.16.1 cpu_py39h6d6c348_0
  - tensorflow-estimator 2.16.1 cpu_py39h9ff499c_0

```

# Containers: Large environments and ensembles
On Sherlock HPC, user `$HOME` spaces are limited to `15GB`. `conda` and `venv` environments, especially environments that include machine learning frameworks, like `TensorFlow` or `PyTorch` can easily exceed `10GB`, so it is generally recommended that environments be stored in `$GROUP_HOME`, _not_ `$HOME`. For numerous, or very large environments, or for other circumstances that test the `1TB` quota on `$GROUP_HOME`, containers should be _strongly_ considered before building environments on Oak; Python codes will run poorly from Oak.

Similarly, large ensemble calculations -- that run hundreds or thousands of instances of a Python code, may experience significant slowdowns as the number of instances increases. This is because many, many instances of Python are accessing the same code base, on the same filesystem. The solution is to serialize the job structure (eg, run 100 instances that each run 1000 steps, rather than 1000 instances that each run 100 steps). This, of course, somewhat defeats the purpose of parallelizing on the HPC in the first place. 

In both cases, containerizing the Python environment might be a viable, effective solution. Containers displace a single inode on disk, and are loaded entirely into memory at instantiation, so they can significantly reduce a job's IO load. That said, it is important to reduce the total size of the container, as much as possible, and there is some nuance to running Python environments in containers. If you think your job is a good candidate for containerization, plese contact `srcc-support`.


# Mixing and Matching
Under most circumstances, for most users, it is advisable to pick a Python strategy (`module load`, `venv`, `conda`) and stick with it. That is to say, if you have a simple dependency graph that can be satisfied by a few Sherlock modules, that is likely the best solution -- it there is no software to install, will not require disk space, and uses well supported components. On the other hand, this can create complications if modules are not loaded correctly or Sherlock software is updated behind the scenes.

For example, if you only use one or two `py-` modules and have well defined, dependable system to load them when you run Python, you can save yourself some disk space and compile time by using those modules. If, however you forget to load those modules, your code will almost certainly run into errors and throw exceptions, since certaion SW is not available or where it is expected to be. Worse, if you build up packages `A`, `B`, `C` based on one set of dependencies -- eg, `py-numpy/`, then on a later day `pip install D E` without `module load py-numpy/`, `pip` may solve the dependency graph by installing a new/different version of `numpy`, which may (on a later date and in a weird way) conflict with packages `A`, `B`, `C`, and might produce exotic errors, exceptions, and segmentation faults. This can be a problem for both `conda` and `venv` environments, so the general counsel is to be careful and consistent.

## Local LMOD
One way to mitigate this problem -- to permit the safe integration of `module load` and `pip`, is to write your own `LMOD` module scripts. LMOD syntax is well documenbted on the internet; scripts (and their templates) can be copied from Sherlock (or any other source that uses modules), and moduel scripts can be activated by appending the path containing those module scripts to the `MODULEPATH` environment variable. Module/software versions are controlled by the name of the directory and module script file, which follow a pattern like `{MODULEPATH_ROOT}/{package_name}/{package_version}.lua`

For example, module script files can be written into a path `~/.local/modulefiles`, and
```
MODULEPATH=${HOME}/.local/modulefiles
#
tree ~/.local/modulefiles/
/home/users/myoder96/.local/modulefiles/
├── nco-local
│   ├── 4.8.0.lua
│   ├── 5.0.6.lua
│   └── default -> 4.8.0.lua
├── py-sherlock
│   ├── 3.12.1.lua
│   ├── 3.9.0.lua
│   └── default -> /home/users/myoder96/.local/modulefiles/py-sherlock/3.9.0.lua
├── sbc-lisp
│   ├── 1.4.3.lua
│   └── 2.4.0.lua

```

Further details and discussion of local, user defined module scripts is left to a later article and an exercise for the reader.

# Managing Threads

## Overview
Over-subscription (or parallelization) -- running a Python script on way too many threads, can be a challenge in an HPC environment. This can occur when the number of workers, jobs, etc., in a librarly is determined based on the number of CPUs (CPU cores) on the _machine_, not the number assigned to a SLURM allocation. For example, something like `P = multiprocessing.Pool(multiprocessing.cpu_count())` may be sound code on your laptop, but if your Sherlock job is allocated a single CPU, on a single task, on an `SH4_CSCALE` machine, that code will allocate 256 worker threads to a single CPU, which will use excessive user memory, and introduce significdant system overhead -- all for negligible if not negative performance benefit. Additionally, some numerical libraries might be compiled to automatically use OpenMP (OMP)  or other thread based parallelization. In these cases, the default number of threads is likely set by an environment variable, for example OMP sets its thread count based on the `OMP_NUM_THREADS` environment variable. `NumPy` and other libraries might alternatively use `MKL_NUM_THREADS` or a similar variable.

Common scenarios and solutions include:

## Environment Variables
Check the values of and possibly set the variables. Note that SLURM should set at least some of these variables to the number of CPUs assigned to a task, but some variables might not be set, a script or line in code might assign a different value, or an obscure piece of code might use an obscure variable. The following variables, more or less, should be set equal to the number of CPUs assigned to a given task.
- `OMP_NUM_THREADS`: SLURM _should_ set this to the number of CPUs assigned to a given task.
- `MKL_NUM_THREADS`
- `OPENBLAS_NUM_THREADS`

To diagnose and rectify, first reveiw the values of these variables, eg. in your BASH script:

```
#!/bin/bash
#
module load python/3.12
printf "OMP: ${OMP_NUM_THREADS}\n"
printf "MKL: ${MKL_NUM_THREADS}\n"
printf "OPENBLAS: ${OPENBLAS_NUM_THREADS}\n"
#
# NOTE: the heavy lifting part of your script is commented out until we figure out where all those threads are coming from!
# result = python3 do_science.py
```

If one or more of these variables is set incorrectly, or if you are just a, "Ready, Fire, Aim!" type of person, the following might correct the over-subscription problem:

```
#!/bin/bash
#
module load python/3.12
printf "OMP: ${OMP_NUM_THREADS}\n"
printf "MKL: ${MKL_NUM_THREADS}\n"
printf "OPENBLAS: ${OPENBLAS_NUM_THREADS}\n"
#
export OMP_NUM_THREADS = ${SLURM_CPUS_ON_NODE}
export MKL_NUM_THREADS = ${SLURM_CPUS_ON_NODE}
export OPENBLAS_NUM_THREADS = ${SLURM_CPUS_ON_NODE}
#
result = python3 do_science.py
```

## Multiprocessing and Code
Review (search) your code for instances where `multiprocesssing`, or a similar library, assigns the number of threads, tasks, or workers to a process. For example, `n_cpus = multiprocessing.cpu_count()` or `P = multiprocessing.Pool()`. One strategy to manage these instandces is to write a short piece of logic, which can in principle be executed once at the top of your code, that checks for SLURM (or other...) variables that define CPU count. For example,

```
import multiprocessing as mpp
import os
#
n_cpus = os.environ.get('SLURM_CPUS_ON_NODE', mpp.cpu_count())

P = mpp.Pool(n_cpus)
```

Similarly, it is possible that environment variables are being set in code, eg:

```
os.environ['OMP_NUM_THREADS'] = multiprocessing.cpu_count()
```

This line should of course be corrected to determine a more appropriate value, or eliminated altogether from the code.

## Python Libraries
There are a handful of Python libraries designed to assist with this challenge. See for example `threadpoolctl`,
[https://github.com/joblib/threadpoolctl] (https://github.com/joblib/threadpoolctl).
It is left as an exercise for the developer to evaluate these libraries.



