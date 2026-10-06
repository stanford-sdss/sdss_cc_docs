---
title: Software and Moduules
---

# Software and Modules

Because HPC platforms service large numbers of users and broad spectra of scientific and computational discipilines, they must support an astronomical (pun acknowledged...) domain of software. Decades of experience managing shared HPC have taught administrators two imporant lessons:

1. There is no one, perfect (or even functional) configuration.
2. It is impractical for a sys admin -- or even a team of admins, to attempt to dictate the best research software solutions.

Consequently, HPC administration has adopted tools and practices to provide central repositories of core packages, while permitting users to compile,
install, mix, and match the software they need to do research. The general principles and tools employed include:

1. Users will not have `root` access and cannot install software into the (typically) default, system locations (eg., `/usr/local`). Note this means that package managers such as `apt, apt-get, yum, and brew` will not be available to ordinary users.
2. _Users can still install software_ to various locations, including `$HOME`, `$GROUP_HOME`, `$SCRATCH`, `$GROUP_SCRATCH`, or any other space where the user has write and execute privilegse.
3. NOTE: The specific paths available for (2) above will vary from one HPC platform to another. Also, installing to these paths may require setting some environment variables (eg `$PATH`, `$LD_LIBRARY_PATH`) to make the software available.
4. Software is available as "modules", using GNU `modules`, `LMOD`, or some other modules platform. These systems make software available, enabling users to configure their software environment, primarily by setting environment and path variables.
5. Modules are not just for admins! Users can develop module scripts for their own custom insalled software.

# Modules

In most HPC environments -- Sherlock included, the module system should be the first place to look for software.

Sherlock uses the popular `LMOD` module system. Module scripts are written for individual packages, or sometimes to make a group of package
available together.

To see available modules,

```
module avail
```

To look for a module, for example a module "like" NetCDF, use `module spider`, for example:

```
module spider netcdf
```

Sherlock may include some hierarchical module stacks, and sets of modules that take advantage of LMOD's built in package, version interpretation.
Typically, LMOD/lua modules are stored and interepred like `{package_name}/{version}.lua`, and LMOD is smart enough to interpret some incomplete entries. For example,
if `my_sw` is available in versions `2.1.`, `2.0.0`, `1.9`, `module load my_sw/` will load `v2.1`, unless a different default is defined; `module load my_sw/2.0` and
`module load my_sw/1.` will load versions `2.0.0` and `1.9`, respectively.

In addition to the standard SW modules available on Sherlock, some SDSS specific software, including `CMG`, `dune`, `seissol`, and Schlumberger applications have been compiled (or installed) and can be loaded as modules. These modules can be activated by using the `module use` command:

```
module use /home/groups/sh_s-dss/share/sdss/modules/modulefiles
```

General purpose, comprehensive SW stacks may also be available, but they are currently very much in `beta` state. If standard Sherlock software modules are not sufficient to compile and maintain your software, please request support.

Note that software and modules may have somewhat rigorous compatibility requirements for various dependencies and supporting packages. Of most particular interest, some packages will have dependencies on a specific version of a compiler or MPI.

## Custom modules
Custom modules can be maintained to facilitate access to lab- or personal-specific software or to load common bundles of software. Module files can be saved anywhere, but should follow certain standard operating procedures (SOPs), in order to be more easily discovered and interpreted, and to take advantage of LMOD's directory based hierarchical system. 

Common places to keep user or group modules might be `${HOME}/.local/modulefiles`, `${HOME}/local/modulefiles`, `$GROUP_HOME/.local/modulefiles`, etc. These modules would then be activated (made available to the module system) by exeduting a `module use` command, eg:

`module use ${HOME}/.local/modulefiles`

The best way to learn how to write module script is to 1) search the internet for "LMOD Lua" syntax documentation, and 2) to copy from module scripts from Sherlock. Many elements of most module scripts can be filled automatically, so it there is value in spending some time to write a good module script template. A quick way to find the path to a module script is to start with a module show, eg:

