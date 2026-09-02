---
title: Choosing a Storage Space on Sherlock
---

# Choosing a Storage Space on Sherlock

Sherlock offers several different storage spaces, each with different capacity, speed, and retention tradeoffs. Picking the right one can make a big difference in how fast your data-heavy pipelines run. This tutorial walks through the available options and how to choose between them.

## The Storage Space Zoo

Sherlock's available storage options are:

| Space | Capacity | Notes |
| --- | --- | --- |
| `$HOME` | 15GB | Private to your user. Be careful not to fill it! |
| `$GROUP_HOME` | 1TB | Shared space for your group |
| `$OAK` | "Cheap and deep" | For large files and backups |
| `$SCRATCH` | 100TB per user | Purges files older than 90 days |
| `$GROUP_SCRATCH` | 100TB shared | Purges files older than 90 days |
| `$L_SCRATCH` | 100s of GB to a few TB | Local to the active compute node. Deletes when the job ends |

## An Analogy: HPC as Cooking

It can help to think about these spaces the way you'd think about storing and preparing food:

- **External repos, Elm** — the grocery store. Slow storage for large files.
- **Oak** — your home fridge. A place to hold files at home.
- **`$HOME`, `$GROUP_HOME`** — small spaces for casual, everyday work.
- **`$SCRATCH`, `$L_SCRATCH`** — the stovetop. As close to the compute as possible.

## How Do I Choose Which Space Is Right for Me?

You'll likely need to use more than one of these spaces together. A few questions can help you decide:

1. **What is your dataset size?**
   - Small (a few GBs) → `$HOME`
   - Medium (dozens of GBs) → `$GROUP_HOME`
   - Large (TBs) → keep going
2. **Is long-term storage needed?**
   - Yes → `$OAK`
   - No → keep going
3. **Do you have large files, or many small files?**
   - Large files → `$OAK`
   - Many small files → keep going
4. **Do you need to share these files with others?**
   - Yes → `$GROUP_SCRATCH`
   - No → keep going
5. **Do you need ultra-low latency?**
   - Yes → `$L_SCRATCH`
   - No → `$SCRATCH`

## Use Case 1: One Large File

**Example:** machine learning with the MOSAIKS dataset — a 4.7TB single-file table of satellite image encodings (4,005 columns, 146M rows), sourced from Redivis. Training requires reading the file into memory and distributing the workload across many CPUs or nodes.

**Storage solutions:**
- **Code files:** a permanent, shared location like `$GROUP_HOME` or `$OAK`
- **Data files:** temporary large storage on `$SCRATCH` or `$GROUP_SCRATCH`. If you'll need the data for more than 90 days, or re-pulling it is a hassle, use `$OAK` instead.

## Use Case 2: Many Small Files

**Example:** an AI pipeline using pre-tiled Landsat imagery — 9.8TB spread across roughly 105,000 files of about 100MB each. The pipeline runs in Python on GPUs with PyTorch and CUDA, and every file needs to be transferred into CPU memory before being loaded and unloaded from the GPU in batches.

**Storage solutions:**
- **Code files:** a permanent, shared location like `$GROUP_HOME` or `$OAK`
- **Data files:** work from `$SCRATCH` or `$L_SCRATCH`. I/O from `$OAK` on 100K files will slow you down. Use `$OAK` only for final product backups and project checkpoints.

## Getting Help

- **Slack Community:** Join **#sdss-compute-users** to ask questions and share tips with the community.
- **Email Support:** [sdss-compute@stanford.edu](mailto:sdss-compute@stanford.edu)
- **Book a Consultation:** Schedule a one-on-one consultation at [sdss-compute-consultations.stanford.edu](https://sdss-compute-consultations.stanford.edu).
