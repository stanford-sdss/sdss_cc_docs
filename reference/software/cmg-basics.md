---
title: CMG Basics
---

# CMG Basics
Computer Modeling Group Ltd (CMG) ([cmgl.ca](https://www.cmgl.ca/), also see [Wikipedia](https://en.wikipedia.org/wiki/Computer_Modelling_Group)) produces a suite of proprietary physics based simulators popular in a variety of Earth and other physical sciences. Simulators include:
- GEM
- IMEX
- STARS	

In this document, we compile some basic "how to" cases, descriptions of run-time parameters, discussions of environment variables, and general run-time syntax.

### CMG on Sherlock
Multiple versions of CMG are installed as part of the SERC software stack on Sherlock. To enable the SW stack, execute the following setup scritp -- either at runtime or as part of your `.bashrc`:

```
module use /home/groups/sh_s-dss/share/sdss/modules/modulefiles
```

then load the CMG module with some LMOD consistent variant of:

```
module load CMG/
```

### Executables and directory structure
The directory structure for CMG models is somewhat non-standard in HPC environments, but logical enough. For linux, the executables (binaries) are located in folders like,  

```
${CMG_PATH}/{simulator}/{version}/linux_x64/exe/ 
```

So for the 2023 version of GEM,

```
${CMG_PATH}/gem/2023.10/linux_x64/exe/ 
```

These paths are configured in the module definition file:
```
[myoder96@sh03-09n72 ] (job 31521159) $ module show CMG
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   /home/groups/sh_s-dss/share/sdss/modules/modulefiles/CMG/2023.101.lua:
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
whatis("CMG - gem, imex, stars. br, launcher, rlmsecure should also be supported")
pushenv("CMG_HOME","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101")
pushenv("CMG_LIC_HOST","27053@srcc-license-srcf.stanford.edu:27053")
pushenv("CMG_FAILOVER_HOSTS","27053@srcc-license-srcf.stanford.edu:27053")
pushenv("CMG_VER","2023.10")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/dicts")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/gem/2023.10/linux_x64/exe")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/imex/2023.10/linux_x64/exe")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/stars/2023.10/linux_x64/exe")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/br/2023.10/linux_x64/exe")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/launcher/2023.10/linux_x64/exe")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/rlmsecure")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/rlmsecure/linux_x64")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/CEIPServer/linux_x64/exe")
prepend_path("PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/sdss_bin")
prepend_path("LD_LIBRARY_PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/imex/2023.10/linux_x64/lib")
prepend_path("LD_LIBRARY_PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/stars/2023.10/linux_x64/lib")
prepend_path("LD_LIBRARY_PATH","/home/groups/sh_s-dss/share/sdss/software/x86_64_arch/CMG/2023.101/CEIPServer/linux_x64/exe/lib")
```

### Execution signature and runtime parameters:
The necessary paths to executable and linking libraries are defined by the module definition. GEM can be run interactively using the full path, for example
```
${CMG_HOME}/gem/2023.10/linux_x64/exe/
```

or just (because the path is defined),

```
gm202310.exe
```

Note that the latter syntax is prefered, since the sysadmin will likely modify the specific installation directory.

GEM will then request an input file and write output using a default naming cvonvention. Alternatively, the input file and output  format can be specified -- as will be necessary for batch scripts. For example, to define the simulation from a file `input.dat`, and output to files like `my_output.*`,

```
gm201810.exe -f input.dat -o my_output 

```

As it happens, CMG provides some test data sets. You can test CMG with the test script:

```
cmg_test.sh ${SCRATCH}/cmg_workdir
```

Where the working directory parameter, `${SCRATCH}/cmg_workdir` is optional (a default value will be used if the pamameter is not provided).

#### Runtime parameters
- `-f {input_file_path}`: full path and file name of input data file (usually ends in `.dat`)
- `-o {file_path_root}`:  Output files will be `file_path_root.irf, .mrf, .out, .rst, .sr3` .
- `-parasol {n_cores}`: "Parallel solutions"
- `-solverg`: Something to do with parallelization? It is mentioned as a keyword along with parasol
- `-combinative` : A combinative solver, pre-conditioner. Supposed to reduce the required number of solver iterations. Can it be used in combination with parasol?
- `-htuse` : Use hyperthreads. This is not recommended. Testing has shown that hyperthreads degrade performance.

#### Environment varialbes:
These variables affect how parallelization is handled. Different setting might be optimal for various runtime scenarios. Some pertinent issues:
1. How many cores, processors, nodes
2. Are multiple CMG jobs running on the same machine
3. With or with out a job scheduler? Aka, are the jobs competing for resources?

Some environmebnt variables include:
- KMP_AFFINITY: Controls allocation of job components onto processors
	- `KMP_AFFINITY=compact,0` : Allocates load to as few processors as possible; cores can share memory. Recommended for HPC 
	- `KMP_AFFINITY=compact,1` : Allocates load to as many processors as possible. Increases cross-talk between cores/processors, but might make more efficient use of memory in some cases, or can be optimal for processors that can run on boosted clock speeds.
	- To run multiple simulations on one node without a scheduler, do not set this variable.
- OMP_SCHEDULE : OpenMP threads parameter (aka, how many OpenMP threads to use)
	-  Typically: 
		`OMP_SCHEDULE=static,1 gm201810.exe -f TC12_GEM_500Grid_106_C_2800_psi_VM4.dat -o my_output -parasol 4`
