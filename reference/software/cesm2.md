---
title: Estimating Job Resources
---

# CESM2: Configuration
The Community Eearth System Model, version 2 (CESM2) is a flexible, modular Earth systems simulator. The code is (presently) avaible for download, free of charge. Once downloaded, some assembly is required. The CESM2 codebase has several dependencies, which can be challenging to compile in such a way that they work together. We address some of those challenges here, in this document.

CESM invokes a somewhat unusual workflow, where scripting tools compile customized executables that include user defined collections of modules and data sets. A subsequent script then submits jobs, which will run that execuable against those data, to the scheduler. Accordingly, it is necessary to provide configuration data related to compilers, compute machines, and scheduler configuration.

A great place -- in addition to this site, to get started is the CESM Quickstart Guide:
  [https://escomp.github.io/CESM/versions/master/html/index.html#](https://escomp.github.io/CESM/versions/master/html/index.html#)

## Downloading CESM2
The best way to download CESM2 is to clone the git repository. As per the Quickstart Guide:
  [https://escomp.github.io/CESM/versions/master/html/downloading_cesm.html](https://escomp.github.io/CESM/versions/master/html/downloading_cesm.html)
  
  Note these steps will require `git` and `subversion` version control systems. On Sherlock, `git` is available by default; newer versions of `git` and `subversion` are available via the module system, eg:
  
```
module load git/
module load subversion/
```

```
git clone https://github.com/ESCOMP/CESM.git my_cesm_sandbox
cd my_cesm_sandbox
```

Optionally, check out a branch or previous version, eg:

```
git tag --list 'release-cesm2*'
git checkout release-cesm2.0.1
```

Then, check out the model components (note, this step requires `subversion`):
```
./manage_externals/checkout_externals
```


## Configuration files
The three main configuration files are:
- `config_batch.xml`
- `config_compilers.xml`
- `config_machines.xml`

These files are located in _*both*_:
- `${CESM_PATH}/cime/config/cesm/machines/`
- `${HOME}/.cime`

Where `CESM_PATH` is the directory into which you cloned the CESM2 repository in the earlier step, and `$HOME` is your home directory, and of course it may be necesssary to create the `${HOME}/.cime` directory and the configureation files within. 

Some documentaiton will suggest that CESM2 can be configured by modifying either set of files It will most likely be quickly discovered however, that it is a better practice to leave the files in `${CESM_PATH}/cime/config/cesm/machines/` untouched and defining local machines, batch system(s), and compilers in the `~/.cime` location.

Configurations should be hierarchical, so for example the compiler configuration `<complier COMPILER="gnu">`, in the `.../machines` path, defines all of the `gnu` compiler flags -- as they are required by CESM2, in general. A refined compiler definition can be written in `~/.cime/config_compilers.xml`. For example, `<compiler COMPILER="gnu" MACH="CBASE">` defines additional configurations for the `gnu` compiler on a `CBASE` type machine, where `MACH` should correspond to a machine defined in `config_machines.xml`. Note that the machine names, and various other meta-data elements, are user defined -- which gives the user some discreation, with respect to CESM2 configuraiton. Of course, this discretion comes somewhat at the expense of guidance.

Here, we leave completely alone the `.../machines` configuration files and provide working example configuration files, for Stanford Research Computing's Sherlock HPC platform. Note that there are numerous ways to accomplish the same task, so these examples might not be optimized. For example, in the `_comnpilers` example, we define our MPI flags in the `<CFLAGS>` section, where CESM2 might actually be capable of parsing MPI (and other) options more directly -- see the example in the comments of that file.

### config_compilers.xml
```
<?xml version="1.0" encoding="UTF-8"?>
<!-- Some options examples:
<MPI_LIB_NAME MPILIB="mvapich2"> mpich</MPI_LIB_NAME>
<SLIBS>
  <append MPILIB="mvapich2"> -mkl=cluster </append>
</SLIBS>
# So NOTE: I think we handle MPI via pkg-config. Also maybe we just support mpich for now. we can do this by creating just one
#  hierarchical entry. If we want to support multiple MPI, we have to either have multiple machines (serc_cbase_{mpi})
#  or multiple full COMPIELR entries.
-->
<config_compilers version="2.0">

        <compiler>
                <CPPDEFS>
                  <append>-DHAVE_IEEE_ARITHMETIC</append>
                  <append>-DCPRGNU</append>
                </CPPDEFS>
        </compiler>

        <compiler COMPILER="gnu" MACH="CBASE">
                <MPIFC> mpifort </MPIFC>
                <MPICC> mpicc </MPICC>
                <MPICXX> mpicxx </MPICXX>
                <SCC> gcc </SCC>
                <SCXX> g++ </SCXX>
                <SFC> gfortran </SFC>
                <CFLAGS>
                        <append> -fPIC </append>
                        <append>$SHELL{nc-config --cflags}</append>
                        <append>$SHELL{nf-config --cflags}</append>
                        <append MPILIB="mpich">$SHELL{pkg-config --cflags mpich}</append>
                        <append MPILIB="mpich_monkey"> $SHELL(pkg-config --cflags $SHELL(dirname $SHELL(dirname $MPICC))/lib/pkgconfig/mpich.pc)</append>
                </CFLAGS>
                <FFLAGS>
                        <append>-fallow-argument-mismatch</append>
                        <append>-fallow-invalid-boz</append>
                        <append>-fPIC</append>
                        <append>$SHELL{nf-config --fflags}</append>
                        <append>-I$ENV{PARALLELIO_INC}</append>
                        <append>-ffree-line-length-none</append>
                        <append>-fcray-pointer</append>
                </FFLAGS>
                <CXX_LDFLAGS>
                        <append>$SHELL{nc-config --cflags}</append>
                </CXX_LDFLAGS>
                <NETCDF_C_PATH>$SHELL{nc-config --prefix}</NETCDF_C_PATH>
                <NETCDF_FORTRAN_PATH>$SHELL{nf-config --prefix}</NETCDF_FORTRAN_PATH>
                <SLIBS>
                  <append>-L$ENV{GPTL_LIB} -lgptl</append>
                  <append>$SHELL{nf-config --flibs}</append>
                  <append>$SHELL{nc-config --libs}</append>
                  <append>-L$ENV{NETLIB_LAPACK_LIB64} -lblas -llapack </append>
                  <append MPILIB="mpich"> $SHELL{pkg-config --libs mpich}</append>
                </SLIBS>
        </compiler>

<compiler MACH="CBASE_DEV" COMPILER="gnu_dev">
                <MPIFC> mpifort </MPIFC>
                <MPICC> mpicc </MPICC>
                <MPICXX> mpicxx </MPICXX>
                <SCC> gcc </SCC>
                <SCXX> g++ </SCXX>
                <SFC> gfortran </SFC>
                <CFLAGS>
                        <append> -fPIC </append>
                        <append> $SHELL{nc-config --cflags}</append>
                        <append> $SHELL{nf-config --cflags}</append>
                        <append MPILIB="mpich_monkey"> $(shell pkg-config --cflags $(shell dirname $(shell dirname $MPICC))/lib/pkgconfig/mpich.pc)</append>
                </CFLAGS>
                <FFLAGS>
                        <append>-fallow-argument-mismatch</append>
                        <append> -fallow-invalid-boz </append>
                        <append>-fPIC</append>
                        <append>$SHELL{nf-config --fflags}</append>
                </FFLAGS>
                <CXX_LDFLAGS>
                        <append> $SHELL{nc-config --cxx4flags} </append>
                </CXX_LDFLAGS>
                <NETCDF_C_PATH> $SHELL{nc-config --prefix} </NETCDF_C_PATH>
                <NETCDF_FORTRAN_PATH> $SHELL{nf-config --prefix} </NETCDF_FORTRAN_PATH>
                <SLIBS>
                  <append> $SHELL{nf-config --flibs} </append>
                  <append> $SHELL{nc-config --libs} </append>
                  <append MPILIB="mpich_monkey"> $(shell pkg-config --libs $(shell dirname $(shell dirname $MPICC))/lib/pkgconfig/mpich.pc) </append>
                  <append MPILIB="mpich2"> $(shell pkg-config --libs $(shell dirname $(shell dirname $(which mpicc)))/lib/pkgconfig/mpich.pc) </append>
                  <append MPILIB="mpich"> $SHELL{pkg-config --libs mpich}  </append>
                </SLIBS>
        </compiler>

</config_compilers>
```

### config_machines.xml
```
<?xml version="1.0"?>

<config_machines version="2.0">
  <machine MACH="CBASE">
    <DESC>Stanford Sherlock SH3_CBASE</DESC>
    <OS>LINUX</OS>
    <COMPILERS>gnu</COMPILERS>
    <MPILIBS compiler="gnu" >mpich</MPILIBS>
    <CIME_OUTPUT_ROOT>$ENV{SCRATCH}/CESM2/cases</CIME_OUTPUT_ROOT>
    <DIN_LOC_ROOT>$ENV{SCRATCH}/CESM2/cesm_input_data/data</DIN_LOC_ROOT>
    <DIN_LOC_ROOT_CLMFORC>$ENV{SCRATCH}/CESM2/cesm_input_data/data_clmforc</DIN_LOC_ROOT_CLMFORC>
    <DOUT_S_ROOT>$ENV{SCRATCH}/archive/$CASE</DOUT_S_ROOT>
    <BASELINE_ROOT>$ENV{GROUP_HOME}/yoder/archive/cesm_input_data/cesm_baselines</BASELINE_ROOT>
    <CCSM_CPRNC>$ENV{SCRATCH}/CESM2/cesm_input_data/cprnc</CCSM_CPRNC>
    <GMAKE_J>8</GMAKE_J>
    <BATCH_SYSTEM>slurm</BATCH_SYSTEM>
    <SUPPORTED_BY>sherlock</SUPPORTED_BY>
    <MAX_TASKS_PER_NODE>32</MAX_TASKS_PER_NODE>
    <MAX_MPITASKS_PER_NODE>32</MAX_MPITASKS_PER_NODE>
    <mpirun mpilib="default">
      <executable>srun</executable>
    </mpirun>
    <module_system type="module" allow_error="true">
      <init_path lang="perl">$LMOD_ROOT/lmod/init/perl</init_path>
      <init_path lang="python">$LMOD_ROOT/lmod/init/env_modules_python.py</init_path>
      <init_path lang="sh">$LMOD_ROOT/lmod/init/sh</init_path>
      <init_path lang="csh">$LMOD_ROOT/lmod/init/csh</init_path>
      <cmd_path lang="perl">$LMOD_ROOT/8.7.30/libexec/lmod perl</cmd_path>
      <cmd_path lang="python">$LMOD_ROOT/8.7.30/libexec/lmod python</cmd_path>
      <cmd_path lang="sh">module</cmd_path>
      <cmd_path lang="csh">module</cmd_path>
    </module_system>
    <environment_variables>
      <env name="OMP_STACKSIZE">64M</env>
    </environment_variables>
  </machine>

  <machine MACH="SH02">
    <DESC>Stanford Sherloherlock SH02</DESC>
    <OS>LINUX</OS>
    <COMPILERS>gnu</COMPILERS>
    <MPILIBS compiler="gnu" >mpich</MPILIBS>
    <CIME_OUTPUT_ROOT>$ENV{SCRATCH}/CESM2/cases</CIME_OUTPUT_ROOT>
    <DIN_LOC_ROOT>$ENV{SCRATCH}/CESM2/cesm_input_data/data</DIN_LOC_ROOT>
    <DIN_LOC_ROOT_CLMFORC>$ENV{SCRATCH}/CESM2/cesm_input_data/data_clmforc</DIN_LOC_ROOT_CLMFORC>
    <DOUT_S_ROOT>$ENV{SCRATCH}/archive/$CASE</DOUT_S_ROOT>
    <BASELINE_ROOT>$ENV{GROUP_HOME}/archive/cesm_input_data/cesm_baselines</BASELINE_ROOT>
    <CCSM_CPRNC>$ENV{SCRATCH}/CESM2/cesm_input_data/cprnc</CCSM_CPRNC>
    <GMAKE_J>8</GMAKE_J>
    <BATCH_SYSTEM>slurm</BATCH_SYSTEM>
    <SUPPORTED_BY>sherlock</SUPPORTED_BY>
    <MAX_TASKS_PER_NODE>24</MAX_TASKS_PER_NODE>
    <MAX_MPITASKS_PER_NODE>24</MAX_MPITASKS_PER_NODE>
    <mpirun mpilib="default">
      <executable>srun</executable>
    </mpirun>
    <module_system type="module" allow_error="true">
      <init_path lang="perl">$LMOD_ROOT/lmod/init/perl</init_path>
      <init_path lang="python">$LMOD_ROOT/lmod/init/env_modules_python.py</init_path>
      <init_path lang="sh">$LMOD_ROOT/lmod/init/sh</init_path>
      <init_path lang="csh">$LMOD_ROOT/lmod/init/csh</init_path>
      <cmd_path lang="perl">$LMOD_ROOT/8.7.30/libexec/lmod perl</cmd_path>
      <cmd_path lang="python">$LMOD_ROOT/8.7.30/libexec/lmod python</cmd_path>
      <cmd_path lang="sh">module</cmd_path>
      <cmd_path lang="csh">module</cmd_path>
    </module_system>
    <environment_variables>
      <env name="OMP_STACKSIZE">64M</env>
    </environment_variables>
  </machine>

</config_machines>  
```

### config_batch.xml

```
<?xml version="1.0"?>
<config_batch version="2.1">
  <batch_system type="template" >
    <batch_query args=""></batch_query>
    <batch_submit></batch_submit>
    <batch_redirect></batch_redirect>
    <batch_directive></batch_directive>
    <directives>
      <directive></directive>
    </directives>
  </batch_system>
<!-- -->
<!-- augment default SLURM: -->
<!--  Eventually... use this job construction, so we don't have to wait for a full node? -->
<!-- but to do this, we'll want to construct a different config_machines entry as well. -->
<batch_system type="slurm" >
  <batch_submit>sbatch</batch_submit>
  <batch_cancel>scancel</batch_cancel>
  <batch_directive>#SBATCH</batch_directive>
  <jobid_pattern>(\d+)$</jobid_pattern>
  <depend_string> --dependency=afterok:jobid</depend_string>
  <depend_allow_string> --dependency=afterany:jobid</depend_allow_string>
  <depend_separator>,</depend_separator>
  <walltime_format>%H:%M:%S</walltime_format>
  <batch_mail_flag>--mail-user</batch_mail_flag>
  <batch_mail_type_flag>--mail-type</batch_mail_type_flag>
  <batch_mail_type>none, all, begin, end, fail</batch_mail_type>
  <directives>
    <directive> --job-name=CESM_{{ job_id }} </directive>
    <directive> --ntasks={{ total_tasks }} </directive>
    <directive> --output=CESM_{{ job_id }} </directive>
    <directive> --error=CESM_{{ job_id }} </directive>
  </directives>
</batch_system>

  <batch_system MACH="CBASE" type="slurm">
    <directives>
      <directive> --constraint="[CLASS:SH3_CBASE|CLASS:SH3_CBASE.1]"</directive>
    </directives>
    <!--<walltime_format>%H:%M:%S</walltime_format>-->
    <queues>
        <queue walltimemax="168:00:00" nodemin="1" nodemax="500" default="true">serc</queue>
        <!--<queue walltimemax="7-00:00:00" default="true">serc</queue>-->
        <queue walltimemax="24:00:00">normal</queue>
        <queue walltimemax="24:00:00">owners</queue>
    </queues>
  </batch_system>

  <batch_system MACH="SERC" type="slurm">
    <directives>
      <directive> --constraint="[CLASS:SH3_CBASE|CLASS:SH3_CBASE.1|CLASS:SH3_CPERF|CPU_GEN:SKX]"</directive>
    </directives>
    <!--<walltime_format>%H:%M:%S</walltime_format>-->
    <queues>
        <queue walltimemax="168:00:00" nodemin="1" nodemax="500" default="true">serc</queue>
        <!--<queue walltimemax="7-00:00:00" default="true">serc</queue>-->
        <queue walltimemax="24:00:00">normal</queue>
        <queue walltimemax="24:00:00">owners</queue>
    </queues>
  </batch_system>

  <batch_system MACH="CPERF" type="slurm">
    <directives>
        <directive> --job-name=CESM_{{ job_id }} </directive>
        <directive> --ntasks={{ total_tasks }} </directive>
        <directive> --output=CESM_{{ job_id }} </directive>
        <directive> --error=CESM_{{ job_id }} </directive>
        <directive> --constraint=CLASS:SH3_CPERF</directive>
    </directives>
    <queues>
        <queue walltimemax="7-00:00:00" default="true">serc</queue>
        <queue walltimemax="24:00:00">normal</queue>
        <queue walltimemax="24:00:00">owners</queue>
    </queues>
  </batch_system>

  </config_batch>


```

# CESM2: Dependencies
Most large codes are dependent on several (mostly) standard packages. CESM2 is no exception. In fact, CESM2's dependencies are numerous and somewhat difficult to compile. Here, we review the basic dependencies, an an environment available to SDSS users via the `module` system, and how to use the Spack package manager to build an environment.

## Overview
The basic dependencies for CESM2 include:
- MPI (some implementation...)
- NetCDF-c and NetCDF-fortran
- HDF5 (should bundle with NetCDF)
- Others?

## Sherlock module
A module, accessible to SDSS students, is available on the Sherlock HPC platform. To use this module,

```
module use /home/groups/sh_s-dss/share/sdss/modules/modulefiles/
module load cesm2/
```

This should load all of the compilers, MPI libraries, and other dependencies necessary to compile and run CESM2 projects.

## Build your own
Good luck with this.

The typical problem with dependencies is that only a few might be recognized by a developer, because certain dependencies are available by default (eg, can be found in `/usr/lib`), or because some components bundle semi-automatically -- for example, NetCDF requires HDF5. The standard approach, then, is:
1. Attempt to compile
2. Scroll up error messges to find the first error
3. Identify the missing component
4. Compile the missign component
5. Repeat

Not that this may be a nested process, several layers deep.

Note additionally that any Fortran codes will require a highly consisten SW stack. this is to say that (almost) all of the components will need to be compiled with the same version of the same compiler. As such, it can be difficult to cobble together a long list of dependencies from some HPC software `module` kits.

There are a lot of good reasons to manually build these dependencies on your own, but be prepared to put in some time. Be patient; be methodical. Alternatively, consider using a aid, like Spack, to map out and compile dependencies.

# Spack
## What is Spack?
Spack is a software package manager designed for scientific and high performance computing (HPC). Spack can be extremely helpful when working with complex dependency graphs. Software "recipes" are written, in Python, for individual software packages. These recipes define dependencies, compiler flags, patches, and other data in a way that Spack's solver can produce a graph of dependent software packages and a script to install one or more packages. In short Spack is magic -- or at least close to it.

 There are four basic approaches to provide a software package via spack:
1. As part of a large, general purpose SW stack, where a package recipe exists
2. As a small, package specific environmewnt and SW stack, where a package recipe exists
3. Build an environment that satisfies the package's dependencies; then compile the SW manually
4. Write a spack recipe to satisfy the dependencies and/or package itself.

Spack currently does not have a package recipe for CESM2, so 1 and 2 are not options. Additionally, the CESM2 workflow is not really compatible with those options. We focus on the latter two options -- one way or another to build an enviornment that will support CESM2's compile scripts.

## CESM2 Spack environment

## CESM2 Spack package

