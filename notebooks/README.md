# Running the python scripts
This notebook is used to run the python scripts in this repository. It is mainly used for testing and debugging purposes.
It is not meant to be used as a final product.

These notebooks assume you have python 3.12 installed on your system. You can download it from [here](https://www.python.org/downloads/release/python-3120/).

## Make a virtual environment
To make sure all dependencies are installed correctly, it is recommended to use a virtual environment. You can create a virtual environment in windows by running the following command in the terminal:
```
py -3.12 -m venv .\.venv
```

## Activate the virtual environment
To activate the virtual environment, run the following command in the terminal:
```
.\.venv\Scripts\activate
```
## Install the dependencies
To install the dependencies, run the following command in the terminal:
```
pip install -r requirements.txt
```
## Run the scripts
To run the scripts, you can use the following command in the terminal:
```
py -3.12 <script_name>.py
```

## LakeFS and Minio setup
Our LakeFS endpoint is: `http://100.97.85.39:8000` and the Minio endpoint is: `http://100.97.85.39:9001`.

To create a Minio bucket on the server, you need to have the Minio client installed. You can download it from [here](https://min.io/docs/minio/linux/reference/minio-mc.html).

Create a Minio bucket in the CLI with the following command:
```
# Download the Minio client
iwr https://dl.min.io/client/mc/release/windows-amd64/mc.exe -OutFile $env:USERPROFILE\mc.exe

# Add the Minio client to the PATH environment variable
$env:PATH += ";" + $env:USERPROFILE

# Verify the installation
mc.exe --version
```
Then, configure the Minio client with and alias, the access key and the secret key:
```
mc.exe alias set myminio http://100.97.85.39:9000 <access_key> <secret_key>
```
We want to version control the Minio bucket with LakeFS. Therefore, we need to create a LakeFS repository that is connected to the Minio bucket. To do this, you need to have the LakeFS CLI installed. You can download it from [here](https://github.com/treeverse/lakeFS/releases), or run the following command in powershell:
```
# Download the LakeFS CLI
$zip = "$env:TEMP\lakectl_windows_amd64.zip"
iwr https://github.com/treeverse/lakeFS/releases/download/v1.70.1/lakeFS_1.70.1_Windows_x86_64.zip -OutFile $zip

# Unzip the LakeFS CLI to the user's bin directory
$dst = "$env:USERPROFILE\bin\lakectl"
mkdir $dst -Force | Out-Null
Expand-Archive $zip -DestinationPath $dst -Force

# Add the user's bin directory to the PATH environment variable
$env:Path = "$env:Path;$dst"
setx PATH "$($env:Path)"

# Verify the installation
lakectl --version

# Configure the LakeFS CLI with the endpoint, access key and secret key
```
lakectl config 
```
Now we have both the Minio client and the LakeFS CLI installed. We can now create a LakeFS repository that is connected to the Minio bucket. Run the following command in the terminal:
```
mc mb myminio/<bucket_name>
lakectl repo create lakefs://<repo_name> s3://<bucket_name>
```
Replace `<bucket_name>` with the name of the Minio bucket you created and `<repo_name>` with the name of the LakeFS repository you want to create.
You can now create branches, commits and other version control operations on the LakeFS repository. For more information, you can check the [LakeFS documentation](https://docs.lakefs.io/).