"""
ROYAL SCOUT — Master Submission Package Builder
Rajasthan Royals | SupeRR Selector Season 2 | IPL 2027 Auction Intelligence

Packages all official competition deliverables into a clean, self-contained ZIP archive:
- ROYAL_SCOUT_FINAL_SUBMISSION.zip
- exports/ROYAL_SCOUT_FINAL_SUBMISSION.zip

Excludes:
- node_modules, .venv, __pycache__, .git, large raw datasets (>50MB), OS metadata.
"""

import os
import zipfile
import shutil

def build_submission_zip():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    exports_dir = os.path.join(base_dir, "exports")
    os.makedirs(exports_dir, exist_ok=True)

    zip_filename = "ROYAL_SCOUT_FINAL_SUBMISSION.zip"
    target_zip = os.path.join(exports_dir, zip_filename)
    root_zip = os.path.join(base_dir, zip_filename)

    print(f"Creating master submission package at: {target_zip}")

    # Files to include explicitly from root
    root_files = [
        "ROYAL_SCOUT_FINAL_REPORT.pdf",
        "README.md",
        "SUBMISSION_README.md",
        "STATISTICAL_METHODOLOGY.md",
        "SCREENSHOTS.md",
        "package.json",
        "requirements.txt",
        "start.bat",
        ".env.example",
        ".gitignore"
    ]

    # Directories to walk with exclusion filters
    include_dirs = [
        "backend",
        "frontend",
        "scripts",
        "exports"
    ]

    # Excluded substrings or directory names
    exclude_patterns = [
        "node_modules",
        ".venv",
        "venv",
        "__pycache__",
        ".pytest_cache",
        ".vite",
        ".git",
        "dist",
        ".DS_Store",
        "Thumbs.db",
        zip_filename,
        "ROYAL_SCOUT_SUBMISSION_PACK.zip"
    ]

    with zipfile.ZipFile(target_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Add root files
        for rf in root_files:
            rf_path = os.path.join(base_dir, rf)
            if os.path.exists(rf_path):
                zf.write(rf_path, arcname=f"ROYAL_SCOUT/{rf}")
                print(f"  + Added root file: {rf}")
            else:
                print(f"  ! Warning: {rf} not found at root")

        # Add directories
        for d in include_dirs:
            dir_path = os.path.join(base_dir, d)
            if not os.path.exists(dir_path):
                continue

            for root, dirs, files in os.walk(dir_path):
                # Filter out excluded directories in-place
                dirs[:] = [sub for sub in dirs if not any(pat in sub for pat in exclude_patterns)]

                for file in files:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, base_dir)

                    if any(pat in rel_path for pat in exclude_patterns):
                        continue

                    # Don't include raw 40MB+ CSV files in frontend build
                    if file.endswith('.zip') or file.endswith('.pkl'):
                        continue

                    arcname = f"ROYAL_SCOUT/{rel_path}".replace("\\", "/")
                    zf.write(file_path, arcname=arcname)

    # Copy to root as well
    shutil.copy2(target_zip, root_zip)

    zip_size_mb = os.path.getsize(target_zip) / (1024 * 1024)
    print(f"\nSuccessfully generated master submission ZIP:")
    print(f"  Target: {target_zip} ({zip_size_mb:.2f} MB)")
    print(f"  Root:   {root_zip} ({zip_size_mb:.2f} MB)")

    # Print summary of archive contents
    with zipfile.ZipFile(target_zip, 'r') as zf:
        namelist = zf.namelist()
        print(f"Total files in submission archive: {len(namelist)}")

        top_files = [n for n in namelist if n.count('/') <= 2]
        print("\nTop-level archive structure:")
        for tf in top_files[:25]:
            print(f"  - {tf}")

if __name__ == "__main__":
    build_submission_zip()

