# Read Me for Dev Purposes

This repo is following [Jupyter Book 2](https://jupyterbook.org/) Style Guidelines. 

Style instructions for adding new content is [here](https://jupyterbook.org/stable/get-started/create-content/), and `.md`, `.ipynb`, and `.tex` files are all supported. It is recommended to add new content in [MyST Markdown](https://mystmd.org/) which supports extending markdown for academic-style publishing and documentation.

# How to Edit + Deploy

This page is currently (8/13/2026) setup to deploy automatically to Github Pages (https://stanford-sdss.github.io/sdss_cc_docs/). 

To edit an existing page, simply edit the markdown file, and commit.  You can check the Github actions to see the status of the deployment.

To create a new page, you'll need to create a new markdown file.  If you'd like your page to appear in the sidebar, you'll need to add it to the `toc` section of `myst.yml`
