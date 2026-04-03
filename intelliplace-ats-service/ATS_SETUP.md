# ATS Service Setup

## Fix: "No Python at ..." (venv points to old Python)

Your virtual environment was created with Python 3.9 which is no longer at that path. Recreate the venv:

### 1. Deactivate and remove old venv

```powershell
deactivate
Remove-Item -Recurse -Force venv
```

### 2. Create new venv with current Python

```powershell
py -m venv venv
```

### 3. Activate venv

```powershell
.\venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```powershell
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 5. Run the service

```powershell
python main.py
```

Service runs at http://localhost:8000
