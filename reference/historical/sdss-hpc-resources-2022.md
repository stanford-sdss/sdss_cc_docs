---

title: SDSS Compute Resources

---

# SDSS-CC HPC Resources

## Facilities
The Stanford Doerr School for Sustainability Center for Computation (SDSS-CC) provides high performance computational resources to researchers in the school through a shared facility model. These resources include a shared SDSS partition on Stanford Research Computing’s (SRC) Sherlock HPC cluster (www.sherlock.stanford.edu), Cloud based computing -- principally Google Cloud Platform (GCP), and data sharing and archiving agreements with the Stanford Library and Redivis.

## Sherlock HPC
SDSS's Sherlock partition includes the following resources (as of September 2022):

- 200 x 32 core CPU nodes (AMD Epyc 7502), 256 GB RAM
- 8 x 128 core CPU nodes (AMD Epyc 7742), 1024 GB RAM
- 24 x 24 core CPU nodes (Intel Skylake), 192/384 GB RAM
- 10 x 8 NVIDIA Tesla A100 GPUs, 128 CPU cores (AMD Epyc 7662), 1024 GB RAM
- 2 x 4 NVIDIA Tesla V100 GPUs, 24 CPU cores (Intel Skylake), 192GB RAM

SDSS researchers can also submit to Sherlock’s public partitions (approximately 5,000 CPU cores, 100 GPU devices, and including compute nodes with up to 4TB RAM), as well as the preemptable owners partition (approximately 39,000 CPU cores and 300 GPUs).

Sherlock compute nodes are interconnected via a high performance, low latency _Infiniband_ network, which facilitates excellent performance for large MPI and other multi-node protocol jobs.

Jobs submitted to Sherlock are prioritized by a user-level fair-share policy to ensure equitable access and usage by all researchers. Sherlock also uses “back fill” to run small jobs, independent of fair-share, so long as resources are available.

### Use Agreement and Job Limits on SERC
Ironically, because the SERC partition is (typically) not over-subscribed -- resources are relativey plentiful, excess usage is not well governed by Sherlock's _FairShare_ job prioritization algorithm. We ask that individuals volunarily restrict their workloads, in order to respect our friends' and colleagues' rights to use this shared resource. Generally, we ask that jobs comply with the following guidelines:
- 300-500 concurrent CPUs for smaller/shorter - bigger/longer-running jobs
- Concurrent GPUs policy is not well defined; please be considerate courteous
- Generaly, jobs shoud use resources efficiently. SERC machines typically have `8GB RAM per CPU` and `128 GB RAM perGPU`. Jobs that use significantly more memory than those ratios effectively render valuable resources unavailable. Similarly, jobs that use more CPUs than will parallelize efficiently impeed others' access to those resources.
- For larger, resource intensive jobs, please reach out to SDSS-CC and SRCC support

## GCP
SDSS provides additional support through an HPC cluster hosted in Google Cloud (GCP-HPC). This GCP-HPC cluster can scale -- both in size and configuration, to meet the specific requirements of a given project. SDSS also provides "one off" GCP solutions for projects where Sherlock or other conventiaonl resources are not practical.


## Oak Storage
SDSS provides high performance and fault tolerant data storage that includes data protection. SDSS maintains approximately 2.25PB of space, available to research groups, on SRC’s _Oak_ LUSTRE storage platform. Data backup services are available either on site or on cloud – principally Google (GCP) computing services.

## Data Sharing
To satisfy -- and often exceed, most data sharing and archiving requirements, SDSS maintains close working relationships with Stanford Library's _Digital Repository_ (SDR) and _Redivis_. SDR principally hosts "finished" data sets -- eg, from published papers; _Redivis_ can provide a much more dynamic environment for "living" data sets. Data hosted on _Redivis_ can also be easily convolved or cross-queried with numerous other data sets hosted on the platform. The precise capabilities of these platforms is rapidly evolving, often in direct response to interests and requirements proposed by SDSS and other Stanford research teams.


## Support
SDSS also provides computational staff support. This includes system administrators for the SDSS partition on Sherlock as well as 1.5 FTE staff members who help users with software installations, workflow development, and advice on optimal use of the computing resources.