```
module show gcc/12.4.0
```
```
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   /share/software/modules/devel/gcc/12.4.0.lua:
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
prepend_path("PATH","/share/software/user/open/gcc/12.4.0/bin")
prepend_path("LIBRARY_PATH","/share/software/user/open/gcc/12.4.0/lib")
prepend_path("LIBRARY_PATH","/share/software/user/open/gcc/12.4.0/lib64")
prepend_path("LD_LIBRARY_PATH","/share/software/user/open/gcc/12.4.0/lib")
prepend_path("LD_LIBRARY_PATH","/share/software/user/open/gcc/12.4.0/lib/gcc/x86_64-pc-linux-gnu")
prepend_path("LD_LIBRARY_PATH","/share/software/user/open/gcc/12.4.0/lib64")
prepend_path("CPATH","/share/software/user/open/gcc/12.4.0/include")
prepend_path("MANPATH","/share/software/user/open/gcc/12.4.0/share/man")
pushenv("CC","gcc")
pushenv("FC","gfortran")
pushenv("F90","gfortran")
pushenv("F77","gfortran")
pushenv("CPP","cpp")
pushenv("CXX","c++")
whatis("Name:        gcc")
whatis("Version:     12.4.0")
whatis("Category:    devel, compiler")
whatis("URL:         http://gcc.gnu.org")
whatis("Description: The GNU Compiler Collection includes front ends for C, C++, Fortran, Java, and Go, as well as libraries for these languages (libstdc++, libgcj,...).")
```

Note that fie first line shows where to find the module script; the following lines show what the script renders.

## A py-sherlock/ module
As an example of a bundling module, consider Sherlock's modular implementation of Python. Executing `module load python/3.9` will load `python@3.9` _only_. By design, this excludes `numpy`, `matplotlib`, and other very common python packages. Python packages can then either be built by the user, either manually or using `pip`/`pip3`, or in some cases they can be loaded as modules -- for example, `numpy` can be provided for `python@3.9` via `module load py-numpy/1.24.2_py39`.

Rather than repeatedly loading a long list of `py-*` Python extension modules -- which can become cumbersome and lead to mistakes, it might be preferable to bundle common Python configureations into module scripts. For example, this `py-sherlock/` modlue would load Python and several common numerical libraries and plotting routines:

```
-- lua
--
-- NOTE: not all of these LMOD dependencies stack up properly , but they will probably be fine...
--
depends_on('devel', 'viz', 'math', 'python/3.9')
depends_on('py-numpy/1.24.2_py39')
depends_on('py-matplotlib/3.7.1_py39')
--depends_on('py-scipy/1.6.3_py39')
depends_on('py-scipy/1.10.1_py39')
--depends_on('py-numpy/1.20.3_py39')
depends_on('py-pandas/2.0.1_py39')
--depends_on('py-numba/0.54.1_py39')
--depends_on('py-h5py/3.7.0_py39')
--
-- spoof numba module:
--depends_on("py-numpy/1.20.3_py39")
prepend_path("PATH","/share/software/user/open/py-numba/0.54.1_py39/bin")
prepend_path("PYTHONPATH","/share/software/user/open/py-numba/0.54.1_py39/lib/python3.9/site-packages")
--
depends_on('py-jupyter/1.0.0_py39', 'py-ipython/8.3.0_py39')
-- depends_on('py-scikit-learn/1.0.2_py39')
--
-- and spoof py-scikit-learn/
--depends_on("py-numpy/1.20.3_py39")
--depends_on("py-scipy/1.6.3_py39")
prepend_path("PYTHONPATH","/share/software/user/open/py-scikit-learn/1.0.2_py39/lib/python3.9/site-packages")
--
pushenv("PYTHON", "/share/software/user/open/python/3.9.0/bin/python3")
-- this looks like a good idea, but ultimately does not work well for many applications. But this is how you set an alias...
--set_alias("python", "python3")
```

In order to use this script:
- Save the script to a standard location and following the LUA/LMOD convention, for example `${HOME}/.local/modulefiles/py-sherlock/3.9.0.lua`
- Activate those modules (tell LMOD to look in that path for module scripts): `module activate ${HOME}/.local/modulefiles
- `module show py-sherlock/` will now show the module
- Load the module: `module load py-sherlock/`
  


# Building and Installing Software

Build packages, such as `*.rpm` and `*.deb` files will typically not work properly without `sudo` access. Users will not be granted `sudo` access on the HPC, so plese don't ask.
Nonetheless, software can almost always be installed and/or compiled to a user defined location. This is typically accompilished via something like:

- `./configure --prefix=$HOME/my_sw`
- `cmake -DCMAKE_INSTALL_PREFIX:PATH=$HOME/my_sw`
- `pip install --user my_sw_package`
- `conda install my_sw_package`

It may then be necessary to amend some path variables. Assuming that we install binaries (executables) and libraries to `$HOME/my_sw/bin` and `$HOME/my_sw/lib`, respectively,
in the command line (for temorary scope), in your `~/.bashrc`, or even better in a module file:

- `export PATH=$HOME/my_sw/bin:$PATH`
- `export LD_LIBRARY_PATH=$HOME/my_sw/lib:$LD_LIBRARY_PATH`

