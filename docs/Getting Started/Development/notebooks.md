# Notebooks

This document explains how to install optional dependencies used by the project's Jupyter notebooks and how to run them.

Install notebook dependencies:

```bash
cd notebooks
pip3 install -r requirements.txt
```

Running notebooks inside the devcontainer:

1. Open the workspace in the devcontainer (see `docs/Getting Started/README.md` Step 3).
2. From VS Code, open the `notebooks/` folder and open the desired `.ipynb` file.
3. Use the Jupyter extension to run cells interactively.

Running notebooks on host (optional):

```bash
pip3 install jupyterlab
cd notebooks
jupyter lab
```

Notes:

- Notebooks may rely on specific packages listed in `notebooks/requirements.txt`.
- If you run heavy training workloads, consider using a machine with a GPU or smaller sample datasets.
