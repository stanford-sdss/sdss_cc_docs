---
title: Requesting 40GB GPUs with SLURM Constraints
---

# Requesting 40GB GPUs with SLURM Constraints

The `serc` partition has GPUs with different amounts of memory (vRAM). Our [Community Guidelines](../community-guidelines.md) ask that you **request the 40GB GPUs when possible**. That way the larger 80GB GPUs stay free for jobs that really need them. This tutorial shows you how to do that with the SLURM `--constraint` option.

## What is a constraint?

Every node on Sherlock has a set of *features*: labels that describe its hardware, such as CPU type, GPU model, and GPU memory. The `--constraint` option tells SLURM to run your job only on nodes that have a certain feature.

The GPU memory feature is called `GPU_MEM`. To ask for 40GB GPUs, add:

```bash
--constraint="GPU_MEM:40GB"
```

## Step 1: See which GPU features are available

To list the features of the `serc` nodes, run this on a Sherlock login node:

```bash
$ sh_node_feat -p serc | grep GPU_MEM
GPU_MEM:32GB
GPU_MEM:40GB
GPU_MEM:80GB
```

Your output might be a little different as hardware is added or retired.

## Step 2: Add the constraint to your job

### Batch jobs (`sbatch`)

Add a `#SBATCH --constraint` line to your job script:

```bash
#!/bin/bash
#SBATCH --job-name=my_gpu_job
#SBATCH --partition=serc
#SBATCH --ntasks=1
#SBATCH --gpus=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=64G
#SBATCH --time=12:00:00
#SBATCH --constraint="GPU_MEM:40GB"

# load your software, then run your code
python train.py
```

You can also add the constraint on the command line without changing the script:

```bash
$ sbatch --constraint="GPU_MEM:40GB" my_job.sh
```

### Interactive sessions (`salloc` / `srun`)

```bash
$ salloc --partition=serc --gpus=1 --cpus-per-task=8 --time=2:00:00 --constraint="GPU_MEM:40GB"
```

or

```bash
$ srun --partition=serc --gpus=1 --cpus-per-task=8 --time=2:00:00 --constraint="GPU_MEM:40GB" --pty bash
```

:::{tip}
For multi-GPU jobs, keep `--ntasks=1` unless your code is built to run across multiple nodes (e.g., with MPI). If you leave it out, SLURM may spread your GPUs across several nodes, and most frameworks can only use the GPUs on a single node.
:::

## Step 3: Check that you got a 40GB GPU

Once your job starts, run this on the compute node:

```bash
$ nvidia-smi --query-gpu=name,memory.total --format=csv
name, memory.total [MiB]
NVIDIA A100-SXM4-40GB, 40960 MiB
```

To see which constraint a pending or running job asked for, run:

```bash
$ squeue -u $USER -o "%.10i %.20j %.8T %.25f"
```

The last column (`%f`) shows the features the job requested.

## Is 40GB enough for my job?

Many jobs fit in 40GB, including most inference, fine-tuning of small and medium models, and lots of scientific GPU codes. Here are a few ways to check:

- **Watch memory use while your job runs.** In an interactive session, run `nvidia-smi` (or `watch -n 5 nvidia-smi`) to see how much memory your process uses.
- **Check peak usage from inside PyTorch:**

  ```python
  import torch
  # ... run a training step or a representative workload ...
  print(f"Peak GPU memory: {torch.cuda.max_memory_allocated() / 1e9:.1f} GB")
  ```

- **Reduce memory use** if you are just over the limit. Common options are a smaller batch size, mixed precision (`bf16`/`fp16`), gradient checkpointing, or splitting the work across two 40GB GPUs.

If your job really needs more than 40GB on a single GPU, request the larger GPUs instead:

```bash
--constraint="GPU_MEM:80GB"
```

## Quick reference

| Goal | Option |
| --- | --- |
| 40GB GPUs (recommended default) | `--constraint="GPU_MEM:40GB"` |
| 80GB GPUs (only when needed) | `--constraint="GPU_MEM:80GB"` |
| List available GPU features | `sh_node_feat -p serc \| grep GPU` |
| Check your GPU's memory | `nvidia-smi --query-gpu=name,memory.total --format=csv` |

For more on hardware constraints, see [SLURM basics](../reference/sherlock/slurm-basics.md) and [SERC resources](../reference/sherlock/serc-resources.md).
